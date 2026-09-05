'use server';

import { createServerClient } from '@/lib/supabase';
import Razorpay from 'razorpay';
import { z } from 'zod';
import { checkoutSchema, type CheckoutFormData } from '@/lib/checkout-validation';

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'dummy_key',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'dummy_secret',
});

export { type CheckoutFormData } from '@/lib/checkout-validation';

export async function createCheckoutOrder(formData: CheckoutFormData) {
  try {
    // 1. Validate Form Data
    const validatedData = checkoutSchema.parse(formData);

    // 2. Setup Supabase Server Client
    const supabase = await createServerClient();
    
    // Auth check (allow guests if needed, but let's assume we tie it to user if logged in)
    const { data: { user } } = await supabase.auth.getUser();

    // 3. Fetch User's Server Cart
    // Fetch User's Server Cart
    // In a real app we'd have a more robust session ID for guests, or we require login.
    // Assuming getCart functionality logic here for the user:
    let cartQuery = supabase
      .from('carts')
      .select('id, items:cart_items(id, product_id, variant_id, quantity, product:products(id, title, price, status), variant:product_variants(id, price, stock_quantity, sku, waist_size, inseam_length))')
      .order('created_at', { ascending: false })
      .limit(1);

    if (user) {
      cartQuery = cartQuery.eq('user_id', user.id);
    } else {
      return { error: 'You must be logged in to checkout.' }; // or handle guest carts
    }

    const { data: cartData, error: cartError } = await cartQuery.single();

    if (cartError || !cartData || !cartData.items || cartData.items.length === 0) {
      return { error: 'Your cart is empty or could not be found.' };
    }

    // 4. Server-Side Inventory Validation & Total Recalculation
    let subtotal = 0;
    const orderItems = [];

    for (const item of cartData.items as unknown as import('@/types').ServerCartItem[]) {
      const product = item.product;
      const variant = item.variant;

      if (!product || !variant) {
        return { error: 'Invalid item found in cart.' };
      }

      if (product.status !== 'active') {
        return { error: `Product ${product.title} is no longer available.` };
      }

      if (variant.stock_quantity < item.quantity) {
        return { error: `Not enough stock for ${product.title}. Only ${variant.stock_quantity} left.` };
      }

      // Use variant price if it exists, otherwise product price
      const unitPrice = variant.price ?? product.price;
      const lineTotal = unitPrice * item.quantity;
      subtotal += lineTotal;

      orderItems.push({
        product_id: product.id,
        variant_id: variant.id,
        title: product.title,
        waist_size: variant.waist_size,
        inseam_length: variant.inseam_length,
        quantity: item.quantity,
        unit_price: unitPrice,
        line_total: lineTotal,
      });
    }

    // Check coupon discount if provided
    let discountAmount = 0;
    let couponId: string | null = null;

    if (validatedData.couponCode && validatedData.couponCode.trim()) {
      const cleanCode = validatedData.couponCode.trim().toUpperCase();
      const { data: couponData } = await supabase
        .from('coupons')
        .select('*')
        .ilike('code', cleanCode)
        .eq('is_active', true)
        .maybeSingle();

      if (couponData) {
        const minOrder = couponData.min_order_amount || 0;
        if (subtotal >= minOrder) {
          couponId = couponData.id;
          if (couponData.type === 'percentage') {
            discountAmount = Math.round((subtotal * couponData.value) / 100);
          } else {
            discountAmount = Math.min(couponData.value, subtotal);
          }
          // Increment usage
          await supabase
            .from('coupons')
            .update({ times_used: (couponData.times_used || 0) + 1 })
            .eq('id', couponData.id);
        }
      }
    }

    const shipping = subtotal > 1999 ? 0 : 100;
    const total = Math.max(0, subtotal - discountAmount + shipping);

    // Generate an order number
    const orderNumber = 'ORD-' + Math.floor(100000 + Math.random() * 900000);

    // Prepare order payload
    const orderPayload = {
      order_number: orderNumber,
      user_id: user.id,
      email: validatedData.email,
      shipping_address: {
        first_name: validatedData.firstName,
        last_name: validatedData.lastName,
        address: validatedData.address,
        city: validatedData.city,
        state: validatedData.state,
        pincode: validatedData.pincode,
        phone: validatedData.phone,
      },
      shipping_cost: shipping,
      subtotal: subtotal,
      discount_amount: discountAmount,
      coupon_id: couponId,
      tax_amount: 0, // Simplified
      total: total,
      payment_method: validatedData.paymentMethod,
      payment_status: validatedData.paymentMethod === 'cod' ? 'cod_pending' : 'pending',
      fulfillment_status: 'pending',
    };

    // 5. Create Order in Database
    // Note: In production this should be a transaction.
    const { data: newOrder, error: orderInsertError } = await supabase
      .from('orders')
      .insert(orderPayload)
      .select('id')
      .single();

    if (orderInsertError || !newOrder) {
      console.error(orderInsertError);
      return { error: 'Failed to create order in database.' };
    }

    // Insert items
    const itemsPayload = orderItems.map(item => ({
      ...item,
      order_id: newOrder.id
    }));

    const { error: itemsInsertError } = await supabase
      .from('order_items')
      .insert(itemsPayload);

    if (itemsInsertError) {
      console.error(itemsInsertError);
      return { error: 'Failed to add items to order.' };
    }

    // Stock decrement is handled by a Postgres trigger on `order_items` (see migration 003).
    // The trigger will raise an exception and rollback the transaction if stock is insufficient.

    // Clear the cart
    await supabase.from('cart_items').delete().eq('cart_id', cartData.id);

    // 6. Handle Payment Method Specifics
    if (validatedData.paymentMethod === 'razorpay') {
      const options = {
        amount: total * 100, // in paise
        currency: 'INR',
        receipt: newOrder.id,
        payment_capture: 1,
      };

      const razorpayOrder = await razorpay.orders.create(options);

      // Update order with razorpay_order_id
      await supabase
        .from('orders')
        .update({ razorpay_order_id: razorpayOrder.id })
        .eq('id', newOrder.id);

      return { 
        success: true, 
        orderId: newOrder.id,
        razorpayOrderId: razorpayOrder.id,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        keyId: process.env.RAZORPAY_KEY_ID || 'dummy_key'
      };
    } else {
      // COD
      return { success: true, orderId: newOrder.id };
    }

  } catch (error: unknown) {
    console.error('Checkout error:', error);
    if (error instanceof z.ZodError) {
      return { error: (error as z.ZodError).issues[0].message };
    }
    const message = error instanceof Error ? error.message : 'An unexpected error occurred during checkout.';
    return { error: message };
  }
}
