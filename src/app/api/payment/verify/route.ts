import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { createAdminClient } from '@/lib/supabase';

export async function POST(req: Request) {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = await req.json();

    const secret = process.env.RAZORPAY_KEY_SECRET || 'dummy_secret';

    const generated_signature = crypto
      .createHmac('sha256', secret)
      .update(razorpay_order_id + '|' + razorpay_payment_id)
      .digest('hex');

    if (generated_signature === razorpay_signature) {
      // Signature is valid. Update order status in Supabase.
      const supabase = await createAdminClient();

      // Find order by razorpay_order_id
      const { data: order, error: fetchError } = await supabase
        .from('orders')
        .select('id, payment_status')
        .eq('razorpay_order_id', razorpay_order_id)
        .single();

      if (!fetchError && order) {
        // Idempotency check
        if (order.payment_status !== 'paid') {
          await supabase
            .from('orders')
            .update({
              payment_status: 'paid',
              razorpay_payment_id,
            })
            .eq('id', order.id);

          // Log to timeline
          await supabase.from('order_timeline').insert({
            order_id: order.id,
            status: 'paid',
            note: `Payment verified via Razorpay (${razorpay_payment_id})`
          });
        }
      }

      return NextResponse.json({ success: true, message: 'Payment verified successfully' });
    } else {
      return NextResponse.json({ success: false, error: 'Invalid signature' }, { status: 400 });
    }
  } catch (error: unknown) {
    console.error('Error verifying Razorpay payment:', error);
    return NextResponse.json(
      { error: 'Failed to verify payment' },
      { status: 500 }
    );
  }
}
