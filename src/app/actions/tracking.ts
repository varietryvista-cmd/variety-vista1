'use server';

import { createServerClient } from '@/lib/supabase';

export interface TrackingStep {
  title: string;
  description: string;
  date?: string;
  isCompleted: boolean;
  isCurrent: boolean;
}

export interface TrackedOrder {
  orderNumber: string;
  createdAt: string;
  fulfillmentStatus: string;
  paymentStatus: string;
  paymentMethod: string;
  total: number;
  subtotal: number;
  discountAmount: number;
  shippingCost: number;
  shippingCity: string;
  shippingState: string;
  trackingNumber?: string;
  courierName?: string;
  items: Array<{
    title: string;
    waistSize?: string | number;
    inseamLength?: string | number;
    quantity: number;
    unitPrice: number;
  }>;
  timeline: TrackingStep[];
}

export async function trackOrder(
  query: string
): Promise<{ success: boolean; message?: string; order?: TrackedOrder }> {
  if (!query || !query.trim()) {
    return { success: false, message: 'Please enter your Order Number or registered Email/Phone.' };
  }

  const cleanQuery = query.trim();

  try {
    const supabase = await createServerClient();

    // Query by order_number or email
    const dbQuery = supabase
      .from('orders')
      .select('*, items:order_items(*)')
      .or(`order_number.ilike.%${cleanQuery}%,email.ilike.%${cleanQuery}%`)
      .order('created_at', { ascending: false })
      .limit(1);

    const { data, error } = await dbQuery.maybeSingle();

    if (error || !data) {
      return {
        success: false,
        message: `No order found for "${cleanQuery}". Please double check your order number or email.`,
      };
    }

    const order = data;
    const status = (order.fulfillment_status || 'pending').toLowerCase();
    const createdDate = new Date(order.created_at).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });

    // Compute Timeline
    const steps: TrackingStep[] = [
      {
        title: 'Order Placed',
        description: 'We received your order and payment details.',
        date: createdDate,
        isCompleted: true,
        isCurrent: status === 'pending' || status === 'unfulfilled',
      },
      {
        title: 'Processing & Quality Check',
        description: 'Our denim artisans inspect and pack your garments.',
        isCompleted: ['processing', 'shipped', 'in_transit', 'out_for_delivery', 'delivered'].includes(status),
        isCurrent: status === 'processing',
      },
      {
        title: 'Dispatched from Studio',
        description: 'Handed over to courier logistics partner.',
        isCompleted: ['shipped', 'in_transit', 'out_for_delivery', 'delivered'].includes(status),
        isCurrent: status === 'shipped',
      },
      {
        title: 'In Transit',
        description: 'Package is on its way to your destination city.',
        isCompleted: ['in_transit', 'out_for_delivery', 'delivered'].includes(status),
        isCurrent: status === 'in_transit',
      },
      {
        title: 'Out for Delivery',
        description: 'Courier executive is on the way to deliver your parcel.',
        isCompleted: ['out_for_delivery', 'delivered'].includes(status),
        isCurrent: status === 'out_for_delivery',
      },
      {
        title: 'Delivered',
        description: 'Package successfully received at shipping address.',
        isCompleted: status === 'delivered',
        isCurrent: status === 'delivered',
      },
    ];

    const shippingAddress = order.shipping_address || {};

    const items = (order.items || []).map((item: any) => ({
      title: item.title || 'Premium Denim',
      waistSize: item.waist_size,
      inseamLength: item.inseam_length,
      quantity: item.quantity || 1,
      unitPrice: item.unit_price || 0,
    }));

    return {
      success: true,
      order: {
        orderNumber: order.order_number || 'VV-10001',
        createdAt: createdDate,
        fulfillmentStatus: order.fulfillment_status || 'Pending',
        paymentStatus: order.payment_status || 'Pending',
        paymentMethod: order.payment_method || 'Online',
        total: order.total || 0,
        subtotal: order.subtotal || order.total || 0,
        discountAmount: order.discount_amount || 0,
        shippingCost: order.shipping_cost || 0,
        shippingCity: shippingAddress.city || 'Mumbai',
        shippingState: shippingAddress.state || 'Maharashtra',
        trackingNumber: order.tracking_number,
        courierName: order.courier_name || 'Shiprocket Express',
        items,
        timeline: steps,
      },
    };
  } catch (err) {
    console.error('Error tracking order:', err);
    return { success: false, message: 'Unable to look up order. Please try again later.' };
  }
}
