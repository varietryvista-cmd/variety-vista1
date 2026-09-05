'use client';

import * as React from 'react';
import { resetPasswordForEmail } from '@/app/actions/auth';
import Button from '@/components/ui/CustomButton';
import Link from 'next/link';

export default function ForgotPasswordForm() {
  const [email, setEmail] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');
  const [success, setSuccess] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    const { error: resetError } = await resetPasswordForEmail(email);

    if (resetError) {
      setError(resetError);
    } else {
      setSuccess(true);
    }
    setLoading(false);
  };

  if (success) {
    return (
      <div className="text-center space-y-6">
        <div className="bg-green-50 text-green-700 p-4 rounded-md text-sm">
          Check your email for a password reset link.
        </div>
        <p className="text-sm text-gray-600">
          Didn&apos;t receive it?{' '}
          <button onClick={() => setSuccess(false)} className="text-[#111] font-semibold hover:underline">
            Try again
          </button>
        </p>
        <Link href="/login" className="block text-sm font-semibold text-[#111] hover:underline">
          Return to login
        </Link>
      </div>
    );
  }

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
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
        <Button type="submit" fullWidth loading={loading}>
          Send reset link
        </Button>
      </div>

      <div className="text-center">
        <Link href="/login" className="text-sm font-semibold text-gray-600 hover:text-[#111]">
          Back to login
        </Link>
      </div>
    </form>
  );
}
