import { Metadata } from 'next';
import { DollarSign, ShoppingCart, Package, Users } from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Dashboard | Admin',
};

import { getDashboardStats } from '@/app/actions/admin';
import { formatPrice } from '@/lib/utils';
import { format } from 'date-fns';
import DashboardCharts from './DashboardCharts';

export default async function AdminDashboardPage() {
  const data = await getDashboardStats();

  const stats = [
    { name: 'Total Revenue', value: formatPrice(data.totalRevenue), icon: DollarSign },
    { name: 'Total Orders', value: data.totalOrders.toString(), icon: ShoppingCart },
    { name: 'Total Products', value: data.totalProducts.toString(), icon: Package },
    { name: 'Total Customers', value: data.totalCustomers.toString(), icon: Users },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard Overview</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.name} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center shrink-0">
                <Icon className="w-6 h-6 text-gray-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">{stat.name}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts & Analytics */}
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm mb-8">
        <h2 className="font-bold text-gray-900 mb-4">Revenue Overview (Last 7 Days)</h2>
        <DashboardCharts data={data.chartData} />
      </div>

      {/* Recent Orders Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-200 flex justify-between items-center">
          <h2 className="font-bold text-gray-900">Recent Orders</h2>
          <Link href="/admin/orders" className="text-sm text-blue-600 hover:underline">
            View All
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-500 text-sm">
                <th className="px-6 py-3 font-medium">Order ID</th>
                <th className="px-6 py-3 font-medium">Customer</th>
                <th className="px-6 py-3 font-medium">Date</th>
                <th className="px-6 py-3 font-medium">Total</th>
                <th className="px-6 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {data.recentOrders.length === 0 ? (
                <tr className="text-gray-900 text-center">
                  <td colSpan={5} className="px-6 py-8 text-gray-500">
                    No orders yet.
                  </td>
                </tr>
              ) : (
                data.recentOrders.map((order) => (
                  <tr key={order.id} className="text-gray-900">
                    <td className="px-6 py-4">
                      <Link href={`/admin/orders/${order.id}`} className="hover:underline text-blue-600">
                        {order.id.slice(0, 8)}...
                      </Link>
                    </td>
                    <td className="px-6 py-4">{order.user_id ? 'Registered User' : 'Guest'}</td>
                    <td className="px-6 py-4">{format(new Date(order.created_at), 'MMM d, yyyy')}</td>
                    <td className="px-6 py-4">{formatPrice(order.total_amount)}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                        order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
