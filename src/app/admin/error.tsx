'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 text-center min-h-[60vh]">
      <div className="bg-red-50 text-red-500 p-4 rounded-full mb-6">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      </div>
      <h2 className="text-2xl font-bold mb-4">Dashboard Error</h2>
      <p className="text-secondary-text mb-8 max-w-md mx-auto">
        There was a problem loading this section of the admin dashboard.
      </p>
      <div className="flex gap-4">
        <button
          onClick={() => reset()}
          className="px-6 py-2 bg-black text-white rounded font-medium hover:bg-black/90 transition-colors"
        >
          Try again
        </button>
        <Link 
          href="/admin"
          className="px-6 py-2 border border-gray-300 text-black rounded font-medium hover:bg-gray-50 transition-colors"
        >
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
}
