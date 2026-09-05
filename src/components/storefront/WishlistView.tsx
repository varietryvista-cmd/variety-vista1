'use client';

import * as React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, Trash2, ShoppingBag, ArrowRight, Share2, Check, AlertCircle, Sparkles } from 'lucide-react';
import { useWishlist } from '@/hooks/useWishlist';
import { useCart } from '@/hooks/useCart';
import { formatPrice } from '@/lib/utils';
import { getWishlistProductDetails, type WishlistProductDetail } from '@/app/actions/wishlist';
import type { Product, ProductVariant } from '@/types';

export default function WishlistView() {
  const { items: wishlistIds, removeFromWishlist, clearWishlist, isLoading: isWishlistLoading } = useWishlist();
  const { addItem, openCart } = useCart();

  const [products, setProducts] = React.useState<WishlistProductDetail[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [selectedSizes, setSelectedSizes] = React.useState<Record<string, string>>({});
  const [addingId, setAddingId] = React.useState<string | null>(null);
  const [copiedShare, setCopiedShare] = React.useState(false);
  const [movingAll, setMovingAll] = React.useState(false);

  // Fetch product details whenever wishlistIds change
  React.useEffect(() => {
    let isMounted = true;

    async function loadDetails() {
      if (wishlistIds.length === 0) {
        if (isMounted) {
          setProducts([]);
          setLoading(false);
        }
        return;
      }

      setLoading(true);
      try {
        const details = await getWishlistProductDetails(wishlistIds);
        if (isMounted) {
          setProducts(details);
          // Set default selected sizes
          const initialSizes: Record<string, string> = {};
          details.forEach((p) => {
            const inStockVariant = p.variants.find((v) => v.stock_quantity > 0) || p.variants[0];
            if (inStockVariant) {
              initialSizes[p.id] = inStockVariant.waist_size;
            }
          });
          setSelectedSizes(initialSizes);
        }
      } catch (err) {
        console.error('Failed to load wishlist details:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadDetails();

    return () => {
      isMounted = false;
    };
  }, [wishlistIds]);

  const handleSelectSize = (productId: string, size: string) => {
    setSelectedSizes((prev) => ({ ...prev, [productId]: size }));
  };

  const handleMoveToCart = async (product: WishlistProductDetail) => {
    const selectedSize = selectedSizes[product.id];
    const variant = product.variants.find((v) => v.waist_size === selectedSize) || product.variants[0];

    if (!variant || variant.stock_quantity <= 0) {
      window.alert('This size is currently out of stock.');
      return;
    }

    setAddingId(product.id);
    try {
      const mockProduct: Product = {
        id: product.id,
        title: product.title,
        slug: product.slug,
        gender: product.gender as any,
        fit_type: product.fit_type as any,
        price: product.price,
        sale_price: product.sale_price,
        bestseller: false,
        new_arrival: false,
        featured: false,
        status: 'active',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        images: [{ id: '1', product_id: product.id, image_url: product.imageUrl, image_type: 'flat', sort_order: 0 }],
      };

      const mockVariant: ProductVariant = {
        id: variant.id,
        product_id: product.id,
        sku: variant.sku,
        waist_size: Number(variant.waist_size) || 30,
        inseam_length: variant.inseam_length ? Number(variant.inseam_length) : null,
        stock_quantity: variant.stock_quantity,
        price: product.sale_price ?? product.price,
        created_at: new Date().toISOString(),
      };

      await addItem(mockProduct, mockVariant, 1);
      await removeFromWishlist(product.id);
      openCart();
    } catch (err) {
      console.error('Failed to move item to cart:', err);
    } finally {
      setAddingId(null);
    }
  };

  const handleMoveAllToCart = async () => {
    setMovingAll(true);
    try {
      for (const product of products) {
        if (product.totalStock > 0) {
          const selectedSize = selectedSizes[product.id];
          const variant = product.variants.find((v) => v.waist_size === selectedSize && v.stock_quantity > 0) ||
            product.variants.find((v) => v.stock_quantity > 0);

          if (variant) {
            const mockProduct: Product = {
              id: product.id,
              title: product.title,
              slug: product.slug,
              gender: product.gender as any,
              fit_type: product.fit_type as any,
              price: product.price,
              sale_price: product.sale_price,
              bestseller: false,
              new_arrival: false,
              featured: false,
              status: 'active',
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
              images: [{ id: '1', product_id: product.id, image_url: product.imageUrl, image_type: 'flat', sort_order: 0 }],
            };

            const mockVariant: ProductVariant = {
              id: variant.id,
              product_id: product.id,
              sku: variant.sku,
              waist_size: Number(variant.waist_size) || 30,
              inseam_length: variant.inseam_length ? Number(variant.inseam_length) : null,
              stock_quantity: variant.stock_quantity,
              price: product.sale_price ?? product.price,
              created_at: new Date().toISOString(),
            };

            await addItem(mockProduct, mockVariant, 1);
            await removeFromWishlist(product.id);
          }
        }
      }
      openCart();
    } catch (err) {
      console.error('Error moving all to cart:', err);
    } finally {
      setMovingAll(false);
    }
  };

  const handleShareWishlist = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopiedShare(true);
      setTimeout(() => setCopiedShare(false), 2500);
    }
  };

  if (isWishlistLoading || (loading && wishlistIds.length > 0)) {
    return (
      <div className="py-16 text-center">
        <div className="inline-block w-8 h-8 border-2 border-[#0A0A0A] border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-xs uppercase tracking-widest text-[#8B8680]">Loading your curated wishlist...</p>
      </div>
    );
  }

  if (wishlistIds.length === 0 || products.length === 0) {
    return (
      <div className="bg-[#FAFAF9] border border-gray-200/80 rounded-2xl p-12 text-center max-w-2xl mx-auto my-8">
        <div className="w-16 h-16 rounded-full bg-stone-100 flex items-center justify-center mx-auto mb-6">
          <Heart className="w-7 h-7 text-stone-400" />
        </div>
        <h3 className="text-xl font-medium tracking-tight text-[#0A0A0A] mb-2 font-serif">
          Your Wishlist is Empty
        </h3>
        <p className="text-sm text-[#8B8680] max-w-md mx-auto mb-8 leading-relaxed">
          Save your favorite cuts, premium denim washes, and seasonal styles to track availability and price changes.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/collections/men"
            className="px-6 py-3 bg-[#0A0A0A] text-white text-xs uppercase tracking-widest font-medium rounded-full hover:bg-stone-800 transition-colors"
          >
            Men&apos;s Denim
          </Link>
          <Link
            href="/collections/women"
            className="px-6 py-3 bg-white border border-gray-200 text-[#0A0A0A] text-xs uppercase tracking-widest font-medium rounded-full hover:border-[#0A0A0A] transition-colors"
          >
            Women&apos;s Denim
          </Link>
          <Link
            href="/collections/all"
            className="px-6 py-3 bg-white border border-gray-200 text-[#0A0A0A] text-xs uppercase tracking-widest font-medium rounded-full hover:border-[#0A0A0A] transition-colors"
          >
            New Arrivals
          </Link>
        </div>
      </div>
    );
  }

  const inStockCount = products.filter((p) => p.totalStock > 0).length;

  return (
    <div className="space-y-8">
      {/* Top Header & Actions Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-200">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-serif font-medium tracking-tight text-[#0A0A0A]">
              My Wishlist
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-stone-100 text-[#0A0A0A]">
              {products.length} {products.length === 1 ? 'item' : 'items'}
            </span>
          </div>
          <p className="text-xs text-[#8B8680] mt-1">
            Cloud-synced to your profile • Live stock & price monitoring active
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleShareWishlist}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs uppercase tracking-wider font-medium text-stone-700 bg-white border border-gray-200 rounded-full hover:border-[#0A0A0A] transition-colors"
          >
            {copiedShare ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5" />}
            {copiedShare ? 'Link Copied' : 'Share'}
          </button>

          {inStockCount > 0 && (
            <button
              onClick={handleMoveAllToCart}
              disabled={movingAll}
              className="inline-flex items-center gap-2 px-5 py-2 text-xs uppercase tracking-widest font-medium text-white bg-[#0A0A0A] rounded-full hover:bg-stone-800 disabled:opacity-50 transition-colors shadow-sm"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              {movingAll ? 'Moving to Bag...' : `Move All In-Stock (${inStockCount})`}
            </button>
          )}

          <button
            onClick={clearWishlist}
            className="p-2 text-stone-400 hover:text-red-600 transition-colors rounded-full hover:bg-stone-50"
            title="Clear all wishlist items"
            aria-label="Clear wishlist"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Grid of Wishlist Items */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {products.map((product) => {
            const isOutOfStock = product.totalStock <= 0;
            const isLowStock = product.totalStock > 0 && product.totalStock <= 5;
            const currentSize = selectedSizes[product.id];
            const currentVariant = product.variants.find((v) => v.waist_size === currentSize) || product.variants[0];
            const sizeOutOfStock = currentVariant && currentVariant.stock_quantity <= 0;

            return (
              <motion.div
                key={product.id}
                layout
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="group relative flex flex-col bg-white border border-gray-200/80 rounded-2xl overflow-hidden shadow-[0_2px_10px_rgba(0,0,0,0.02)] hover:shadow-md transition-shadow"
              >
                {/* Product Image Frame */}
                <div className="relative aspect-[3/4] bg-stone-100 overflow-hidden">
                  <Link href={`/products/${product.slug}`} className="block w-full h-full">
                    <Image
                      src={product.imageUrl}
                      alt={product.title}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </Link>

                  {/* Top Badges */}
                  <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
                    {product.sale_price && product.sale_price < product.price && (
                      <span className="px-2.5 py-0.5 text-[10px] uppercase font-bold tracking-widest bg-red-600 text-white rounded-full">
                        Sale -{Math.round(((product.price - product.sale_price) / product.price) * 100)}%
                      </span>
                    )}

                    {isOutOfStock ? (
                      <span className="px-2.5 py-0.5 text-[10px] uppercase font-semibold tracking-wider bg-stone-900/80 text-white rounded-full backdrop-blur-sm">
                        Sold Out
                      </span>
                    ) : isLowStock ? (
                      <span className="px-2.5 py-0.5 text-[10px] font-semibold tracking-wider bg-amber-500 text-white rounded-full flex items-center gap-1 shadow-sm">
                        <AlertCircle className="w-3 h-3" /> Only {product.totalStock} Left
                      </span>
                    ) : (
                      <span className="px-2.5 py-0.5 text-[10px] font-medium tracking-wider bg-emerald-50 text-emerald-800 border border-emerald-200/60 rounded-full flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> In Stock
                      </span>
                    )}
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => removeFromWishlist(product.id)}
                    className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-md text-stone-600 hover:text-red-600 flex items-center justify-center shadow-sm hover:scale-110 transition-all z-10"
                    aria-label={`Remove ${product.title} from wishlist`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Card Content & Interactive Controls */}
                <div className="p-5 flex flex-col flex-1 justify-between gap-4">
                  <div>
                    <div className="flex items-center justify-between text-[11px] text-[#8B8680] uppercase tracking-widest mb-1">
                      <span>{product.gender}</span>
                      <span className="font-medium text-stone-700 capitalize">{product.fit_type} Fit</span>
                    </div>

                    <Link
                      href={`/products/${product.slug}`}
                      className="block font-medium text-sm text-[#0A0A0A] hover:underline line-clamp-1"
                    >
                      {product.title}
                    </Link>

                    {/* Price Block */}
                    <div className="flex items-baseline gap-2 mt-2">
                      <span className="font-semibold text-base text-[#0A0A0A]">
                        {formatPrice(product.sale_price ?? product.price)}
                      </span>
                      {product.sale_price && product.sale_price < product.price && (
                        <span className="text-xs text-stone-400 line-through">
                          {formatPrice(product.price)}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Size Selector */}
                  {product.variants && product.variants.length > 0 && !isOutOfStock && (
                    <div>
                      <label className="block text-[10px] uppercase tracking-widest text-[#8B8680] font-medium mb-1.5">
                        Select Waist Size (IN)
                      </label>
                      <div className="flex flex-wrap gap-1.5">
                        {product.variants.map((v) => {
                          const isSelected = selectedSizes[product.id] === v.waist_size;
                          const isSizeOut = v.stock_quantity <= 0;

                          return (
                            <button
                              key={v.id}
                              type="button"
                              disabled={isSizeOut}
                              onClick={() => handleSelectSize(product.id, v.waist_size)}
                              className={`px-2.5 py-1 text-xs font-mono font-medium rounded-md transition-all ${
                                isSelected
                                  ? 'bg-[#0A0A0A] text-white ring-1 ring-[#0A0A0A]'
                                  : isSizeOut
                                  ? 'bg-stone-100 text-stone-300 line-through cursor-not-allowed'
                                  : 'bg-stone-50 border border-gray-200 text-stone-700 hover:border-stone-400'
                              }`}
                            >
                              {v.waist_size}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Move to Bag Action Button */}
                  <button
                    onClick={() => handleMoveToCart(product)}
                    disabled={isOutOfStock || sizeOutOfStock || addingId === product.id}
                    className="w-full mt-2 py-2.5 px-4 bg-[#0A0A0A] text-white text-xs uppercase tracking-widest font-medium rounded-xl hover:bg-stone-800 disabled:bg-stone-200 disabled:text-stone-400 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 shadow-sm"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    {addingId === product.id
                      ? 'Adding to Bag...'
                      : isOutOfStock || sizeOutOfStock
                      ? 'Out of Stock'
                      : 'Move to Bag'}
                  </button>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Luxury Style Assurance Banner */}
      <div className="p-6 bg-stone-50 border border-stone-200/60 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-700 shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-medium text-stone-900">Price Drop & Restock Notifications</h4>
            <p className="text-xs text-stone-500">
              Items in your wishlist are continuously monitored. You will receive real-time updates on limited drops and flash discounts.
            </p>
          </div>
        </div>

        <Link
          href="/collections/all"
          className="inline-flex items-center gap-1.5 text-xs font-semibold tracking-wider uppercase text-stone-900 hover:underline shrink-0"
        >
          Discover More Styles <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
