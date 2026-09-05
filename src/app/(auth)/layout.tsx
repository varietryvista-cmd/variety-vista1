import * as React from 'react';
import Image from 'next/image';
import Link from 'next/link';
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Link href="/" className="flex items-center justify-center gap-2">
          <div className="relative w-[200px] h-[60px]">
            <Image
              src="/assets/logo.png"
              alt="Variety Vista"
              fill
              className="object-contain"
              priority
            />
          </div>
        </Link>
      </div>
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 border border-gray-100">
          {children}
        </div>
      </div>
    </div>
  );
}
