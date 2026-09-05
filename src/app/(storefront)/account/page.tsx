import { Package, MapPin, Heart } from 'lucide-react';
import Link from 'next/link';

export default function AccountDashboardPage() {

  const stats = [
    { name: 'Total Orders', value: '0', icon: Package, href: '/account/orders' },
    { name: 'Saved Addresses', value: '1', icon: MapPin, href: '/account/settings' },
    { name: 'Wishlist Items', value: '0', icon: Heart, href: '/account/wishlist' },
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold text-[#111] mb-2">Welcome back!</h2>
      <p className="text-gray-600 mb-8">
        Manage your account settings, track orders, and view your wishlist.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Link 
              key={stat.name} 
              href={stat.href}
              className="bg-gray-50 border border-gray-100 p-6 rounded-xl flex items-center gap-4 hover:border-gray-300 transition-colors"
            >
              <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shrink-0 shadow-sm text-gray-700">
                <Icon className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">{stat.name}</p>
                <p className="text-2xl font-bold text-[#111]">{stat.value}</p>
              </div>
            </Link>
          );
        })}
      </div>

      <div className="border border-gray-100 rounded-xl overflow-hidden">
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex justify-between items-center">
          <h3 className="font-semibold text-[#111]">Recent Orders</h3>
          <Link href="/account/orders" className="text-sm text-blue-600 hover:underline">
            View All
          </Link>
        </div>
        <div className="p-6 text-center text-gray-500">
          You haven&apos;t placed any orders yet.
        </div>
      </div>
    </div>
  );
}
