import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase';
import { createShiprocketOrder, checkServiceability } from '@/lib/shiprocket';

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();

    const supabase = await createAdminClient();

    // Fetch order with items and shipping address
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select(`
        *,
        items:order_items(*, product:products(*), variant:product_variants(*)),
        shipping_address:shipping_address(*)
      `)
      .eq('id', id)
      .single();

    if (orderError || !order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    // Check serviceability
    const pickupPincode = body.pickup_pincode || process.env.SHIPROCKET_PICKUP_PINCODE;
    const deliveryPincode = order.shipping_address?.pincode;
    const weight = body.weight || 0.5;
    const cod = order.payment_method === 'cod';

    if (!pickupPincode || !deliveryPincode) {
      return NextResponse.json({ error: 'Missing pincodes' }, { status: 400 });
    }

    const serviceability = await checkServiceability(
      pickupPincode,
      deliveryPincode,
      weight,
      cod
    );

    if (!serviceability.available) {
      return NextResponse.json({ error: 'Service not available for this pincode' }, { status: 400 });
    }

    // Prepare Shiprocket order
    const orderItems = order.items?.map((item: any) => ({
      name: item.title,
      sku: item.variant?.sku || item.product_id,
      units: item.quantity,
      selling_price: item.unit_price,
      discount: 0,
      tax: 0,
      hsn: 6204,
    })) || [];

    const shippingAddr = order.shipping_address;
    const billingAddr = order.billing_address;

    const shiprocketPayload = {
      order_id: order.order_number || order.id.slice(0, 12),
      order_date: new Date(order.created_at).toISOString().split('T')[0],
      pickup_location: process.env.SHIPROCKET_PICKUP_LOCATION || 'Primary',
      billing_customer_name: billingAddr?.full_name || shippingAddr?.full_name || 'Customer',
      billing_last_name: '',
      billing_address: billingAddr?.address_line1 || shippingAddr?.address_line1 || '',
      billing_address_2: billingAddr?.address_line2 || shippingAddr?.address_line2 || '',
      billing_city: billingAddr?.city || shippingAddr?.city || '',
      billing_pincode: billingAddr?.pincode || shippingAddr?.pincode || '',
      billing_state: billingAddr?.state || shippingAddr?.state || '',
      billing_country: billingAddr?.country || shippingAddr?.country || 'India',
      billing_email: order.email,
      billing_phone: billingAddr?.phone || shippingAddr?.phone || '',
      shipping_is_billing: true,
      shipping_customer_name: shippingAddr?.full_name || '',
      shipping_address: shippingAddr?.address_line1 || '',
      shipping_address_2: shippingAddr?.address_line2 || '',
      shipping_city: shippingAddr?.city || '',
      shipping_pincode: shippingAddr?.pincode || '',
      shipping_state: shippingAddr?.state || '',
      shipping_country: shippingAddr?.country || 'India',
      shipping_email: order.email,
      shipping_phone: shippingAddr?.phone || '',
      order_items: orderItems,
      payment_method: (order.payment_method === 'cod' ? 'COD' : 'Prepaid') as 'Prepaid' | 'COD',
      shipping_charges: order.shipping_cost || 0,
      sub_total: order.subtotal,
      length: 10,
      breadth: 10,
      height: 5,
      weight: weight,
    };

    // Create Shiprocket order
    const shiprocketResponse = await createShiprocketOrder(shiprocketPayload);

    // Update order with Shiprocket details
    const { error: updateError } = await supabase
      .from('orders')
      .update({
        shiprocket_order_id: shiprocketResponse.order_id,
        shiprocket_shipment_id: shiprocketResponse.shipment_id,
        courier_name: shiprocketResponse.courier_name,
      })
      .eq('id', id);

    if (updateError) {
      console.error('Failed to update order with Shiprocket details:', updateError);
    }

    // Add to timeline
    await supabase.from('order_timeline').insert({
      order_id: id,
      status: 'shipped',
      note: `Shipment created with ${shiprocketResponse.courier_name}. Shipment ID: ${shiprocketResponse.shipment_id}`,
    });

    return NextResponse.json({
      success: true,
      shipment_id: shiprocketResponse.shipment_id,
      awb_code: shiprocketResponse.awb_code,
      courier_name: shiprocketResponse.courier_name,
    });
  } catch (e) {
    console.error('Ship order error:', e);
    return NextResponse.json(
      { error: e instanceof Error ? e.message : 'Failed to create shipment' },
      { status: 500 }
    );
  }
}