'use server';

import { createServerClient } from '@/lib/supabase';
import type { Product, ProductImage, ProductVariant } from '@/types';

export type FitFinderAnswers = {
  gender: string;
  bodyShape: string;
  preferredRise: string;
  preferredFit: string;
  height: string;
};

type FullProduct = Product & { images: ProductImage[]; variants: ProductVariant[] };

export async function calculateFitRecommendations(answers: FitFinderAnswers): Promise<FullProduct[]> {
  const supabase = await createServerClient();
  
  let query = supabase
    .from('products')
    .select('*, images:product_images(*), variants:product_variants(*)');

  // Filter by gender if not unisex
  if (answers.gender !== 'unisex') {
    query = query.eq('gender', answers.gender);
  }

  // Use textSearch for the preferred fit as it's the strongest indicator
  // or use ilike if we just want a fuzzy match
  if (answers.preferredFit) {
    const fitMatch = `%${answers.preferredFit}%`;
    query = query.ilike('fit_type', fitMatch);
  }

  // We can also rank by bestseller to give better results
  const { data, error } = await query
    .order('bestseller', { ascending: false })
    .order('created_at', { ascending: false })
    .limit(6);

  if (error || !data || data.length === 0) {
    // Fallback: If no exact fit match, just return bestsellers for that gender
    let fallbackQuery = supabase
      .from('products')
      .select('*, images:product_images(*), variants:product_variants(*)');
      
    if (answers.gender !== 'unisex') {
      fallbackQuery = fallbackQuery.eq('gender', answers.gender);
    }
    
    const { data: fallbackData } = await fallbackQuery
      .order('bestseller', { ascending: false })
      .limit(6);
      
    return (fallbackData as unknown) as FullProduct[] || [];
  }

  return (data as unknown) as FullProduct[];
}
