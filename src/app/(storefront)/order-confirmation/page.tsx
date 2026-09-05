import { Suspense } from 'react';
import { Metadata } from 'next';
import { createServerClient } from '@/lib/supabase';
import OrderConfirmationView from './OrderConfirmationView';
import type { Order, OrderItem } from '@/types';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Order Confirmed | Variety Vista',
  description: 'Thank you for your order.',
};

export default async function OrderConfirmationPage({ searchParams }: { searchParams: Promise<{ id?: string }> }) {
  const params = await searchParams;
  const orderId = params.id;

  let order: Order | null = null;
  let orderItems: OrderItem[] = [];

  if (orderId) {
    const supabase = await createServerClient();
    const { data: orderData } = await supabase
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .single();

    if (orderData) {
      order = orderData;
      const { data: itemsData } = await supabase
        .from('order_items')
        .select('*, product:products(title, slug, images:product_images(image_url))')
        .eq('order_id', orderId);
      orderItems = itemsData || [];
    }
  }

  return (
    <div className="bg-gray-50 min-h-screen pt-12 pb-24">
      <Suspense fallback={<div className="max-w-3xl mx-auto px-4 py-12 text-center text-gray-500">Loading order details...</div>}>
        <OrderConfirmationView order={order} orderItems={orderItems} />
      </Suspense>
    </div>
  );
}
