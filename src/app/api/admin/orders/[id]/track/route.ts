import { NextResponse } from 'next/server';
import { trackShipment } from '@/lib/shiprocket';
import { createAdminClient } from '@/lib/supabase';

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const awbCode = body.awb_code;

    const supabase = await createAdminClient();

    // Get order with AWB code
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select('awb_code, shiprocket_shipment_id')
      .eq('id', id)
      .single();

    if (orderError || !order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    const finalAwbCode = awbCode || order.awb_code;

    if (!finalAwbCode) {
      return NextResponse.json({ error: 'No AWB code found' }, { status: 400 });
    }

    // Track shipment
    const trackingData = await trackShipment(finalAwbCode);

    // Update order with tracking data if available
    const trackingInfo = (trackingData?.tracking_data as any)?.shipment_track;
    if (Array.isArray(trackingInfo) && trackingInfo.length > 0) {
      const latestTrack = trackingInfo[0];
      const latestStatus = latestTrack?.activity || 'in_transit';

      // Update tracking status
      await supabase
        .from('orders')
        .update({
          tracking_status: latestStatus,
        })
        .eq('id', id);
    }

    // Add to timeline
    await supabase.from('order_timeline').insert({
      order_id: id,
      status: 'shipped',
      note: `Tracking updated. Latest status: ${trackingInfo?.[0]?.activity || 'in transit'}`,
    });

    return NextResponse.json({
      success: true,
      tracking: trackingData,
    });
  } catch (e) {
    console.error('Track shipment error:', e);
    return NextResponse.json(
      { error: e instanceof Error ? e.message : 'Failed to track shipment' },
      { status: 500 }
    );
  }
}