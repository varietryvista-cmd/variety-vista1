'use client';

import * as React from 'react';
import { Star, CheckCircle, ThumbsUp, Plus, X } from 'lucide-react';

interface Review {
  id: string;
  author: string;
  rating: number;
  date: string;
  title: string;
  body: string;
  fitVerdict: 'True to Size' | 'Runs Small' | 'Runs Large';
  verified: boolean;
  likes: number;
}

const INITIAL_REVIEWS: Review[] = [
  {
    id: '1',
    author: 'Aarav M.',
    rating: 5,
    date: '12 Aug 2026',
    title: 'Flawless drape and heavyweight denim structure',
    body: 'The 14oz Japanese selvedge feels substantial yet breaks in beautifully within a week of wear. The clean cut sits perfectly over boots or sneakers.',
    fitVerdict: 'True to Size',
    verified: true,
    likes: 18,
  },
  {
    id: '2',
    author: 'Rohan K.',
    rating: 5,
    date: '04 Aug 2026',
    title: 'Worth every rupee. Unmatched craftsmanship.',
    body: 'Stitching and copper hardware details are top-notch. Truly competes with luxury heritage denim brands at double the price.',
    fitVerdict: 'True to Size',
    verified: true,
    likes: 12,
  },
  {
    id: '3',
    author: 'Vikram S.',
    rating: 4,
    date: '28 Jul 2026',
    title: 'Great silhouette, tight on waist initial days',
    body: 'Slightly snug around the waistband on day one due to rigid raw denim, but stretched half an inch perfectly after 3 wears. Order true waist size.',
    fitVerdict: 'True to Size',
    verified: true,
    likes: 9,
  },
];

