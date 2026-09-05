'use client';

import { useEffect } from 'react';

export default function GlobalError({
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
    <html>
      <body>
        <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-white text-center">
          <h2 className="text-3xl font-bold mb-4">Something went wrong!</h2>
          <p className="text-secondary-text mb-8">
            An unexpected error occurred. Our team has been notified.
          </p>
          <button
            onClick={() => reset()}
            className="px-6 py-2 bg-black text-white rounded font-medium hover:bg-black/90 transition-colors"
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
