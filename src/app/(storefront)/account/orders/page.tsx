import { Metadata } from 'next';
import Link from 'next/link';
import { getUserOrders } from '@/app/actions/orders';
import { ChevronRight, Truck } from 'lucide-react';
import { format } from 'date-fns';

export const metadata: Metadata = {
  title: 'Orders | Variety Vista',
};

export default async function OrdersPage() {
  const { data: orders, error } = await getUserOrders();

  return (
    <div>
      <h2 className="text-2xl font-bold text-[#111] mb-2">Order History</h2>
      <p className="text-gray-600 mb-8">
        Check the status of recent orders, manage returns, and discover similar products.
      </p>

      {error ? (
        <div className="bg-red-50 text-red-600 p-4 rounded-md mb-8">
          {error}
        </div>
      ) : null}

      {!orders || orders.length === 0 ? (
        <div className="border border-gray-100 rounded-xl overflow-hidden">
          <div className="p-12 text-center text-gray-500">
            <p className="mb-4">You haven&apos;t placed any orders yet.</p>
            <Link href="/collections/all" className="inline-block bg-[#111] text-white px-6 py-2.5 rounded-full font-medium hover:bg-gray-800 transition-colors">
              Start Shopping
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => {
            let statusColor = "bg-gray-100 text-gray-700";
            if (order.fulfillment_status === 'delivered') statusColor = "bg-green-100 text-green-700";
            if (order.fulfillment_status === 'shipped') statusColor = "bg-blue-100 text-blue-700";
            if (order.fulfillment_status === 'cancelled') statusColor = "bg-red-100 text-red-700";
            
            return (
              <div key={order.id} className="border border-gray-200 rounded-xl overflow-hidden bg-white">
                <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex flex-wrap gap-x-8 gap-y-2">
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">Order Number</p>
                      <p className="text-sm font-medium text-gray-900">{order.order_number}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">Date Placed</p>
                      <p className="text-sm text-gray-900">{format(new Date(order.created_at), 'MMM d, yyyy')}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">Total Amount</p>
                      <p className="text-sm font-medium text-gray-900">₹{order.total.toLocaleString()}</p>
                    </div>
                  </div>
                  
                  <Link 
                    href={`/account/orders/${order.id}`}
                    className="flex items-center text-sm font-medium text-blue-600 hover:text-blue-800 shrink-0"
                  >
                    View Details <ChevronRight className="w-4 h-4 ml-1" />
                  </Link>
                </div>
                
                <div className="px-6 py-5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`px-3 py-1 rounded-full text-xs font-medium uppercase tracking-wider ${statusColor}`}>
                      {order.fulfillment_status}
                    </div>
                    {order.awb_code && (
                      <div className="flex items-center text-sm text-gray-600 gap-1.5">
                        <Truck className="w-4 h-4" />
                        <span>Tracking: {order.awb_code}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
