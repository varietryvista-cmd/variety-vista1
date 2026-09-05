'use server';

import { createServerClient } from '@/lib/supabase';
import type { Product, ProductImage, ProductVariant } from '@/types';

type FullProduct = Product & { images: ProductImage[]; variants: ProductVariant[] };

export async function searchProducts(query: string = ''): Promise<FullProduct[]> {
  const supabase = await createServerClient();
  let dbQuery = supabase
    .from('products')
    .select('*, images:product_images(*), variants:product_variants(*)');
  
  if (query.trim()) {
    // Use websearch type for better parsing (handles quoted exact matches, - exclusions, etc.)
    // We use title for textSearch as it's the primary field.
    dbQuery = dbQuery.textSearch('title', query.trim(), {
      type: 'websearch',
      config: 'english'
    });
  }

  const { data, error } = await dbQuery
    .order('created_at', { ascending: false })
    .limit(5);

  if (error) {
    console.error('Error searching products:', error);
    return [];
  }

  return (data as unknown) as FullProduct[];
}

export async function fetchFeaturedProducts(): Promise<FullProduct[]> {
  const supabase = await createServerClient();
  const { data, error } = await supabase
    .from('products')
    .select('*, images:product_images(*), variants:product_variants(*)')
    .eq('featured', true)
    .limit(4);

  if (error || !data || data.length === 0) {
    // Fallback to recent products if no featured ones
    const { data: fallbackData } = await supabase
      .from('products')
      .select('*, images:product_images(*), variants:product_variants(*)')
      .order('created_at', { ascending: false })
      .limit(4);
    return (fallbackData as unknown) as FullProduct[] || [];
  }

  return (data as unknown) as FullProduct[];
}
