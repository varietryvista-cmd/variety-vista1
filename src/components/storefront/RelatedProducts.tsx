'use client';

import * as React from 'react';
import ProductCard from '@/components/storefront/ProductCard';
import type { Product, ProductImage, ProductVariant } from '@/types';

type FullProduct = Product & { images?: ProductImage[]; variants?: ProductVariant[] };

interface RelatedProductsProps {
  products: FullProduct[];
  title?: string;
}

export default function RelatedProducts({ products, title = "You May Also Like" }: RelatedProductsProps) {
  if (!products || products.length === 0) return null;

  return (
    <div className="mt-20 pt-10 border-t border-gray-200">
      <h2 className="text-2xl font-bold text-[#111] mb-8 text-center uppercase tracking-tight">
        {title}
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        {products.map((product, idx) => (
          <ProductCard key={product.id} product={product} index={idx} />
        ))}
      </div>
    </div>
  );
}
