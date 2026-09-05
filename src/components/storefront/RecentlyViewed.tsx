'use client';

import * as React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { formatPrice } from '@/lib/utils';
import type { Product, ProductImage, ProductVariant } from '@/types';

type FullProduct = Product & { images?: ProductImage[]; variants?: ProductVariant[] };

interface RecentItem {
  id: string;
  slug: string;
  title: string;
  price: number;
  imageUrl?: string;
  fit?: string;
}

export default function RecentlyViewed({ currentProduct }: { currentProduct?: FullProduct }) {
  const [recentItems, setRecentItems] = React.useState<RecentItem[]>([]);

  React.useEffect(() => {
    // 1. Load existing items from localStorage
    try {
      const stored = localStorage.getItem('vv_recent_items');
      const list: RecentItem[] = stored ? JSON.parse(stored) : [];

      // 2. If currentProduct is provided, update list
      if (currentProduct) {
        const item: RecentItem = {
          id: currentProduct.id,
          slug: currentProduct.slug,
          title: currentProduct.title,
          price: currentProduct.price,
          imageUrl: currentProduct.images?.[0]?.image_url || '/images/placeholders/product-1.jpg',
          fit: currentProduct.fit_type || 'straight',
        };

        const filtered = list.filter((i) => i.id !== currentProduct.id);
        const updated = [item, ...filtered].slice(0, 8); // Store up to 8
        localStorage.setItem('vv_recent_items', JSON.stringify(updated));

        // Show items excluding current
        setRecentItems(updated.filter((i) => i.id !== currentProduct.id));
      } else {
        setRecentItems(list);
      }
    } catch {
      // LocalStorage unavailable
    }
  }, [currentProduct]);

  if (recentItems.length === 0) return null;

  return (
    <div className="border-t border-[rgba(10,10,10,0.08)] pt-16 mt-16 space-y-8">
      <div className="flex items-end justify-between">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#B8913A] block mb-1">
            Personalized For You
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold uppercase tracking-tight text-[#0A0A0A]">
            Recently Explored
          </h2>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-6">
        {recentItems.slice(0, 4).map((item) => (
          <Link
            key={item.id}
            href={`/products/${item.slug}`}
            className="group block space-y-3"
          >
            <div className="relative aspect-[3/4] bg-[#F5F4F2] overflow-hidden">
              <Image
                src={item.imageUrl || '/images/placeholders/product-1.jpg'}
                alt={item.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 640px) 50vw, 25vw"
              />
            </div>
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-bold tracking-wider text-[#8B8680]">
                {item.fit} Fit
              </span>
              <h4 className="font-bold text-xs uppercase tracking-wider text-[#0A0A0A] line-clamp-1 group-hover:text-[#B8913A] transition-colors">
                {item.title}
              </h4>
              <p className="text-xs font-semibold text-[#0A0A0A] font-mono">
                {formatPrice(item.price)}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
