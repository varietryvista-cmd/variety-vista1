import { NextResponse } from 'next/server';
import { generateAWB } from '@/lib/shiprocket';
import { createAdminClient } from '@/lib/supabase';

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();

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

    const shipmentId = body.shipment_id || order.shiprocket_shipment_id?.toString();

    if (!shipmentId) {
      return NextResponse.json({ error: 'No shipment ID found' }, { status: 400 });
    }

    // Generate AWB
    const awbResponse = await generateAWB(shipmentId);
    const awbCode = awbResponse.response?.data?.awb_code || '';
    const courierName = awbResponse.response?.data?.courier_name || '';

    // Update order with AWB code
    const { error: updateError } = await supabase
      .from('orders')
      .update({
        awb_code: awbCode,
        courier_name: courierName,
        tracking_status: 'pending',
      })
      .eq('id', id);

    if (updateError) {
      console.error('Failed to update order with AWB:', updateError);
    }

    // Add to timeline
    await supabase.from('order_timeline').insert({
      order_id: id,
      status: 'shipped',
      note: `AWB generated: ${awbCode}. Courier: ${courierName}`,
    });

    return NextResponse.json({
      success: true,
      awb_code: awbCode,
      shipment_id: shipmentId,
      courier_name: courierName,
      tracking_url: `https://shiprocket.co//tracking/${awbCode}`,
    });
  } catch (e) {
    console.error('Generate AWB error:', e);
    return NextResponse.json(
      { error: e instanceof Error ? e.message : 'Failed to generate AWB' },
      { status: 500 }
    );
  }
}