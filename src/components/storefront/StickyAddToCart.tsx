'use client';

import * as React from 'react';
import Image from 'next/image';
import { ShoppingBag, Check } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import type { Product, ProductImage, ProductVariant } from '@/types';

interface StickyAddToCartProps {
  product: Product & { images: ProductImage[]; variants: ProductVariant[] };
  selectedVariant: ProductVariant | null;
  onAddToCart: () => void;
  onSelectSizeClick: () => void;
  isAdding: boolean;
  targetRef: React.RefObject<HTMLElement | null>;
}

export default function StickyAddToCart({
  product,
  selectedVariant,
  onAddToCart,
  onSelectSizeClick,
  isAdding,
  targetRef,
}: StickyAddToCartProps) {
  const [isVisible, setIsVisible] = React.useState(false);
  const [added, setAdded] = React.useState(false);

  React.useEffect(() => {
    const target = targetRef.current;
    if (!target) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        // Show sticky bar when main button is scrolled out of view (bounding rect top < 0)
        setIsVisible(!entry.isIntersecting && entry.boundingClientRect.top < 0);
      },
      { threshold: 0 }
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, [targetRef]);

  const handleAdd = () => {
    if (!selectedVariant) {
      onSelectSizeClick();
      return;
    }
    onAddToCart();
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const image = product.images?.[0]?.image_url || '/placeholder.png';
  const price = selectedVariant?.price ?? product.price;

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 inset-x-0 z-40 lg:hidden bg-[#FAFAF9] border-t border-[rgba(10,10,10,0.1)] p-3.5 shadow-2xl backdrop-blur-md transition-transform duration-300">
      <div className="flex items-center justify-between gap-3">
        {/* Left: Thumbnail & Details */}
        <div className="flex items-center gap-3 min-w-0">
          <div className="relative w-11 h-13 bg-[#F5F4F2] border border-[rgba(10,10,10,0.06)] shrink-0 overflow-hidden">
            <Image
              src={image}
              alt={product.title}
              fill
              className="object-cover"
              sizes="44px"
            />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-bold uppercase tracking-tight text-[#0A0A0A] truncate">
              {product.title}
            </p>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-xs font-bold text-[#0A0A0A]">{formatPrice(price)}</span>
              {selectedVariant && (
                <span className="text-[10px] font-semibold uppercase tracking-wider text-[#8B8680] bg-[#F5F4F2] px-1.5 py-0.5 border border-[rgba(10,10,10,0.06)]">
                  W{selectedVariant.waist_size}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Right: Button */}
        <button
          onClick={handleAdd}
          disabled={isAdding}
          className="h-11 px-5 bg-[#0A0A0A] text-[#FAFAF9] hover:bg-[#B8913A] transition-colors flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-[0.12em] shrink-0 active:scale-95 disabled:opacity-50"
        >
          {added ? (
            <>
              <Check className="w-3.5 h-3.5" /> Added
            </>
          ) : !selectedVariant ? (
            'Select Size'
          ) : isAdding ? (
            'Adding...'
          ) : (
            <>
              <ShoppingBag className="w-3.5 h-3.5" /> Add
            </>
          )}
        </button>
      </div>
    </div>
  );
}
