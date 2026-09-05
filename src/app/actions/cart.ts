'use server';

import { cookies } from 'next/headers';
import { createServerClient } from '@/lib/supabase';
import { revalidatePath } from 'next/cache';
import type { CartItem } from '@/types';

// Helper to get or create a session ID for guest carts
async function getCartSessionId() {
  const cookieStore = await cookies();
  let sessionId = cookieStore.get('cart_session_id')?.value;
  
  if (!sessionId) {
    sessionId = crypto.randomUUID();
    cookieStore.set('cart_session_id', sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 30, // 30 days
      path: '/',
    });
  }
  return sessionId;
}

// Get the current user's ID if logged in
async function getUserId() {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  return user?.id || null;
}

// Ensure a cart exists for the current user/session and return its ID
async function getOrCreateCartId(): Promise<string> {
  const supabase = await createServerClient();
  const userId = await getUserId();
  const sessionId = await getCartSessionId();

  // Try to find existing cart
  let query = supabase.from('carts').select('id').limit(1);
  if (userId) {
    query = query.eq('user_id', userId);
  } else {
    query = query.eq('session_id', sessionId);
  }

  const { data: existingCarts } = await query;
  
  if (existingCarts && existingCarts.length > 0) {
    return existingCarts[0].id;
  }

  // Create new cart
  const { data: newCart, error } = await supabase
    .from('carts')
    .insert({
      user_id: userId || null,
      session_id: !userId ? sessionId : null,
    })
    .select('id')
    .single();

  if (error || !newCart) {
    throw new Error('Failed to create cart');
  }

  return newCart.id;
}

export async function getCart(): Promise<CartItem[]> {
  const supabase = await createServerClient();
  const userId = await getUserId();
  const sessionId = await getCartSessionId();

  let query = supabase.from('carts').select('id, cart_items(*, product:products(*, images:product_images(*), variants:product_variants(*)))');
  
  if (userId) {
    query = query.eq('user_id', userId);
  } else {
    query = query.eq('session_id', sessionId);
  }

  const { data: cartData, error } = await query.single();

  if (error || !cartData || !cartData.cart_items) {
    return [];
  }

  // Format into our client-side CartItem type
  return cartData.cart_items.map((item: Record<string, unknown>) => {
    const product = item.product as Record<string, unknown>;
    const variant = (product?.variants as Record<string, unknown>[])?.find((v) => v.id === item.variant_id);
    
    return {
      id: item.id, // The database ID of the cart_item
      productId: item.product_id,
      variantId: item.variant_id,
      slug: (product?.slug as string) || '',
      title: (product?.title as string) || 'Unknown Product',
      image: ((product?.images as Record<string, unknown>[])?.[0]?.image_url as string) || null,
      price: (variant?.price as number) || (product?.sale_price as number) || (product?.price as number) || 0,
      wash: product?.wash || null,
      waistSize: variant?.waist_size || null,
      inseamLength: variant?.inseam_length || null,
      quantity: item.quantity,
      // We pass stock_quantity as an extra for the UI to use if needed
      stock_quantity: variant?.stock_quantity || 0,
    } as CartItem & { stock_quantity: number };
  });
}

export async function addToCart(productId: string, variantId: string, quantity: number) {
  const supabase = await createServerClient();
  const cartId = await getOrCreateCartId();

  // Validate inventory
  const { data: variant } = await supabase
    .from('product_variants')
    .select('stock_quantity')
    .eq('id', variantId)
    .single();

  if (!variant || variant.stock_quantity < quantity) {
    return { error: 'Not enough stock available.' };
  }

  // Check if item already exists in cart
  const { data: existingItem } = await supabase
    .from('cart_items')
    .select('id, quantity')
    .eq('cart_id', cartId)
    .eq('variant_id', variantId)
    .single();

  if (existingItem) {
    const newQuantity = existingItem.quantity + quantity;
    if (newQuantity > variant.stock_quantity) {
      return { error: 'Cannot add more than available stock.' };
    }
    
    await supabase
      .from('cart_items')
      .update({ quantity: newQuantity })
      .eq('id', existingItem.id);
  } else {
    await supabase
      .from('cart_items')
      .insert({
        cart_id: cartId,
        product_id: productId,
        variant_id: variantId,
        quantity: quantity
      });
  }

  revalidatePath('/');
  const cart = await getCart();
  return { success: true, cart };
}

