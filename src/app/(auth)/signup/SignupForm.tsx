'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createBrowserClient } from '@supabase/ssr';
import Button from '@/components/ui/CustomButton';

export default function SignupForm() {
  const router = useRouter();
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${location.origin}/auth/callback`,
      }
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      router.push('/login?message=Check your email to continue sign in process');
    }
  };

  return (
    <form className="space-y-6" onSubmit={handleSignup}>
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
            minLength={6}
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#111] sm:text-sm sm:leading-6"
          />
        </div>
      </div>

      <div>
        <Button type="submit" fullWidth loading={loading}>
          Sign up
        </Button>
      </div>

      <p className="mt-10 text-center text-sm text-gray-500">
        Already have an account?{' '}
        <Link href="/login" className="font-semibold leading-6 text-[#111] hover:text-[#333]">
          Sign in
        </Link>
      </p>
    </form>
  );
}
