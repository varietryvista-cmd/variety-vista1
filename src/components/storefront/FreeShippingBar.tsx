'use client';

import * as React from 'react';
import { Truck, CheckCircle2 } from 'lucide-react';
import { formatPrice } from '@/lib/utils';

interface FreeShippingBarProps {
  subtotal: number;
  threshold?: number;
  className?: string;
}

export default function FreeShippingBar({
  subtotal,
  threshold = 1999,
  className = '',
}: FreeShippingBarProps) {
  const remaining = Math.max(0, threshold - subtotal);
  const percentage = Math.min(100, Math.round((subtotal / threshold) * 100));
  const isUnlocked = remaining === 0;

  return (
    <div className={`p-4 bg-[#F5F4F2] border border-[rgba(10,10,10,0.06)] ${className}`}>
      <div className="flex items-center gap-2.5 mb-2.5">
        {isUnlocked ? (
          <CheckCircle2 className="w-4 h-4 text-[#B8913A] shrink-0" />
        ) : (
          <Truck className="w-4 h-4 text-[#8B8680] shrink-0" />
        )}
        <p className="text-xs font-semibold uppercase tracking-wider text-[#0A0A0A]">
          {isUnlocked ? (
            <span className="text-[#B8913A]">You unlocked FREE Express Delivery!</span>
          ) : (
            <span>
              Add <strong className="text-[#0A0A0A] font-bold">{formatPrice(remaining)}</strong> more for{' '}
              <span className="text-[#B8913A]">Free Express Delivery</span>
            </span>
          )}
        </p>
      </div>

      {/* Progress Track */}
      <div className="w-full h-1.5 bg-[rgba(10,10,10,0.08)] overflow-hidden">
        <div
          className={`h-full transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${
            isUnlocked ? 'bg-[#B8913A]' : 'bg-[#0A0A0A]'
          }`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
