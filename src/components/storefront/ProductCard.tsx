'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Image from 'next/image';
import Link from 'next/link';
import { Heart, ShoppingBag, X, Eye } from 'lucide-react';
import { cn, formatPrice, getDiscountPercentage } from '@/lib/utils';
import type { Product, ProductImage, ProductVariant } from '@/types';
import { useCart } from '@/hooks/useCart';

interface ProductCardProps {
  product: Product & {
    images?: ProductImage[];
    variants?: ProductVariant[];
  };
  index?: number;
  onWishlistToggle?: (productId: string) => void;
  isWishlisted?: boolean;
}

export default function ProductCard({
  product,
  index = 0,
  onWishlistToggle,
  isWishlisted = false,
}: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [showMobileSizes, setShowMobileSizes] = useState(false);
  const { addItem, openCart } = useCart();

  // Get primary (flat) and secondary (on_model) images
  const sortedImages = [...(product.images || [])].sort(
    (a, b) => a.sort_order - b.sort_order
  );
  const primaryImage =
    sortedImages.find((img) => img.image_type === 'flat') || sortedImages[0];
  const secondaryImage =
    sortedImages.find((img) => img.image_type === 'on_model') ||
    sortedImages[1];

  const hasSecondaryImage = !!secondaryImage && secondaryImage.id !== primaryImage?.id;

  // Check sale status
  const isOnSale = !!product.sale_price && product.sale_price < product.price;
  const discount = isOnSale
    ? getDiscountPercentage(product.price, product.sale_price!)
    : 0;

  // Check if new (within last 14 days)
  const isNew =
    product.created_at &&
    Date.now() - new Date(product.created_at).getTime() < 14 * 24 * 60 * 60 * 1000;

  // Check if any variant has stock
  const hasStock =
    !product.variants ||
    product.variants.length === 0 ||
    product.variants.some((v) => v.stock_quantity > 0);

  // Extract variants for size display
  const inStockVariants = product.variants?.filter((v) => v.stock_quantity > 0) || [];
  
  // Sort variants by waist size ascending
  const availableVariants = [...inStockVariants].sort((a, b) => {
    if (a.waist_size === b.waist_size) return (a.inseam_length || 0) - (b.inseam_length || 0);
    return a.waist_size - b.waist_size;
  });

  // Unique waist sizes for simple display
  const uniqueSizes = Array.from(new Set(availableVariants.map(v => v.waist_size)));

  const handleQuickAdd = (e: React.MouseEvent | React.KeyboardEvent, variant: ProductVariant) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product, variant, 1);
    openCart();
    setShowMobileSizes(false);
    
    // Trigger haptic feedback if available
    if ('vibrate' in navigator) {
      navigator.vibrate(10);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent, variant: ProductVariant) => {
    if (e.key === 'Enter' || e.key === ' ') {
      handleQuickAdd(e, variant);
    }
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // Could open a quick view modal here
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.6,
        delay: index * 0.04,
        ease: [0.16, 1, 0.3, 1],
      }}
      className={cn(
        "group relative flex flex-col",
        !hasStock && "opacity-50"
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setShowMobileSizes(false);
      }}
    >
      {/* Image container */}
      <Link 
        href={`/products/${product.slug}`} 
        className="block relative overflow-hidden"
        tabIndex={0}
      >
        <div className="relative aspect-product overflow-hidden bg-[#F5F4F2]">
          {/* Primary image */}
          {primaryImage ? (
            <Image
              src={primaryImage.image_url}
              alt={primaryImage.alt_text || product.title}
              fill
              className={cn(
                'object-cover transition-all duration-700 ease-[0.16,1,0.3,1]',
                hasSecondaryImage && isHovered ? 'opacity-0 scale-100' : 'opacity-100 group-hover:scale-105',
                !hasStock && 'grayscale'
              )}
              sizes="(max-width: 768px) 50vw, 25vw"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-brand-secondary text-xs uppercase tracking-widest">
              No image
            </div>
          )}

          {/* Secondary image (crossfade on hover) */}
          {hasSecondaryImage && (
            <Image
              src={secondaryImage!.image_url}
              alt={secondaryImage!.alt_text || `${product.title} - styled`}
              fill
              className={cn(
                'object-cover transition-all duration-700 ease-[0.16,1,0.3,1] absolute inset-0',
                isHovered ? 'opacity-100 scale-105' : 'opacity-0 scale-100',
                !hasStock && 'grayscale'
              )}
              sizes="(max-width: 768px) 50vw, 25vw"
            />
          )}

          {/* Editorial Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10 pointer-events-none">
            {!hasStock ? (
              <span className="badge badge-soldout">Sold Out</span>
            ) : (
              <>
                {isNew && !isOnSale && (
                  <span className="badge badge-new">New</span>
                )}
                {isOnSale && (
                  <span className="badge badge-sale">Sale -{discount}%</span>
                )}
              </>
            )}
          </div>

          {/* Quick View Button - appears on hover */}
          <button
            onClick={handleQuickView}
            tabIndex={0}
            className={cn(
              'absolute bottom-3 left-1/2 -translate-x-1/2 z-10 px-5 py-2.5 bg-white/95 backdrop-blur-sm text-[#0A0A0A] text-[10px] font-semibold uppercase tracking-[0.15em] transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]',
              'opacity-0 group-hover:opacity-100 focus:opacity-100 translate-y-4 group-hover:translate-y-0',
            )}
            aria-label="Quick view"
          >
            <Eye className="w-3.5 h-3.5 mr-1.5 inline" />
            Quick View
          </button>

          {/* Wishlist button */}
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onWishlistToggle?.(product.id);
            }}
            tabIndex={0}
            className={cn(
              'absolute top-3 right-3 z-10 w-8 h-8 flex items-center justify-center bg-white/90 backdrop-blur-sm transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]',
              'opacity-0 group-hover:opacity-100 focus:opacity-100 scale-95 group-hover:scale-100',
              isWishlisted && 'opacity-100 scale-100 bg-[#0A0A0A] text-white'
            )}
            aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          >
            <Heart
              className={cn(
                'w-4 h-4 transition-colors',
                isWishlisted ? 'fill-white text-white' : 'currentColor'
              )}
            />
          </button>
        </div>
      </Link>

      {/* Product info - Editorial Layout */}
      <div className="mt-4 flex flex-col flex-1 px-1">
        <div className="flex justify-between items-start gap-4">
          <Link href={`/products/${product.slug}`} tabIndex={-1} className="group-hover:text-[#B8913A] transition-colors duration-500">
            <p className="text-[10px] uppercase tracking-[0.15em] text-[#8B8680] mb-1">
              {product.fit_type?.replace('_', ' ')}{product.wash ? ` / ${product.wash}` : ''}
            </p>
            <h3 className="text-sm font-medium tracking-tight text-[#0A0A0A] line-clamp-2">
              {product.title}
            </h3>
            <div className="flex items-center gap-1 mt-1.5 text-[#8B8680] group-hover:text-[#0A0A0A] transition-colors">
              <span className="text-[10px] leading-none text-[#B8913A]">★</span>
              <span className="text-[10px] font-medium leading-none">4.8 (124)</span>
            </div>
          </Link>
          <div className="flex flex-col items-end shrink-0">
            <span className={cn('text-sm font-semibold tracking-tight', isOnSale ? 'text-[#C42B2B]' : 'text-[#0A0A0A]')}>
              {formatPrice(isOnSale ? product.sale_price! : product.price)}
            </span>
            {isOnSale && (
              <span className="text-xs text-[#8B8680] line-through mt-0.5">
                {formatPrice(product.price)}
              </span>
            )}
          </div>
        </div>

        {/* Quick Add Area - Slide up on hover (Desktop) */}
        <div className="mt-4 relative min-h-[40px]">
          {hasStock && uniqueSizes.length > 0 && (
            <div
              className={cn(
                "absolute inset-x-0 bottom-0 bg-brand-bg-card z-10 transition-all duration-500 ease-[0.16,1,0.3,1] overflow-hidden lg:block hidden",
                isHovered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
              )}
            >
              <div className="flex flex-wrap gap-1.5 p-3 border-t border-brand-border">
                {uniqueSizes.slice(0, 5).map((size) => {
                  const variant = availableVariants.find(v => v.waist_size === size)!;
                  return (
                    <button
                      key={size}
                      onClick={(e) => handleQuickAdd(e, variant)}
                      onKeyDown={(e) => handleKeyDown(e, variant)}
                      tabIndex={isHovered ? 0 : -1}
                      aria-label={`Add size ${size} to cart`}
                      className="w-9 h-9 flex items-center justify-center text-[10px] font-bold bg-brand-bg-alt text-brand-primary hover:bg-brand-cta hover:text-white focus:bg-brand-cta-hover focus:text-white transition-colors duration-300 rounded-none"
                    >
                      {size}
                    </button>
                  );
                })}
                {uniqueSizes.length > 5 && (
                  <Link 
                    href={`/products/${product.slug}`}
                    tabIndex={isHovered ? 0 : -1}
                    className="w-9 h-9 flex items-center justify-center text-[10px] font-bold text-brand-secondary hover:text-brand-primary transition-colors duration-300"
                  >
                    +{uniqueSizes.length - 5}
                  </Link>
                )}
              </div>
            </div>
          )}

          {/* Mobile Actions */}
          {hasStock && (
            <div className="lg:hidden">
              <AnimatePresence mode="wait">
                {!showMobileSizes ? (
                  <motion.button
                    key="add-btn"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    onClick={(e: React.MouseEvent) => {
                      e.preventDefault();
                      setShowMobileSizes(true);
                    }}
                    className="flex items-center justify-center gap-2 w-full h-10 text-[10px] font-bold uppercase tracking-widest bg-brand-primary text-white rounded-none hover:bg-brand-primary-light active:bg-brand-primary transition-colors"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    Quick Add
                  </motion.button>
                ) : (
                  <motion.div
                    key="size-selector"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    className="bg-brand-bg-card border-t border-brand-border pt-3 mt-1"
                  >
                    <div className="flex items-center justify-between mb-3 px-1">
                      <span className="text-[10px] font-bold text-brand-primary uppercase tracking-widest">Select Size</span>
                      <button 
                        onClick={(e) => {
                          e.preventDefault();
                          setShowMobileSizes(false);
                        }}
                        className="p-1 text-brand-secondary hover:text-brand-primary"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-1.5 px-1">
                      {uniqueSizes.slice(0, 8).map((size) => {
                        const variant = availableVariants.find(v => v.waist_size === size)!;
                        return (
                          <button
                            key={size}
                            onClick={(e) => handleQuickAdd(e, variant)}
                            className="flex-1 min-w-[36px] h-9 flex items-center justify-center text-[11px] font-bold bg-brand-bg-alt rounded-none active:bg-brand-secondary-light transition-colors"
                          >
                            {size}
                          </button>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}