export async function updateCartItem(cartItemId: string, variantId: string, quantity: number) {
  const supabase = await createServerClient();
  
  if (quantity <= 0) {
    return removeFromCart(cartItemId);
  }

  // Validate inventory
  const { data: variant } = await supabase
    .from('product_variants')
    .select('stock_quantity')
    .eq('id', variantId)
    .single();

  if (!variant || variant.stock_quantity < quantity) {
    return { error: 'Not enough stock available.' };
  }

  await supabase
    .from('cart_items')
    .update({ quantity })
    .eq('id', cartItemId);

  revalidatePath('/');
  const cart = await getCart();
  return { success: true, cart };
}

export async function removeFromCart(cartItemId: string) {
  const supabase = await createServerClient();
  await supabase
    .from('cart_items')
    .delete()
    .eq('id', cartItemId);
    
  revalidatePath('/');
  const cart = await getCart();
  return { success: true, cart };
}

export async function clearCart() {
  const supabase = await createServerClient();
  const userId = await getUserId();
  const sessionId = await getCartSessionId();

  let query = supabase.from('carts').select('id');
  if (userId) {
    query = query.eq('user_id', userId);
  } else {
    query = query.eq('session_id', sessionId);
  }

  const { data: cartData } = await query.single();
  
  if (cartData) {
    await supabase.from('cart_items').delete().eq('cart_id', cartData.id);
  }
  
  revalidatePath('/');
  return { success: true, cart: [] };
}

export async function mergeCart() {
  const supabase = await createServerClient();
  const userId = await getUserId();
  if (!userId) return { success: false }; // Not logged in

  const cookieStore = await cookies();
  const sessionId = cookieStore.get('cart_session_id')?.value;
  if (!sessionId) return { success: true }; // No guest cart to merge

  // Find guest cart
  const { data: guestCart } = await supabase
    .from('carts')
    .select('id')
    .eq('session_id', sessionId)
    .single();

  if (!guestCart) return { success: true }; // Nothing to merge

  // Find or create user cart
  const { data: userCart } = await supabase
    .from('carts')
    .select('id')
    .eq('user_id', userId)
    .single();

  if (!userCart) {
    // If user has no cart, just convert guest cart to user cart
    await supabase
      .from('carts')
      .update({ user_id: userId, session_id: null })
      .eq('id', guestCart.id);
      
    cookieStore.delete('cart_session_id');
    return { success: true };
  }

  // User has a cart, move items from guest cart to user cart
  const { data: guestItems } = await supabase
    .from('cart_items')
    .select('*')
    .eq('cart_id', guestCart.id);

  if (guestItems && guestItems.length > 0) {
    // Ideally we should merge quantities for duplicate variants,
    // but for simplicity we can just change the cart_id. (Requires DB constraint handling).
    // Let's do it item by item.
    for (const item of guestItems) {
      const { data: existingUserItem } = await supabase
        .from('cart_items')
        .select('id, quantity')
        .eq('cart_id', userCart.id)
        .eq('variant_id', item.variant_id)
        .single();
        
      if (existingUserItem) {
        await supabase
          .from('cart_items')
          .update({ quantity: existingUserItem.quantity + item.quantity })
          .eq('id', existingUserItem.id);
      } else {
        await supabase
          .from('cart_items')
          .insert({
            cart_id: userCart.id,
            product_id: item.product_id,
            variant_id: item.variant_id,
            quantity: item.quantity
          });
      }
    }
  }

  // Delete old guest cart
  await supabase.from('carts').delete().eq('id', guestCart.id);
  cookieStore.delete('cart_session_id');

  return { success: true };
}
