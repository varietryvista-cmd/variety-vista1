import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase';

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();

    const supabase = await createAdminClient();

    // Get order with AWB code
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select('awb_code, shiprocket_shipment_id, courier_name')
      .eq('id', id)
      .single();

    if (orderError || !order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    const awbCode = body.awb_code || order.awb_code;
    const shipmentId = order.shiprocket_shipment_id?.toString();

    if (!shipmentId && !awbCode) {
      return NextResponse.json({ error: 'No shipment ID or AWB code found' }, { status: 400 });
    }

    const labelUrl = shipmentId
      ? `https://apiv2.shiprocket.in/v1/external/courier/print/label/${shipmentId}`
      : `https://apiv2.shiprocket.in/v1/external/courier/print/awb/${awbCode}`;

    // Add to timeline
    await supabase.from('order_timeline').insert({
      order_id: id,
      status: 'shipped',
      note: `Shipping label printed for AWB: ${awbCode}`,
    });

    return NextResponse.json({
      success: true,
      label_url: labelUrl,
      message: 'Opening label in new tab for printing',
    });
  } catch (e) {
    console.error('Print label error:', e);
    return NextResponse.json(
      { error: e instanceof Error ? e.message : 'Failed to generate label' },
      { status: 500 }
    );
  }
}