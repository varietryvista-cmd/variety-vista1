'use server';

import { createServerClient } from '@/lib/supabase';
import type { Order } from '@/types';

export async function getUserOrders() {
  try {
    const supabase = await createServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return { error: 'Not authenticated' };
    }

    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      return { error: error.message };
    }

    return { data: data as Order[] };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'An error occurred fetching orders';
    return { error: message };
  }
}

export async function getOrderDetails(id: string) {
  try {
    const supabase = await createServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return { error: 'Not authenticated' };
    }

    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        items:order_items(*),
        timeline:order_timeline(*)
      `)
      .eq('id', id)
      .eq('user_id', user.id)
      .single();

    if (error) {
      return { error: error.message };
    }

    // Sort timeline by created_at descending
    if (data && data.timeline) {
      data.timeline.sort((a: import('@/types').OrderTimeline, b: import('@/types').OrderTimeline) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    }

    return { data: data as Order };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'An error occurred fetching order details';
    return { error: message };
  }
}
