import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { createAdminClient } from '@/lib/supabase';

export async function POST(req: Request) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get('x-razorpay-signature');
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET || 'dummy_webhook_secret';

    if (!signature) {
      return NextResponse.json({ error: 'Missing signature' }, { status: 400 });
    }

    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(rawBody)
      .digest('hex');

    if (expectedSignature !== signature) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    const payload = JSON.parse(rawBody);
    console.log('Received Razorpay Webhook Event:', payload.event);

    const supabase = await createAdminClient();

    switch (payload.event) {
      case 'payment.captured': {
        const paymentEntity = payload.payload.payment.entity;
        const razorpayOrderId = paymentEntity.order_id;
        const razorpayPaymentId = paymentEntity.id;

        console.log('Payment Captured:', razorpayPaymentId, 'for Razorpay Order:', razorpayOrderId);

        // Fetch our order using razorpay_order_id
        const { data: order, error: fetchError } = await supabase
          .from('orders')
          .select('id, payment_status')
          .eq('razorpay_order_id', razorpayOrderId)
          .single();

        if (fetchError || !order) {
          console.error('Order not found for razorpay_order_id:', razorpayOrderId);
          // Still return 200 so Razorpay stops retrying if it's an invalid order
          return NextResponse.json({ success: true, warning: 'Order not found' });
        }

        // Idempotency check
        if (order.payment_status === 'paid') {
          console.log(`Order ${order.id} is already paid. Ignoring webhook.`);
          return NextResponse.json({ success: true });
        }

        // Update the order
        const { error: updateError } = await supabase
          .from('orders')
          .update({
            payment_status: 'paid',
            razorpay_payment_id: razorpayPaymentId,
          })
          .eq('id', order.id);

        if (updateError) {
          console.error('Failed to update order status:', updateError);
          return NextResponse.json({ error: 'Failed to update order' }, { status: 500 });
        }

        // Log to timeline
        await supabase.from('order_timeline').insert({
          order_id: order.id,
          status: 'paid',
          note: `Payment captured via Razorpay (${razorpayPaymentId})`
        });

        break;
      }
      
      case 'payment.failed': {
        const paymentEntity = payload.payload.payment.entity;
        const razorpayOrderId = paymentEntity.order_id;
        console.log('Payment Failed for Razorpay Order:', razorpayOrderId);
        
        // Find order
        const { data: order } = await supabase
          .from('orders')
          .select('id')
          .eq('razorpay_order_id', razorpayOrderId)
          .single();

        if (order) {
          await supabase
            .from('orders')
            .update({ payment_status: 'failed' })
            .eq('id', order.id);
            
          await supabase.from('order_timeline').insert({
            order_id: order.id,
            status: 'failed',
            note: 'Payment failed'
          });
        }
        break;
      }

      default:
        console.log('Unhandled event type:', payload.event);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Razorpay Webhook Error:', error);
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 });
  }
}
