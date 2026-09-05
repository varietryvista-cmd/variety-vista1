'use server';

import { createServerClient } from '@/lib/supabase';
import { revalidatePath } from 'next/cache';

export async function submitReview(productId: string, formData: FormData) {
  const rating = Number(formData.get('rating'));
  const title = formData.get('title') as string;
  const body = formData.get('body') as string;

  if (!rating || rating < 1 || rating > 5) {
    return { error: 'Rating must be between 1 and 5' };
  }

  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: 'You must be logged in to submit a review' };
  }

  const { error } = await supabase.from('reviews').insert({
    product_id: productId,
    user_id: user.id,
    rating,
    title,
    body,
    is_verified: true, // simplified for now, ideally checked if user purchased
  });

  if (error) {
    console.error('Error submitting review:', error);
    return { error: 'Failed to submit review' };
  }

  revalidatePath(`/products`);
  return { success: true };
}

export async function getReviews(productId: string, page: number = 1, limit: number = 5) {
  const supabase = await createServerClient();
  const offset = (page - 1) * limit;

  const { data, error, count } = await supabase
    .from('reviews')
    .select('*, user:profiles(full_name, avatar_url)', { count: 'exact' })
    .eq('product_id', productId)
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) {
    console.error('Error fetching reviews:', error);
    return { reviews: [], totalPages: 0, error: 'Failed to fetch reviews' };
  }

  return {
    reviews: data || [],
    totalPages: count ? Math.ceil(count / limit) : 0,
    totalCount: count || 0
  };
}
