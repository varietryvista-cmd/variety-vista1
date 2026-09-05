import * as React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { createServerClient } from '@supabase/ssr';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Users, 
  Layers,
  Percent,
  Settings,
  Image as ImageIcon
} from 'lucide-react';
import SignOutButton from '../(storefront)/account/SignOutButton';

export const metadata: Metadata = {
  title: 'Admin Dashboard | Variety Vista',
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Verify admin role
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (!profile || profile.role !== 'admin') {
    redirect('/');
  }

  const navItems = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Products', href: '/admin/products', icon: Package },
    { name: 'Orders', href: '/admin/orders', icon: ShoppingCart },
    { name: 'Customers', href: '/admin/customers', icon: Users },
    { name: 'Collections', href: '/admin/collections', icon: Layers },
    { name: 'Coupons', href: '/admin/coupons', icon: Percent },
    { name: 'Media', href: '/admin/media', icon: ImageIcon },
    { name: 'Settings', href: '/admin/settings', icon: Settings },
  ];

  return (
    <div className="bg-gray-100 min-h-screen flex">
      {/* Sidebar */}
      <aside className="w-64 bg-[#111] text-white hidden md:flex flex-col shrink-0">
        <div className="p-6 border-b border-gray-800">
          <Link href="/" className="font-bold text-xl tracking-tight text-white flex items-center gap-2">
            <Package className="w-6 h-6 text-white" />
            Variety Vista
          </Link>
          <div className="mt-1 text-xs text-gray-400">Admin Panel</div>
        </div>
        
        <nav className="flex-1 overflow-y-auto py-6 px-3 flex flex-col gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-300 hover:bg-gray-800 hover:text-white font-medium transition-colors"
              >
                <Icon className="w-5 h-5 text-gray-400" />
                {item.name}
              </Link>
            );
          })}
        </nav>
        
        <div className="p-4 border-t border-gray-800">
          <SignOutButton />
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Mobile Header */}
        <header className="md:hidden bg-[#111] text-white p-4 flex justify-between items-center shrink-0">
          <span className="font-bold">Variety Vista Admin</span>
          {/* Mobile menu toggle would go here */}
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
