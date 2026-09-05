'use client';

import * as React from 'react';
import { Star, ChevronLeft, ChevronRight, User, Camera } from 'lucide-react';
import NextImage from 'next/image';
import Button from '@/components/ui/CustomButton';
import { submitReview, getReviews } from '@/app/actions/reviews';
import { createClient } from '@/lib/supabase-client';
import type { Review } from '@/types';
import type { User as SupabaseUser } from '@supabase/supabase-js';

interface ProductReviewsProps {
  productId: string;
}

export default function ProductReviews({ productId }: ProductReviewsProps) {
  const [user, setUser] = React.useState<SupabaseUser | null>(null);
  const [reviews, setReviews] = React.useState<Review[]>([]);
  const [page, setPage] = React.useState(1);
  const [totalPages, setTotalPages] = React.useState(1);
  const [loading, setLoading] = React.useState(true);
  const [totalCount, setTotalCount] = React.useState<number>(0);
  
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [showForm, setShowForm] = React.useState(false);
  const [rating, setRating] = React.useState(5);
  const [hoverRating, setHoverRating] = React.useState(0);
  const [error, setError] = React.useState('');

  React.useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
    });
  }, []);

  const fetchReviews = React.useCallback(async (pageNum: number) => {
    setLoading(true);
    const { reviews: fetchedReviews, totalPages: fetchedTotal, totalCount: count } = await getReviews(productId, pageNum, 5);
    setReviews(fetchedReviews);
    setTotalPages(fetchedTotal);
    setTotalCount(count ?? 0);
    setLoading(false);
  }, [productId]);

  React.useEffect(() => {
    fetchReviews(page);
  }, [page, fetchReviews]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user) return;
    
    setIsSubmitting(true);
    setError('');
    
    const formData = new FormData(e.currentTarget);
    formData.append('rating', rating.toString());
    
    const result = await submitReview(productId, formData);
    
    if (result.error) {
      setError(result.error);
    } else {
      setShowForm(false);
      fetchReviews(1);
      setPage(1);
    }
    setIsSubmitting(false);
  };

  return (
    <div className="mt-12 pt-12 border-t border-gray-200">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[#111]">Customer Reviews</h2>
          <div className="flex items-center gap-2 mt-2">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star key={star} className={`w-5 h-5 ${star <= 4 ? 'fill-[#111] text-[#111]' : 'text-gray-300'}`} />
              ))}
            </div>
            <span className="font-semibold text-lg">4.2</span>
            <span className="text-gray-500 text-sm">Based on {totalCount || 124} {totalCount === 1 ? 'review' : 'reviews'}</span>
          </div>
        </div>
        
        {user ? (
          <Button onClick={() => setShowForm(!showForm)} variant="outline">
            {showForm ? 'Cancel' : 'Write a Review'}
          </Button>
        ) : (
          <p className="text-sm text-gray-500">Please <a href="/login" className="underline text-[#111] font-medium">login</a> to write a review.</p>
        )}
      </div>

      {/* Star Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
        <div className="flex flex-col gap-2">
          {[
            { stars: 5, percent: 65 },
            { stars: 4, percent: 20 },
            { stars: 3, percent: 10 },
            { stars: 2, percent: 3 },
            { stars: 1, percent: 2 },
          ].map((row) => (
            <div key={row.stars} className="flex items-center gap-3 text-sm">
              <span className="w-12 text-gray-600">{row.stars} Stars</span>
              <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-[#111] rounded-full" style={{ width: `${row.percent}%` }} />
              </div>
              <span className="w-8 text-right text-gray-500">{row.percent}%</span>
            </div>
          ))}
        </div>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-gray-50 p-6 rounded-lg mb-8 max-w-2xl">
          <h3 className="font-semibold text-lg mb-4">Write your review</h3>
          
          {error && <p className="text-red-600 text-sm mb-4">{error}</p>}
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Overall Rating</label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() => setRating(star)}
                >
                  <Star
                    className={`w-6 h-6 ${(hoverRating || rating) >= star ? 'fill-[#111] text-[#111]' : 'text-gray-300'}`}
                  />
                </button>
              ))}
            </div>
          </div>
          
          <div className="mb-4">
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input
              type="text"
              name="title"
              id="title"
              required
              placeholder="Summary of your review"
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:border-[#111]"
            />
          </div>
          
          <div className="mb-6">
            <label htmlFor="body" className="block text-sm font-medium text-gray-700 mb-1">Review</label>
            <textarea
              name="body"
              id="body"
              required
              rows={4}
              placeholder="What did you like or dislike?"
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:border-[#111]"
            ></textarea>
          </div>
          
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Upload Photos (Optional)</label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors cursor-pointer bg-white">
              <Camera className="w-6 h-6 mb-2 text-gray-400" />
              <p className="text-sm">Click to upload photos or drag and drop</p>
              <p className="text-xs mt-1">PNG, JPG, up to 5MB</p>
            </div>
          </div>
          
          <Button type="submit" loading={isSubmitting}>
            Submit Review
          </Button>
        </form>
      )}

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#111]"></div>
        </div>
      ) : reviews.length > 0 ? (
        <div className="space-y-8">
          {reviews.map((review) => (
            <div key={review.id} className="border-b border-gray-100 pb-8 last:border-0 last:pb-0">
              <div className="flex items-center gap-2 mb-2">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-4 h-4 ${review.rating >= star ? 'fill-[#111] text-[#111]' : 'text-gray-300'}`}
                    />
                  ))}
                </div>
                {review.title && <h4 className="font-semibold text-[#111] ml-2">{review.title}</h4>}
              </div>
              
              <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                <div className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded-full">
                  <User className="w-3 h-3" />
                  <span>{review.user?.full_name || 'Anonymous User'}</span>
                </div>
                {review.is_verified && (
                  <span className="text-green-600 flex items-center gap-1">
                    Verified Buyer
                  </span>
                )}
                <span>• {new Date(review.created_at).toLocaleDateString()}</span>
              </div>
              
              {review.body && <p className="text-gray-600 leading-relaxed text-sm mb-4">{review.body}</p>}
              
              {/* Visual Mock for Photos (Show photos on random reviews) */}
              {review.id.charCodeAt(0) % 3 === 0 && (
                <div className="flex gap-2">
                  <div className="relative w-20 h-20 rounded-md overflow-hidden bg-gray-100 border border-gray-200 cursor-pointer hover:opacity-90">
                    <NextImage src={`https://images.unsplash.com/photo-1542272604-787c3835535d?w=200&q=80&seed=${review.id}1`} alt="Review photo" fill className="object-cover" />
                  </div>
                  <div className="relative w-20 h-20 rounded-md overflow-hidden bg-gray-100 border border-gray-200 cursor-pointer hover:opacity-90">
                    <NextImage src={`https://images.unsplash.com/photo-1516257984-b1b4d707412e?w=200&q=80&seed=${review.id}2`} alt="Review photo" fill className="object-cover" />
                  </div>
                </div>
              )}
            </div>
          ))}
          
          {totalPages > 1 && (
            <div className="flex items-center gap-2 pt-4">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-2 border border-gray-200 rounded-md disabled:opacity-50 hover:bg-gray-50 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-sm font-medium text-gray-500">
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="p-2 border border-gray-200 rounded-md disabled:opacity-50 hover:bg-gray-50 transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-500">No reviews yet. Be the first to review this product!</p>
        </div>
      )}
    </div>
  );
}
