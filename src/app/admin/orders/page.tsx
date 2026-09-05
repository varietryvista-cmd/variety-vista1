import { Metadata } from 'next';
import Link from 'next/link';
import { Download } from 'lucide-react';
import Button from '@/components/ui/CustomButton';
import { getAdminOrders } from '@/app/actions/admin/orders';
import { formatPrice } from '@/lib/utils';
import { format } from 'date-fns';

export const metadata: Metadata = {
  title: 'Orders | Admin',
};

export default async function AdminOrdersPage() {
  const { data: orders } = await getAdminOrders();
  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
        <Button variant="outline" className="flex items-center gap-2">
          <Download className="w-4 h-4" />
          Export
        </Button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
          <input 
            type="text"
            placeholder="Search orders..."
            className="border border-gray-300 rounded-md px-3 py-1.5 text-sm w-full max-w-xs focus:ring-2 focus:ring-[#111] focus:border-transparent outline-none"
          />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-500 text-sm">
                <th className="px-6 py-3 font-medium">Order ID</th>
                <th className="px-6 py-3 font-medium">Date</th>
                <th className="px-6 py-3 font-medium">Customer</th>
                <th className="px-6 py-3 font-medium">Total</th>
                <th className="px-6 py-3 font-medium">Fulfillment</th>
                <th className="px-6 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {orders?.map((order: { id: string; order_number: string; created_at: string; email: string; total: number; fulfillment_status: string; shipping_address: Record<string, string> }) => (
                <tr key={order.id} className="text-gray-900">
                  <td className="px-6 py-4 font-medium">#{order.order_number || order.id.slice(0, 8)}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{format(new Date(order.created_at), 'MMM d, yyyy h:mm a')}</td>
                  <td className="px-6 py-4">{order.email || order.shipping_address?.full_name || 'Guest'}</td>
                  <td className="px-6 py-4">{formatPrice(order.total)}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      order.fulfillment_status === 'delivered' ? 'bg-green-100 text-green-800' : 
                      order.fulfillment_status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {order.fulfillment_status || 'unfulfilled'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <Link href={`/admin/orders/${order.id}`} className="text-sm text-blue-600 hover:underline">View</Link>
                  </td>
                </tr>
              ))}
              {(!orders || orders.length === 0) && (
                <tr>
                  <td colSpan={6} className="py-16 text-center">
                    <div className="flex flex-col items-center justify-center text-gray-500">
                      <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                        </svg>
                      </div>
                      <p className="font-medium text-gray-900 mb-1">No orders yet</p>
                      <p className="text-sm">When customers place orders, they will appear here.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
