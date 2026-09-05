import { Metadata } from 'next';
import { getOrderDetails } from '@/app/actions/orders';
import OrderDetailView from './OrderDetailView';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import { notFound } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Order Details | Variety Vista',
};

export default async function OrderDetailsPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const { id } = params;
  
  const { data: order, error } = await getOrderDetails(id);

  if (error || !order) {
    if (error === 'Not authenticated') {
      return (
        <div className="p-8 text-center text-red-600">
          Please log in to view this order.
        </div>
      );
    }
    notFound();
  }

  return (
    <div>
      <div className="mb-6">
        <Link 
          href="/account/orders" 
          className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors"
        >
          <ChevronLeft className="w-4 h-4 mr-1" /> Back to Orders
        </Link>
      </div>
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-bold text-[#111]">Order #{order.order_number}</h2>
          <p className="text-gray-500 mt-1">Placed on {new Date(order.created_at).toLocaleDateString()}</p>
        </div>
        
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-500">Status:</span>
          <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-gray-100 text-gray-800">
            {order.fulfillment_status}
          </span>
        </div>
      </div>

      <OrderDetailView order={order} />
    </div>
  );
}
