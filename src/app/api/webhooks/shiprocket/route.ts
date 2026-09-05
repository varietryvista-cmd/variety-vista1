import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase';

// Shiprocket status mapping to internal fulfillment status
const SHIPROCKET_STATUS_MAP: Record<number, string> = {
  1: 'pending',      // New
  2: 'pending',      // AWB Assigned
  3: 'pending',      // Pickup Scheduled
  4: 'pending',      // Pickup Attempted
  5: 'processing',   // Pickup Done
  6: 'shipped',      // In Transit
  7: 'shipped',      // Out for Delivery
  8: 'delivered',    // Delivered
  9: 'rto',          // RTO Initiated
  10: 'rto',         // RTO In Transit
  11: 'rto',         // RTO Delivered
  12: 'cancelled',   // Cancelled
  13: 'rto',         // Lost
  14: 'delivered',   // Partial Delivered
  15: 'pending',     // Ready to Ship
  16: 'shipped',     // Manifested
  17: 'shipped',     // OfD (Out for Delivery)
};

export async function POST(req: Request) {
  try {
    // Verify webhook secret if configured
    const webhookSecret = process.env.SHIPROCKET_WEBHOOK_KEY;
    if (webhookSecret) {
      const apiKey = req.headers.get('x-api-key');
      if (apiKey !== webhookSecret) {
        console.warn('Shiprocket webhook: Invalid API key');
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
    }

    const payload = await req.json();
    console.log('Received Shiprocket Webhook:', JSON.stringify(payload, null, 2));

    const supabase = await createAdminClient();

    // Handle different payload structures
    // Shiprocket sends either single event or array of events
    const events = Array.isArray(payload) ? payload : [payload];

    for (const event of events) {
      const {
        awb,
        current_status_id,
        current_status,
        order_id,
        shipment_id,
        ndr_reason,
        ndr_action,
        delivery_date,
        expected_delivery_date,
        courier_name,
        courier_tracking_link,
        cod_amount,
      } = event;

      if (!order_id) {
        console.warn('Shiprocket webhook: No order_id in payload', event);
        continue;
      }

      // Find our order by shiprocket_order_id or order_id
      // Shiprocket order_id might be their internal ID or our order_number
      const orderQuery = supabase
        .from('orders')
        .select('id, fulfillment_status, shiprocket_order_id, shiprocket_shipment_id, awb_code, estimated_delivery_date')
        .or(`shiprocket_order_id.eq.${order_id},shiprocket_shipment_id.eq.${shipment_id},order_number.eq.${order_id},id.eq.${order_id}`)
        .limit(1);

      const { data: order, error: fetchError } = await orderQuery.single();

      if (fetchError || !order) {
        console.warn(`Shiprocket webhook: Order not found for order_id=${order_id}, shipment_id=${shipment_id}`);
        continue;
      }

      // Map Shiprocket status to internal status
      const newFulfillmentStatus = current_status_id ? SHIPROCKET_STATUS_MAP[current_status_id] : 'pending';

      // Determine update payload
      const updatePayload: Record<string, unknown> = {
        fulfillment_status: newFulfillmentStatus,
        updated_at: new Date().toISOString(),
      };

      if (awb) updatePayload.awb_code = awb;
      if (shipment_id) updatePayload.shiprocket_shipment_id = shipment_id;
      if (order_id && !order.shiprocket_order_id) updatePayload.shiprocket_order_id = order_id;
      if (courier_name) updatePayload.courier_name = courier_name;
      if (courier_tracking_link) updatePayload.tracking_status = courier_tracking_link;
      if (delivery_date) updatePayload.estimated_delivery_date = delivery_date;
      if (expected_delivery_date && !order.estimated_delivery_date) updatePayload.estimated_delivery_date = expected_delivery_date;
      if (cod_amount) updatePayload.cod_amount = cod_amount;

      // Update order
      const { error: updateError } = await supabase
        .from('orders')
        .update(updatePayload)
        .eq('id', order.id);

      if (updateError) {
        console.error('Shiprocket webhook: Failed to update order', updateError);
        continue;
      }

      // Log to timeline
      const statusText = current_status || 'Unknown';
      const timelineNote = `Shiprocket update: ${statusText}${awb ? ` (AWB: ${awb})` : ''}${shipment_id ? ` (Shipment: ${shipment_id})` : ''}${courier_name ? ` via ${courier_name}` : ''}`;

      await supabase.from('order_timeline').insert({
        order_id: order.id,
        status: newFulfillmentStatus,
        note: timelineNote,
      });

      // Handle NDR (Non-Delivery Report) events
      if (ndr_reason && ndr_action) {
        await supabase.from('order_timeline').insert({
          order_id: order.id,
          status: 'ndr',
          note: `NDR: ${ndr_reason} - Action: ${ndr_action}`,
        });
      }

      console.log(`Shiprocket webhook: Order ${order.id} updated to ${newFulfillmentStatus}`);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Shiprocket Webhook Error:', error);
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 });
  }
}