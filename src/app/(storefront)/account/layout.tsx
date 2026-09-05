import * as React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { createServerClient } from '@supabase/ssr';
import { User, Package, Heart, Settings, MapPin } from 'lucide-react';
import SignOutButton from './SignOutButton';

export const metadata: Metadata = {
  title: 'My Account | Variety Vista',
};

export default async function AccountLayout({
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

  const navItems = [
    { name: 'Dashboard', href: '/account', icon: User },
    { name: 'Orders', href: '/account/orders', icon: Package },
    { name: 'Addresses', href: '/account/addresses', icon: MapPin },
    { name: 'Wishlist', href: '/account/wishlist', icon: Heart },
    { name: 'Settings', href: '/account/settings', icon: Settings },
  ];

  return (
    <div className="bg-gray-50 min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-[#111] mb-8">My Account</h1>
        
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="w-full lg:w-64 shrink-0">
            <nav className="flex flex-col gap-1 bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-700 hover:bg-gray-50 hover:text-[#111] font-medium transition-colors"
                  >
                    <Icon className="w-5 h-5 text-gray-400" />
                    {item.name}
                  </Link>
                );
              })}
              <div className="h-px bg-gray-200 my-2 mx-3" />
              <SignOutButton />
            </nav>
          </div>

          {/* Main Content */}
          <div className="flex-1 bg-white p-6 md:p-8 rounded-xl border border-gray-100 shadow-sm">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
