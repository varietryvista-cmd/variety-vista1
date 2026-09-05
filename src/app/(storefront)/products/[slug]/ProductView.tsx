'use client';

import * as React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Heart, Truck, Ruler, Check, Zap, Share2, Minus, Plus, RotateCcw, Shield, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'motion/react';
import Accordion from '@/components/ui/Accordion';
import { useCart } from '@/hooks/useCart';
import { useWishlist } from '@/hooks/useWishlist';
import type { Product, ProductImage, ProductVariant } from '@/types';
import ProductReviews from '@/components/storefront/ProductReviews';
import ImageGallery from '@/components/storefront/ImageGallery';
import SizeGuideModal from '@/components/storefront/SizeGuideModal';
import RelatedProducts from '@/components/storefront/RelatedProducts';
import RecentlyViewed from '@/components/storefront/RecentlyViewed';
import PincodeChecker from '@/components/storefront/PincodeChecker';
import StickyAddToCart from '@/components/storefront/StickyAddToCart';
import { cn, formatPrice } from '@/lib/utils';

type FullProduct = Product & { images: ProductImage[]; variants: ProductVariant[] };

interface ProductViewProps {
  product: FullProduct;
  relatedProducts?: FullProduct[];
}

export default function ProductView({ product, relatedProducts }: ProductViewProps) {
  const router = useRouter();
  const [selectedSize, setSelectedSize] = React.useState<number | null>(null);
  const [selectedLength, setSelectedLength] = React.useState<number | string | null>(null);
  const [quantity, setQuantity] = React.useState(1);
  const [isSizeGuideOpen, setIsSizeGuideOpen] = React.useState(false);
  const [showShareSheet, setShowShareSheet] = React.useState(false);
  const [addedToCart, setAddedToCart] = React.useState(false);
  const atcButtonRef = React.useRef<HTMLDivElement>(null);
  
  const { addItem, openCart } = useCart();
  const { toggleWishlist, isWishlisted } = useWishlist();

  const isProductWishlisted = isWishlisted(product.id);

  // Group variants by size
  const availableSizes = React.useMemo(() => {
    return Array.from(new Set(product.variants.map(v => v.waist_size))).sort((a, b) => a - b);
  }, [product.variants]);

  const availableLengths = React.useMemo(() => {
    if (!selectedSize) return [];
    const lengths = product.variants
      .filter(v => v.waist_size === selectedSize)
      .map(v => v.inseam_length || v.length)
      .filter((v): v is string | number => v !== null && v !== undefined);
    return Array.from(new Set(lengths)).sort((a, b) => Number(a) - Number(b));
  }, [product.variants, selectedSize]);

  React.useEffect(() => {
    if (availableLengths.length > 0 && !availableLengths.includes(selectedLength!)) {
      setSelectedLength(availableLengths[0]);
    } else if (availableLengths.length === 0) {
      setSelectedLength(null);
    }
  }, [availableLengths, selectedLength]);

  const selectedVariant = React.useMemo(() => {
    if (!selectedSize) return null;
    return (
      product.variants.find(
        (v) =>
          v.waist_size === selectedSize &&
          (selectedLength
            ? v.inseam_length === selectedLength || v.length === selectedLength
            : true)
      ) || null
    );
  }, [product.variants, selectedSize, selectedLength]);

  const handleAddToCart = () => {
    if (!selectedSize || !selectedVariant) {
      return;
    }
    
    addItem(product, selectedVariant, quantity);
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
    openCart();
  };

  const handleBuyNow = () => {
    if (!selectedSize) {
      return;
    }
    const variant = product.variants.find(v => 
      v.waist_size === selectedSize && 
      (selectedLength ? (v.inseam_length === selectedLength || v.length === selectedLength) : true)
    );
    if (variant) {
      addItem(product, variant, quantity);
      router.push('/checkout');
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.title,
          text: `Check out ${product.title} at Variety Vista`,
          url: window.location.href,
        });
      } catch {
        setShowShareSheet(true);
      }
    } else {
      setShowShareSheet(true);
    }
  };

  const copyLink = async () => {
    await navigator.clipboard.writeText(window.location.href);
  };

  // Generate JSON-LD Schema
  const currentPrice = product.sale_price || product.price;
  const primaryImage = product.images?.find(img => img.image_type === 'flat')?.image_url || product.images?.[0]?.image_url || '';
  
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.title,
    image: primaryImage,
    description: product.description || `Buy ${product.title} at Variety Vista`,
    sku: product.id,
    brand: {
      '@type': 'Brand',
      name: 'Variety Vista'
    },
    offers: {
      '@type': 'Offer',
      url: `https://varietyvista.in/products/${product.slug}`,
      priceCurrency: 'INR',
      price: currentPrice,
      availability: product.variants?.some(v => v.stock_quantity > 0) ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      itemCondition: 'https://schema.org/NewCondition'
    }
  };

  const breadcrumbList = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://varietyvista.in'
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Products',
        item: 'https://varietyvista.in/collections/all'
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: product.title,
        item: `https://varietyvista.in/products/${product.slug}`
      }
    ]
  };

  const jsonLdData = [jsonLd, breadcrumbList];

  return (
    <div className="page-container py-10 md:py-16 text-[#0A0A0A]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdData) }}
      />
      
      {/* Breadcrumb */}
      <nav className="mb-10" aria-label="Breadcrumb">
        <ol className="flex items-center gap-2 text-[11px] font-semibold tracking-[0.15em] uppercase text-[#8B8680]">
          <li className="flex items-center gap-2">
            <Link href="/" className="hover:text-[#0A0A0A] transition-colors">Home</Link>
            <span>/</span>
          </li>
          <li className="flex items-center gap-2">
            <Link href="/collections/all" className="hover:text-[#0A0A0A] transition-colors">Shop</Link>
            <span>/</span>
          </li>
          <li className="flex items-center gap-2">
            <Link href={`/collections/${product.gender}`} className="hover:text-[#0A0A0A] transition-colors">
              {product.gender}
            </Link>
            <span>/</span>
          </li>
          <li className="text-[#0A0A0A] truncate max-w-[200px]" aria-current="page">
            {product.title}
          </li>
        </ol>
      </nav>

      <div className="flex flex-col md:flex-row gap-10 lg:gap-20 items-start relative">
        
        {/* Product Images - Sticky */}
        <div className="w-full md:w-[55%] lg:w-[60%]">
          <div className="md:sticky md:top-28">
            <ImageGallery images={product.images || []} productTitle={product.title} />
            
            {/* Thumbnail selector */}
            {product.images && product.images.length > 1 && (
              <div className="mt-6 flex items-center gap-3">
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#8B8680]">Views:</span>
                <div className="flex gap-2">
                  {product.images.slice(0, 6).map((img, idx) => (
                    <button
                      key={img.id}
                      className={cn(
                        "w-16 h-20 overflow-hidden border transition-all duration-300 relative",
                        idx === 0 ? 'border-[#0A0A0A]' : 'border-[rgba(10,10,10,0.1)] hover:border-[#0A0A0A]'
                      )}
                      aria-label={`View ${img.image_type || `image ${idx + 1}`}`}
                    >
                      <Image
                        src={img.image_url}
                        alt={img.alt_text || ''}
                        fill
                        className="object-cover"
                        sizes="64px"
                      />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Product Info - Sticky */}
        <div className="w-full md:w-[45%] lg:w-[40%] flex flex-col md:sticky md:top-28">
          {/* Brand & Title */}
          <div className="mb-8">
            <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#B8913A] mb-3 block">
              Variety Vista
            </span>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-[-0.03em] text-[#0A0A0A] mb-4 uppercase leading-[1.05]">
              {product.title}
            </h1>
            
            {/* Fit & Wash badges */}
            <div className="flex flex-wrap gap-2 mb-6">
              {product.fit_type && (
                <span className="px-3 py-1 bg-[#F5F4F2] text-[#0A0A0A] text-[10px] font-semibold uppercase tracking-[0.15em]">
                  {product.fit_type.replace('_', ' ')}
                </span>
              )}
              {product.wash && (
                <span className="px-3 py-1 bg-[#F5F4F2] text-[#0A0A0A] text-[10px] font-semibold uppercase tracking-[0.15em]">
                  {product.wash}
                </span>
              )}
              {product.rise && (
                <span className="px-3 py-1 bg-[#F5F4F2] text-[#0A0A0A] text-[10px] font-semibold uppercase tracking-[0.15em]">
                  {product.rise.replace('_', ' ')} Rise
                </span>
              )}
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-4 mt-2">
              <span className="text-3xl md:text-4xl font-bold tracking-tight text-[#0A0A0A]">
                {formatPrice(currentPrice)}
              </span>
              {product.sale_price && (
                <>
                  <span className="text-[#8B8680] line-through text-xl">₹{product.price}</span>
                  <span className="text-[#C42B2B] font-bold text-xs tracking-widest uppercase bg-[#C42B2B]/10 px-2 py-1">
                    {Math.round((1 - product.sale_price / product.price) * 100)}% OFF
                  </span>
                </>
              )}
            </div>
            <p className="text-[#8B8680] mt-2 text-xs font-semibold tracking-[0.15em] uppercase">Inclusive of all taxes</p>
          </div>

          {/* Hairline Divider */}
          <div className="border-t border-[rgba(10,10,10,0.06)] mb-8" />

          {/* Size Selector */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-[#0A0A0A] uppercase tracking-[0.2em] text-xs">Select Size (Waist)</h3>
              <button 
                onClick={() => setIsSizeGuideOpen(true)}
                className="text-xs font-bold text-[#8B8680] hover:text-[#0A0A0A] flex items-center gap-1.5 transition-colors uppercase tracking-[0.15em] border-b border-transparent hover:border-[#0A0A0A] pb-0.5"
              >
                <Ruler className="w-3.5 h-3.5" /> Size Guide
              </button>
            </div>
            
            {availableSizes.length > 0 ? (
              <div className="flex flex-wrap gap-2.5 mb-6" role="radiogroup" aria-label="Select waist size">
                {availableSizes.map(size => {
                  const isSelected = selectedSize === size;
                  const variantsForSize = product.variants.filter(v => v.waist_size === size);
                  const hasStock = variantsForSize.some(v => v.stock_quantity > 0);
                  const lowStock = hasStock && variantsForSize.some(v => v.stock_quantity > 0 && v.stock_quantity <= 3);

                  return (
                    <button
                      key={size}
                      disabled={!hasStock}
                      onClick={() => setSelectedSize(size)}
                      className={cn(
                        "h-12 min-w-[3rem] px-4 flex items-center justify-center font-bold text-xs uppercase tracking-wider transition-all duration-300 relative",
                        isSelected 
                          ? 'bg-[#0A0A0A] text-[#FAFAF9] ring-2 ring-[#0A0A0A] ring-offset-2' 
                          : 'border border-[rgba(10,10,10,0.15)] text-[#0A0A0A] hover:border-[#0A0A0A] bg-[#FAFAF9] hover:bg-[#F5F4F2]',
                        !hasStock && 'opacity-30 cursor-not-allowed bg-transparent border-[rgba(10,10,10,0.06)] line-through',
                        lowStock && hasStock && !isSelected && 'border-[#B8913A]'
                      )}
                      aria-pressed={isSelected}
                      aria-label={`Waist size ${size} inches${!hasStock ? ', out of stock' : lowStock ? ', low stock' : ''}`}
                    >
                      {size}
                      {lowStock && hasStock && !isSelected && (
                        <span className="absolute -top-1 -right-1 w-3.5 h-3.5 flex items-center justify-center bg-[#B8913A] text-white text-[8px] font-bold">
                          !
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            ) : (
              <p className="text-[#8B8680] text-sm">No sizes available</p>
            )}

            {/* Length Selector */}
            {availableLengths.length > 0 && (
              <div className="mb-4">
                <h3 className="font-bold text-[#0A0A0A] uppercase tracking-[0.2em] text-xs mb-3">Select Length (Inseam)</h3>
                <div className="flex flex-wrap gap-2.5" role="radiogroup" aria-label="Select inseam length">
                  {availableLengths.map(length => {
                    const isSelected = selectedLength === length;
                    const variant = product.variants.find(v => v.waist_size === selectedSize && (v.inseam_length === length || v.length === length));
                    const isOutOfStock = !variant || variant.stock_quantity === 0;
                    const lowStock = !isOutOfStock && variant && variant.stock_quantity <= 3;

                    return (
                      <button
                        key={length}
                        disabled={isOutOfStock}
                        onClick={() => setSelectedLength(length)}
                        className={cn(
                          "h-10 min-w-[3.5rem] px-4 flex items-center justify-center font-bold text-xs uppercase tracking-wider transition-all duration-300 relative",
                          isSelected 
                            ? 'bg-[#0A0A0A] text-[#FAFAF9] ring-2 ring-[#0A0A0A] ring-offset-1' 
                            : 'border border-[rgba(10,10,10,0.15)] text-[#0A0A0A] hover:border-[#0A0A0A] bg-[#FAFAF9] hover:bg-[#F5F4F2]',
                          isOutOfStock && 'opacity-30 cursor-not-allowed bg-transparent border-[rgba(10,10,10,0.06)] line-through',
                          lowStock && !isOutOfStock && !isSelected && 'border-[#B8913A]'
                        )}
                        aria-pressed={isSelected}
                        aria-label={`Inseam length ${length} inches${isOutOfStock ? ', out of stock' : lowStock ? ', low stock' : ''}`}
                      >
                        L{length}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
            
            <p className="text-xs text-[#8B8680] mt-5 font-semibold uppercase tracking-[0.15em] flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-[#B8913A]" /> Model is 6&apos;1&rdquo; wearing size 32
            </p>
          </div>

          {/* Quantity Selector */}
          <div className="mb-8">
            <label htmlFor="quantity" className="font-bold text-[#0A0A0A] uppercase tracking-[0.2em] text-xs mb-3 block">
              Quantity
            </label>
            <div className="flex items-center gap-0 border border-[rgba(10,10,10,0.15)] w-32 bg-[#FAFAF9]">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                disabled={quantity <= 1}
                className="w-10 h-11 flex items-center justify-center text-[#0A0A0A] hover:bg-[#F5F4F2] transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                aria-label="Decrease quantity"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <input
                id="quantity"
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                min={1}
                max={99}
                className="w-12 h-11 text-center text-[#0A0A0A] font-bold text-sm bg-transparent focus:outline-none border-none appearance-none"
                aria-label="Quantity"
              />
              <button
                onClick={() => setQuantity(Math.min(99, quantity + 1))}
                className="w-10 h-11 flex items-center justify-center text-[#0A0A0A] hover:bg-[#F5F4F2] transition-colors"
                aria-label="Increase quantity"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Add to Cart & Buy Now */}
          <div ref={atcButtonRef} className="flex flex-col gap-3 mb-8">
            <div className="flex gap-3">
              <motion.button
                whileTap={{ scale: 0.98 }}
                className={cn(
                  "flex-1 font-bold uppercase tracking-[0.15em] text-xs h-14 transition-all duration-500 flex items-center justify-center gap-2",
                  addedToCart 
                    ? "bg-[#1E8E3E] text-white" 
                    : "bg-[#0A0A0A] text-[#FAFAF9] hover:bg-[#B8913A]"
                )}
                onClick={handleAddToCart}
              >
                {addedToCart ? (
                  <>
                    <Check className="w-4 h-4" /> Added to Cart
                  </>
                ) : (
                  'Add to Cart'
                )}
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={() => toggleWishlist(product.id)}
                className="w-14 h-14 shrink-0 border border-[rgba(10,10,10,0.15)] bg-[#FAFAF9] flex items-center justify-center hover:border-[#0A0A0A] transition-colors"
                aria-label={isProductWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
              >
                <Heart className={cn(
                  "w-5 h-5 transition-colors",
                  isProductWishlisted ? 'fill-[#C42B2B] text-[#C42B2B]' : 'text-[#0A0A0A]'
                )} />
              </motion.button>
            </div>
            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={handleBuyNow}
              className="h-14 font-bold uppercase tracking-[0.15em] text-xs border border-[#0A0A0A] text-[#0A0A0A] flex items-center justify-center gap-2 hover:bg-[#0A0A0A] hover:text-[#FAFAF9] transition-all duration-500"
            >
              <Zap className="w-4 h-4" /> Buy it Now
            </motion.button>
          </div>

          {/* Share Actions */}
          <div className="flex items-center gap-3 mb-8">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#8B8680]">Share:</span>
            <button
              onClick={handleShare}
              className="w-8 h-8 flex items-center justify-center border border-[rgba(10,10,10,0.1)] text-[#0A0A0A] hover:border-[#0A0A0A] transition-colors"
              aria-label="Share product"
            >
              <Share2 className="w-4 h-4" />
            </button>
            <button
              onClick={copyLink}
              className="w-8 h-8 flex items-center justify-center border border-[rgba(10,10,10,0.1)] text-[#0A0A0A] hover:border-[#0A0A0A] transition-colors"
              aria-label="Copy link"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
            </button>
          </div>

          {/* Delivery & Serviceability Checker */}
          <div className="mb-8">
            <PincodeChecker />
          </div>

          {/* Product Details Accordions */}
          <div className="border-t border-[rgba(10,10,10,0.08)] pt-2 mt-4">
            <Accordion 
              items={[
                {
                  title: 'Description',
                  content: (
                    <div className="py-4 text-sm text-[#8B8680] leading-relaxed">
                      {product.description || 'Premium quality denim crafted for comfort and style. Designed to last and fade beautifully over time.'}
                    </div>
                  )
                },
                {
                  title: 'Fit & Fabric',
                  content: (
                    <div className="py-4 text-sm text-[#8B8680]">
                      <dl className="space-y-3">
                        <div className="flex justify-between border-b border-[rgba(10,10,10,0.04)] pb-2">
                          <dt className="font-semibold text-[#0A0A0A]">Fit</dt>
                          <dd className="capitalize">{product.fit_type?.replace('_', ' ') || 'N/A'}</dd>
                        </div>
                        <div className="flex justify-between border-b border-[rgba(10,10,10,0.04)] pb-2">
                          <dt className="font-semibold text-[#0A0A0A]">Rise</dt>
                          <dd className="capitalize">{product.rise || 'N/A'}</dd>
                        </div>
                        <div className="flex justify-between border-b border-[rgba(10,10,10,0.04)] pb-2">
                          <dt className="font-semibold text-[#0A0A0A]">Stretch</dt>
                          <dd className="capitalize">{product.stretch_type?.replace('_', ' ') || 'N/A'}</dd>
                        </div>
                        <div className="flex justify-between">
                          <dt className="font-semibold text-[#0A0A0A]">Fabric</dt>
                          <dd>{product.fabric_composition || 'N/A'}</dd>
                        </div>
                      </dl>
                    </div>
                  )
                },
                {
                  title: 'Shipping & Returns',
                  content: (
                    <div className="py-4 text-sm text-[#8B8680] space-y-2">
                      <p>Free shipping on orders over ₹1,999.</p>
                      <p>Standard delivery: 2-4 business days.</p>
                      <p>Same-day delivery available in Mumbai.</p>
                      <p>Easy 7-day returns and exchanges for unworn items with tags attached.</p>
                    </div>
                  )
                },
                {
                  title: 'Care Instructions',
                  content: (
                    <div className="py-4 text-sm text-[#8B8680]">
                      <ul className="list-disc pl-4 space-y-2">
                        <li>Wash inside out in cold water</li>
                        <li>Use mild detergent, no bleach</li>
                        <li>Hang dry or tumble dry low</li>
                        <li>Iron on medium heat if needed</li>
                        <li>Raw denim: wash minimally for unique fades</li>
                      </ul>
                    </div>
                  )
                }
              ]}
            />
          </div>

          {/* Trust Badges */}
          <div className="mt-8 pt-8 border-t border-[rgba(10,10,10,0.08)]">
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center gap-3 p-4 bg-[#F5F4F2]">
                <Check className="w-4 h-4 text-[#B8913A] shrink-0" />
                <div>
                  <p className="font-bold text-[#0A0A0A] text-xs uppercase tracking-wider">Quality Guaranteed</p>
                  <p className="text-[#8B8680] text-[11px]">Premium denim</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-[#F5F4F2]">
                <RotateCcw className="w-4 h-4 text-[#B8913A] shrink-0" />
                <div>
                  <p className="font-bold text-[#0A0A0A] text-xs uppercase tracking-wider">7-Day Returns</p>
                  <p className="text-[#8B8680] text-[11px]">Hassle-free</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-[#F5F4F2]">
                <Truck className="w-4 h-4 text-[#B8913A] shrink-0" />
                <div>
                  <p className="font-bold text-[#0A0A0A] text-xs uppercase tracking-wider">Fast Shipping</p>
                  <p className="text-[#8B8680] text-[11px]">2-4 days pan-India</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-[#F5F4F2]">
                <Shield className="w-4 h-4 text-[#B8913A] shrink-0" />
                <div>
                  <p className="font-bold text-[#0A0A0A] text-xs uppercase tracking-wider">Secure Payment</p>
                  <p className="text-[#8B8680] text-[11px]">100% encrypted</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
       
      {/* Merchandising & Reviews */}
      <RelatedProducts products={relatedProducts || []} />
      
      <RecentlyViewed currentProduct={product} />

      {/* Product Reviews Section */}
      <ProductReviews productTitle={product.title} />

      {/* Modals */}
      <SizeGuideModal isOpen={isSizeGuideOpen} onClose={() => setIsSizeGuideOpen(false)} gender={product.gender} />
      
      {/* Share Sheet */}
      <AnimatePresence>
        {showShareSheet && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-50"
              onClick={() => setShowShareSheet(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: '100%' }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: '100%' }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed bottom-0 left-0 right-0 bg-[#FAFAF9] z-50 p-6 md:p-8 border-t border-[rgba(10,10,10,0.12)]"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-[#0A0A0A]">Share Product</h3>
                <button 
                  onClick={() => setShowShareSheet(false)}
                  className="p-1 text-[#8B8680] hover:text-[#0A0A0A]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <button 
                  onClick={handleShare}
                  className="flex flex-col items-center gap-2 p-4 bg-[#F5F4F2] hover:bg-[rgba(10,10,10,0.06)] transition-colors"
                >
                  <Share2 className="w-5 h-5 text-[#B8913A]" />
                  <span className="text-xs font-bold uppercase tracking-wider text-[#0A0A0A]">Share</span>
                </button>
                <button 
                  onClick={copyLink}
                  className="flex flex-col items-center gap-2 p-4 bg-[#F5F4F2] hover:bg-[rgba(10,10,10,0.06)] transition-colors"
                >
                  <svg className="w-5 h-5 text-[#B8913A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                  </svg>
                  <span className="text-xs font-bold uppercase tracking-wider text-[#0A0A0A]">Copy Link</span>
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Sticky Mobile Add to Cart Bar */}
      <StickyAddToCart
        product={product}
        selectedVariant={selectedVariant}
        onAddToCart={handleAddToCart}
        onSelectSizeClick={() => {
          window.scrollTo({ top: 300, behavior: 'smooth' });
        }}
        isAdding={addedToCart}
        targetRef={atcButtonRef}
      />
    </div>
  );
}