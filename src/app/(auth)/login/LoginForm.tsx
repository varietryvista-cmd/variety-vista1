'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createBrowserClient } from '@supabase/ssr';
import Button from '@/components/ui/CustomButton';
import { mergeCart } from '@/app/actions/cart';

export default function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      await mergeCart();
      router.refresh();
      
      // Check if user is admin and redirect accordingly
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single();
        
        if (profile?.role === 'admin') {
          router.push('/admin');
        } else {
          router.push('/account');
        }
      } else {
        router.push('/account');
      }
    }
  };

  return (
    <form className="space-y-6" onSubmit={handleLogin}>
      {error && (
        <div className="bg-red-50 text-red-600 text-sm p-3 rounded-md text-center">
          {error}
        </div>
      )}
      
      <div>
        <label className="block text-sm font-medium leading-6 text-gray-900">
          Email address
        </label>
        <div className="mt-2">
          <input
            name="email"
            type="email"
            required
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#111] sm:text-sm sm:leading-6"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium leading-6 text-gray-900">
          Password
        </label>
        <div className="mt-2">
          <input
            name="password"
            type="password"
            required
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#111] sm:text-sm sm:leading-6"
          />
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <input
            id="remember-me"
            name="remember-me"
            type="checkbox"
            className="h-4 w-4 rounded border-gray-300 text-[#111] focus:ring-[#111]"
          />
          <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
            Remember me
          </label>
        </div>

        <div className="text-sm leading-6">
          <Link href="/forgot-password" className="font-semibold text-[#111] hover:text-[#333]">
            Forgot password?
          </Link>
        </div>
      </div>

      <div>
        <Button type="submit" fullWidth loading={loading}>
          Sign in
        </Button>
      </div>

      <p className="mt-10 text-center text-sm text-gray-500">
        Not a member?{' '}
        <Link href="/signup" className="font-semibold leading-6 text-[#111] hover:text-[#333]">
          Create an account
        </Link>
      </p>
    </form>
  );
}
