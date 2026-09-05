import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// ---- Currency Formatting ----
export function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(price);
}

// ---- Slug Generation ----
export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// ---- Text Truncation ----
export function truncate(text: string, length: number): string {
  if (text.length <= length) return text;
  return text.slice(0, length).trimEnd() + '...';
}

// ---- Price Helpers ----
export function getDiscountPercentage(price: number, salePrice: number): number {
  if (!salePrice || salePrice >= price) return 0;
  return Math.round((1 - salePrice / price) * 100);
}

export function isOnSale(product: { price: number; sale_price?: number | null; sale_start?: string | null; sale_end?: string | null }): boolean {
  if (!product.sale_price || product.sale_price >= product.price) return false;
  const now = new Date();
  if (product.sale_start && new Date(product.sale_start) > now) return false;
  if (product.sale_end && new Date(product.sale_end) < now) return false;
  return true;
}

export function getProductPriceDisplay(product: { price: number; sale_price?: number | null; sale_start?: string | null; sale_end?: string | null }) {
  const onSale = isOnSale(product);
  return {
    currentPrice: onSale ? product.sale_price! : product.price,
    originalPrice: onSale ? product.price : null,
    discount: onSale ? getDiscountPercentage(product.price, product.sale_price!) : 0,
    isOnSale: onSale,
  };
}
