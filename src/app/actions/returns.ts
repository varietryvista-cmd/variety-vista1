'use server';

import { createServerClient } from '@/lib/supabase';
import { revalidatePath } from 'next/cache';

export interface ReturnRequestPayload {
  orderId: string;
  orderNumber: string;
  type: 'return' | 'exchange';
  reason: string;
  comments?: string;
  requestedExchangeSize?: string;
  items: Array<{
    title: string;
    waistSize?: string | number;
    quantity: number;
  }>;
}

export async function submitReturnRequest(data: ReturnRequestPayload) {
  try {
    const supabase = await createServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return { error: 'Please log in to submit a return or exchange request.' };
    }

    // Verify order belongs to user
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select('id, order_number, user_id, fulfillment_status')
      .eq('id', data.orderId)
      .eq('user_id', user.id)
      .single();

    if (orderError || !order) {
      return { error: 'Order not found or access denied.' };
    }

    // Record note / return event in order_timeline or order status
    const returnNote = `[${data.type.toUpperCase()} REQUESTED] Reason: ${data.reason}. ${
      data.requestedExchangeSize ? `Exchange to Size: ${data.requestedExchangeSize}. ` : ''
    }${data.comments ? `Notes: ${data.comments}` : ''}`;

    // Insert timeline update
    await supabase.from('order_timeline').insert({
      order_id: data.orderId,
      status: data.type === 'exchange' ? 'exchange_requested' : 'return_requested',
      note: returnNote,
    });

    revalidatePath(`/account/orders/${data.orderId}`);
    return {
      success: true,
      message: `Your ${data.type === 'exchange' ? 'exchange' : 'return'} request for Order #${order.order_number} has been submitted! Our concierge team will contact you within 24 hours to arrange reverse pickup.`,
    };
  } catch (err) {
    console.error('Submit return request error:', err);
    return { error: 'Unable to submit return request. Please try again or contact support.' };
  }
}
