'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { updatePassword } from '@/app/actions/auth';
import Button from '@/components/ui/CustomButton';
import Link from 'next/link';

export default function ResetPasswordForm() {
  const router = useRouter();
  const [password, setPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');
  const [success, setSuccess] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    setLoading(true);
    setError('');
    setSuccess(false);

    const { error: updateError } = await updatePassword(password);

    if (updateError) {
      setError(updateError);
    } else {
      setSuccess(true);
      // Wait a moment then redirect to account
      setTimeout(() => {
        router.push('/account');
        router.refresh();
      }, 2000);
    }
    setLoading(false);
  };

  if (success) {
    return (
      <div className="text-center space-y-6">
        <div className="bg-green-50 text-green-700 p-4 rounded-md text-sm">
          Password updated successfully! Redirecting...
        </div>
        <Link href="/account" className="block text-sm font-semibold text-[#111] hover:underline">
          Go to my account now
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
          New Password
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
        <label className="block text-sm font-medium leading-6 text-gray-900">
          Confirm Password
        </label>
        <div className="mt-2">
          <input
            name="confirmPassword"
            type="password"
            required
            minLength={6}
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
            className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#111] sm:text-sm sm:leading-6"
          />
        </div>
      </div>

      <div>
        <Button type="submit" fullWidth loading={loading}>
          Update Password
        </Button>
      </div>
    </form>
  );
}
