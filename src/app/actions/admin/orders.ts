'use server';

import { createAdminClient } from '@/lib/supabase';
import { revalidatePath } from 'next/cache';

// Fetch all orders for admin list
export async function getAdminOrders() {
  const supabase = await createAdminClient();
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Failed to fetch admin orders:', error);
    return { error: 'Failed to fetch orders' };
  }
  return { data };
}

// Fetch a single order with items and timeline
export async function getAdminOrder(id: string) {
  const supabase = await createAdminClient();
  const { data, error } = await supabase
    .from('orders')
    .select(`
      *,
      items:order_items(*, product:products(title, images:product_images(image_url)), variant:product_variants(sku, waist_size, inseam_length, colour)),
      timeline:order_timeline(*)
    `)
    .eq('id', id)
    .single();

  if (error) {
    console.error('Failed to fetch admin order:', error);
    return { error: 'Failed to fetch order' };
  }
  return { data };
}

// Update order status
export async function updateAdminOrderStatus(id: string, formData: FormData) {
  const supabase = await createAdminClient();
  const status = formData.get('status') as string;
  const paymentStatus = formData.get('payment_status') as string;
  const fulfillmentStatus = formData.get('fulfillment_status') as string;

  const updates: Record<string, string> = {};
  if (status) updates.status = status;
  if (paymentStatus) updates.payment_status = paymentStatus;
  if (fulfillmentStatus) updates.fulfillment_status = fulfillmentStatus;

  try {
    const { error } = await supabase
      .from('orders')
      .update(updates)
      .eq('id', id);

    if (error) throw error;
    
    // Add to timeline
    await supabase.from('order_timeline').insert({
      order_id: id,
      status: fulfillmentStatus || status || 'updated',
      note: 'Status updated by admin',
    });

    revalidatePath('/admin/orders');
    revalidatePath(`/admin/orders/${id}`);
    return { success: true };
  } catch (err: unknown) {
    console.error('Update order error:', err);
    return { error: err instanceof Error ? err.message : 'Failed to update order' };
  }
}