export default function ProductReviews({ productTitle }: { productTitle: string }) {
  const [reviews, setReviews] = React.useState<Review[]>(INITIAL_REVIEWS);
  const [selectedFilter, setSelectedFilter] = React.useState<'all' | '5' | '4' | 'fit'>('all');
  const [isWriteOpen, setIsWriteOpen] = React.useState(false);
  const [likedIds, setLikedIds] = React.useState<Record<string, boolean>>({});

  // Form State
  const [formRating, setFormRating] = React.useState(5);
  const [formName, setFormName] = React.useState('');
  const [formTitle, setFormTitle] = React.useState('');
  const [formBody, setFormBody] = React.useState('');
  const [formFit, setFormFit] = React.useState<'True to Size' | 'Runs Small' | 'Runs Large'>('True to Size');

  const filteredReviews = React.useMemo(() => {
    return reviews.filter((r) => {
      if (selectedFilter === '5') return r.rating === 5;
      if (selectedFilter === '4') return r.rating === 4;
      if (selectedFilter === 'fit') return r.fitVerdict === 'True to Size';
      return true;
    });
  }, [reviews, selectedFilter]);

  const handleLike = (id: string) => {
    if (likedIds[id]) return;
    setLikedIds((prev) => ({ ...prev, [id]: true }));
    setReviews((prev) =>
      prev.map((r) => (r.id === id ? { ...r, likes: r.likes + 1 } : r))
    );
  };

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formBody.trim()) return;

    const newRev: Review = {
      id: 'rev-' + Date.now(),
      author: formName.trim(),
      rating: formRating,
      date: 'Just now',
      title: formTitle.trim() || 'Verified Purchase',
      body: formBody.trim(),
      fitVerdict: formFit,
      verified: true,
      likes: 0,
    };

    setReviews([newRev, ...reviews]);
    setIsWriteOpen(false);
    setFormName('');
    setFormTitle('');
    setFormBody('');
  };

  return (
    <div className="border-t border-[rgba(10,10,10,0.08)] pt-16 mt-16 space-y-12">
      {/* Section Heading */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#B8913A] block mb-1">
            Customer Feedback
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold uppercase tracking-tight text-[#0A0A0A]">
            Ratings & Reviews
          </h2>
          <p className="text-xs text-[#8B8680] mt-1">
            Real feedback from verified purchasers of {productTitle}.
          </p>
        </div>

        <button
          onClick={() => setIsWriteOpen(true)}
          className="inline-flex items-center gap-2 px-6 py-3 bg-[#0A0A0A] text-[#FAFAF9] text-xs font-bold uppercase tracking-wider hover:bg-[#B8913A] transition-colors self-start md:self-auto"
        >
          <Plus className="w-4 h-4" /> Write a Review
        </button>
      </div>

      {/* Ratings & Fit Summary Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 bg-[#FAFAF9] border border-[rgba(10,10,10,0.06)] p-6 sm:p-8">
        {/* Score */}
        <div className="flex flex-col justify-center items-start border-b md:border-b-0 md:border-r border-[rgba(10,10,10,0.08)] pb-6 md:pb-0 md:pr-8">
          <div className="text-5xl font-extrabold tracking-tight text-[#0A0A0A]">4.9</div>
          <div className="flex items-center gap-1 my-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <Star key={i} className="w-4 h-4 fill-[#B8913A] text-[#B8913A]" />
            ))}
          </div>
          <p className="text-xs text-[#8B8680] uppercase tracking-wider font-semibold">
            Based on {reviews.length + 42} verified customer reviews
          </p>
        </div>

        {/* Rating Breakdown Bars */}
        <div className="space-y-2 flex flex-col justify-center border-b md:border-b-0 md:border-r border-[rgba(10,10,10,0.08)] pb-6 md:pb-0 md:pr-8">
          {[
            { stars: '5 ★', pct: 92, count: 41 },
            { stars: '4 ★', pct: 6, count: 3 },
            { stars: '3 ★', pct: 2, count: 1 },
            { stars: '2 ★', pct: 0, count: 0 },
            { stars: '1 ★', pct: 0, count: 0 },
          ].map((bar) => (
            <div key={bar.stars} className="flex items-center gap-3 text-xs">
              <span className="w-8 font-mono text-[#8B8680]">{bar.stars}</span>
              <div className="flex-1 h-2 bg-[rgba(10,10,10,0.06)] rounded-full overflow-hidden">
                <div className="h-full bg-[#0A0A0A]" style={{ width: `${bar.pct}%` }} />
              </div>
              <span className="w-6 text-right font-mono text-[#8B8680]">{bar.count}</span>
            </div>
          ))}
        </div>

        {/* Fit Verdict Gauge */}
        <div className="flex flex-col justify-center space-y-3">
          <div className="text-xs font-bold uppercase tracking-wider text-[#0A0A0A]">
            Customer Fit Verdict
          </div>
          <div className="space-y-2">
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span>True to Size</span>
                <span className="font-mono text-[#B8913A]">89%</span>
              </div>
              <div className="h-2 bg-[rgba(10,10,10,0.06)] rounded-full overflow-hidden">
                <div className="h-full bg-[#B8913A]" style={{ width: '89%' }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xs text-[#8B8680] mb-1">
                <span>Runs Slightly Snug</span>
                <span className="font-mono">8%</span>
              </div>
              <div className="h-1.5 bg-[rgba(10,10,10,0.06)] rounded-full overflow-hidden">
                <div className="h-full bg-[#8B8680]" style={{ width: '8%' }} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2">
        {[
          { key: 'all', label: `All Reviews (${reviews.length})` },
          { key: '5', label: '5-Star Ratings' },
          { key: '4', label: '4-Star Ratings' },
          { key: 'fit', label: 'True to Size Reviews' },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setSelectedFilter(tab.key as typeof selectedFilter)}
            className={`px-4 py-2 text-xs font-bold uppercase tracking-wider transition-colors ${
              selectedFilter === tab.key
                ? 'bg-[#0A0A0A] text-[#FAFAF9]'
                : 'bg-[#FAFAF9] text-[#8B8680] border border-[rgba(10,10,10,0.08)] hover:text-[#0A0A0A]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Reviews List */}
      <div className="space-y-6">
        {filteredReviews.map((rev) => (
          <div
            key={rev.id}
            className="border-b border-[rgba(10,10,10,0.06)] pb-6 space-y-3"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-3.5 h-3.5 ${
                        i < rev.rating
                          ? 'fill-[#B8913A] text-[#B8913A]'
                          : 'text-[rgba(10,10,10,0.2)]'
                      }`}
                    />
                  ))}
                </div>
                <span className="font-bold text-xs uppercase tracking-wider text-[#0A0A0A]">
                  {rev.author}
                </span>
                {rev.verified && (
                  <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-[#25D366] uppercase tracking-wider">
                    <CheckCircle className="w-3 h-3" /> Verified Buyer
                  </span>
                )}
              </div>
              <span className="text-[11px] text-[#8B8680]">{rev.date}</span>
            </div>

            <h4 className="font-bold text-sm text-[#0A0A0A]">{rev.title}</h4>
            <p className="text-xs text-[#333] leading-relaxed">{rev.body}</p>

            <div className="flex items-center justify-between pt-1">
              <span className="inline-block px-2.5 py-1 bg-[#F5F4F2] text-[10px] font-semibold text-[#0A0A0A] uppercase tracking-wider">
                Fit: {rev.fitVerdict}
              </span>

              <button
                onClick={() => handleLike(rev.id)}
                className={`inline-flex items-center gap-1.5 text-xs text-[#8B8680] hover:text-[#0A0A0A] transition-colors ${
                  likedIds[rev.id] ? 'text-[#0A0A0A] font-bold' : ''
                }`}
              >
                <ThumbsUp className="w-3.5 h-3.5" />
                <span>Helpful ({rev.likes})</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Write Review Modal */}
      {isWriteOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-[#FAFAF9] border border-[rgba(10,10,10,0.1)] text-[#0A0A0A] max-w-lg w-full p-6 sm:p-8 relative shadow-2xl space-y-6 animate-fade-in">
            <div className="flex items-center justify-between border-b border-[rgba(10,10,10,0.08)] pb-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#B8913A]">
                  Variety Vista
                </span>
                <h3 className="text-xl font-bold uppercase tracking-tight text-[#0A0A0A]">
                  Write a Review
                </h3>
              </div>
              <button
                onClick={() => setIsWriteOpen(false)}
                className="p-1 text-[#8B8680] hover:text-[#0A0A0A]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddReview} className="space-y-4 text-xs">
              {/* Star rating selector */}
              <div>
                <label className="block font-bold uppercase tracking-wider mb-1.5 text-[#0A0A0A]">
                  Rating *
                </label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setFormRating(star)}
                      className="p-1 hover:scale-110 transition-transform"
                    >
                      <Star
                        className={`w-6 h-6 ${
                          star <= formRating
                            ? 'fill-[#B8913A] text-[#B8913A]'
                            : 'text-[rgba(10,10,10,0.2)]'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-bold uppercase tracking-wider mb-1 text-[#0A0A0A]">
                  Your Name *
                </label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="e.g. Siddharth M."
                  className="w-full h-10 px-3 bg-white border border-[rgba(10,10,10,0.15)] text-[#0A0A0A] focus:outline-none focus:border-[#0A0A0A]"
                />
              </div>

              <div>
                <label className="block font-bold uppercase tracking-wider mb-1 text-[#0A0A0A]">
                  How does it fit? *
                </label>
                <select
                  value={formFit}
                  onChange={(e) => setFormFit(e.target.value as typeof formFit)}
                  className="w-full h-10 px-3 bg-white border border-[rgba(10,10,10,0.15)] text-[#0A0A0A] focus:outline-none focus:border-[#0A0A0A]"
                >
                  <option value="True to Size">True to Size (Recommended)</option>
                  <option value="Runs Small">Runs Slightly Small</option>
                  <option value="Runs Large">Runs Slightly Large</option>
                </select>
              </div>

              <div>
                <label className="block font-bold uppercase tracking-wider mb-1 text-[#0A0A0A]">
                  Review Headline
                </label>
                <input
                  type="text"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="e.g. Best raw denim in my wardrobe"
                  className="w-full h-10 px-3 bg-white border border-[rgba(10,10,10,0.15)] text-[#0A0A0A] focus:outline-none focus:border-[#0A0A0A]"
                />
              </div>

              <div>
                <label className="block font-bold uppercase tracking-wider mb-1 text-[#0A0A0A]">
                  Review Details *
                </label>
                <textarea
                  required
                  rows={4}
                  value={formBody}
                  onChange={(e) => setFormBody(e.target.value)}
                  placeholder="Tell other denim enthusiasts about the fabric weight, drape, fading, and comfort..."
                  className="w-full p-3 bg-white border border-[rgba(10,10,10,0.15)] text-[#0A0A0A] focus:outline-none focus:border-[#0A0A0A]"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-[rgba(10,10,10,0.08)]">
                <button
                  type="button"
                  onClick={() => setIsWriteOpen(false)}
                  className="px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-[#8B8680] hover:text-[#0A0A0A]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#0A0A0A] text-[#FAFAF9] text-xs font-bold uppercase tracking-wider hover:bg-[#B8913A] transition-colors"
                >
                  Submit Review
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
