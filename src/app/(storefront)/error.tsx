'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function StorefrontError({
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
    <div className="page-container py-24 flex flex-col items-center justify-center text-center">
      <h2 className="text-3xl font-bold mb-4">Oops! Something went wrong.</h2>
      <p className="text-secondary-text mb-8 max-w-md mx-auto">
        We encountered an error while trying to load this page. Please try again or return to the homepage.
      </p>
      <div className="w-full max-w-2xl bg-gray-100 p-4 rounded text-left overflow-auto mb-8 text-sm">
        <p className="font-bold text-red-500">{error.message}</p>
        <pre className="text-gray-600 mt-2 whitespace-pre-wrap">{error.stack}</pre>
      </div>
      <div className="flex gap-4">
        <button
          onClick={() => reset()}
          className="px-6 py-3 bg-black text-white rounded font-medium hover:bg-black/90 transition-colors"
        >
          Try again
        </button>
        <Link 
          href="/"
          className="px-6 py-3 border border-gray-300 text-black rounded font-medium hover:bg-gray-50 transition-colors"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
}
