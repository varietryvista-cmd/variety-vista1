'use server';

import { createAdminClient } from '@/lib/supabase';
import { revalidatePath } from 'next/cache';
import type { Coupon } from '@/types';

export async function getAdminCoupons() {
  const supabase = await createAdminClient();
  const { data, error } = await supabase
    .from('coupons')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Failed to fetch coupons:', error);
    return { data: [] as Coupon[], error: 'Failed to fetch coupons' };
  }

  return { data: (data || []) as Coupon[] };
}

export async function createAdminCoupon(data: {
  code: string;
  type: 'percentage' | 'fixed';
  value: number;
  min_order_amount?: number;
  usage_limit?: number;
  valid_from?: string;
  valid_to?: string;
  is_active?: boolean;
}) {
  const supabase = await createAdminClient();

  if (!data.code || !data.code.trim()) {
    return { error: 'Coupon code is required.' };
  }
  if (!data.value || data.value <= 0) {
    return { error: 'Coupon discount value must be greater than 0.' };
  }

  const payload = {
    code: data.code.trim().toUpperCase(),
    type: data.type,
    value: data.value,
    min_order_amount: data.min_order_amount || 0,
    usage_limit: data.usage_limit || null,
    valid_from: data.valid_from ? new Date(data.valid_from).toISOString() : null,
    valid_to: data.valid_to ? new Date(data.valid_to).toISOString() : null,
    is_active: data.is_active !== undefined ? data.is_active : true,
    times_used: 0,
  };

  const { error } = await supabase.from('coupons').insert(payload);

  if (error) {
    console.error('Failed to create coupon:', error);
    return { error: error.message.includes('unique') ? 'A coupon with this code already exists.' : 'Failed to create coupon.' };
  }

  revalidatePath('/admin/coupons');
  return { success: true };
}

export async function toggleAdminCoupon(id: string, is_active: boolean) {
  const supabase = await createAdminClient();
  const { error } = await supabase
    .from('coupons')
    .update({ is_active })
    .eq('id', id);

  if (error) {
    console.error('Failed to toggle coupon:', error);
    return { error: 'Failed to update coupon status.' };
  }

  revalidatePath('/admin/coupons');
  return { success: true };
}

export async function deleteAdminCoupon(id: string) {
  const supabase = await createAdminClient();
  const { error } = await supabase
    .from('coupons')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Failed to delete coupon:', error);
    return { error: 'Failed to delete coupon.' };
  }

  revalidatePath('/admin/coupons');
  return { success: true };
}
