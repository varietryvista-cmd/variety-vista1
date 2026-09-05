import { NextResponse } from 'next/server';
import { schedulePickup } from '@/lib/shiprocket';
import { createAdminClient } from '@/lib/supabase';

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const supabase = await createAdminClient();

    // Get order with shipment ID
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select('shiprocket_shipment_id')
      .eq('id', id)
      .single();

    if (orderError || !order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    const shipmentId = order.shiprocket_shipment_id?.toString();

    if (!shipmentId) {
      return NextResponse.json({ error: 'No shipment ID found' }, { status: 400 });
    }

    // Schedule pickup
    const pickupResponse = await schedulePickup(shipmentId);

    // Add to timeline
    await supabase.from('order_timeline').insert({
      order_id: id,
      status: 'shipped',
      note: `Pickup scheduled for shipment ${shipmentId}`,
    });

    return NextResponse.json({
      success: true,
      pickup_status: pickupResponse.pickup_status,
      message: pickupResponse.response,
    });
  } catch (e) {
    console.error('Schedule pickup error:', e);
    return NextResponse.json(
      { error: e instanceof Error ? e.message : 'Failed to schedule pickup' },
      { status: 500 }
    );
  }
}