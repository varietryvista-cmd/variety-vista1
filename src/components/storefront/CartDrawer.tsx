'use client';

import { motion, AnimatePresence } from 'motion/react';
import Image from 'next/image';
import Link from 'next/link';
import { X, Plus, Minus, Trash2, ShoppingBag, Tag } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { formatPrice } from '@/lib/utils';
import { useState, useEffect } from 'react';
import { fetchFeaturedProducts } from '@/app/actions/search';
import { validateCoupon } from '@/app/actions/coupons';
import FreeShippingBar from '@/components/storefront/FreeShippingBar';
import type { Product, ProductImage, ProductVariant } from '@/types';

type FullProduct = Product & { images: ProductImage[]; variants: ProductVariant[] };

export default function CartDrawer() {
  const {
    items,
    removeItem,
    updateQuantity,
    subtotal,
    itemCount,
    isOpen,
    closeCart,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
  } = useCart();
  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState('');
  const [isCheckingCoupon, setIsCheckingCoupon] = useState(false);
  const [upsellProducts, setUpsellProducts] = useState<FullProduct[]>([]);

  useEffect(() => {
    if (isOpen) {
      fetchFeaturedProducts().then(products => setUpsellProducts(products.slice(0, 2)));
    }
  }, [isOpen]);

  const handleApplyCoupon = async () => {
    if (!couponInput.trim()) return;
    setIsCheckingCoupon(true);
    setCouponError('');

    try {
      const res = await validateCoupon(couponInput, subtotal);
      if (res.valid && res.coupon) {
        applyCoupon(res.coupon.code);
        setCouponInput('');
        setCouponError('');
      } else {
        setCouponError(res.message);
      }
    } catch {
      setCouponError('Failed to validate coupon.');
    } finally {
      setIsCheckingCoupon(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 bg-[#0a111f]/40 backdrop-blur-md z-[60]"
            onClick={closeCart}
          />

          {/* Drawer panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
            className="fixed inset-y-0 right-0 w-full max-w-md bg-white z-[60] flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 h-20 border-b border-[rgba(0,0,0,0.04)] flex-shrink-0">
              <div className="flex items-center gap-3">
                <ShoppingBag className="w-5 h-5 text-primary-text" />
                <h2 className="text-sm font-bold uppercase tracking-widest text-primary-text">
                  Your Cart <span className="text-secondary-text">({itemCount})</span>
                </h2>
              </div>
              <button
                onClick={closeCart}
                className="p-1.5 hover:bg-secondary-bg rounded-full transition-colors"
                aria-label="Close cart"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Cart items */}
            {items.length === 0 ? (
              /* Empty state */
              <div className="flex-1 flex flex-col items-center justify-center px-10 text-center">
                <h3 className="text-2xl font-bold uppercase tracking-tight text-primary-text mb-3">Your cart is empty</h3>
                <p className="text-sm text-secondary-text mb-8">
                  Looks like you haven&apos;t found your perfect fit yet. Let&apos;s change that.
                </p>
                <Link
                  href="/collections/all"
                  onClick={closeCart}
                  className="inline-flex items-center justify-center h-14 px-10 bg-primary-text text-white text-sm font-bold uppercase tracking-widest rounded-full hover:bg-primary-text/90 transition-colors"
                >
                  Discover New Arrivals
                </Link>
              </div>
            ) : (
              <>
                {/* Free Shipping Progress Bar */}
                <FreeShippingBar subtotal={subtotal} className="border-b border-t-0 border-x-0" />

                {/* Items list */}
                <div className="flex-1 overflow-y-auto px-5 py-4">
                  <div className="space-y-4">
                    <AnimatePresence initial={false}>
                      {items.map((item, index) => (
                        <motion.div
                          key={item.variantId}
                          layout
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, height: 0, marginBottom: 0, overflow: 'hidden' }}
                          transition={{
                            duration: 0.25,
                            delay: index * 0.04,
                          }}
                          className="flex gap-4"
                        >
                          {/* Product image */}
                          <Link
                            href={`/products/${item.slug}`}
                            onClick={closeCart}
                            className="relative w-20 h-[106px] flex-shrink-0 bg-secondary-bg rounded overflow-hidden"
                          >
                            {item.image ? (
                              <Image
                                src={item.image}
                                alt={item.title}
                                fill
                                className="object-cover"
                                sizes="80px"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-secondary-text text-xs">
                                No image
                              </div>
                            )}
                          </Link>

                          {/* Item details */}
                          <div className="flex-1 min-w-0">
                            <Link
                              href={`/products/${item.slug}`}
                              onClick={closeCart}
                              className="text-sm font-medium leading-tight line-clamp-1 hover:text-denim transition-colors"
                            >
                              {item.title}
                            </Link>

                            <div className="mt-1 text-xs text-secondary-text">
                              {item.wash && <span>{item.wash}</span>}
                              {item.waistSize && (
                                <span>
                                  {item.wash ? ' · ' : ''}W{item.waistSize}
                                </span>
                              )}
                              {item.inseamLength && <span> / L{item.inseamLength}</span>}
                            </div>

                            <div className="mt-2 flex items-center justify-between">
                              {/* Quantity stepper */}
                              <div className="flex items-center border border-[rgba(0,0,0,0.12)] rounded">
                                <button
                                  onClick={() =>
                                    updateQuantity(
                                      item.variantId,
                                      Math.max(1, item.quantity - 1)
                                    )
                                  }
                                  className="w-7 h-7 flex items-center justify-center text-secondary-text hover:text-primary-text transition-colors"
                                  aria-label="Decrease quantity"
                                  disabled={item.quantity <= 1}
                                >
                                  <Minus className="w-3 h-3" />
                                </button>
                                <span className="w-7 h-7 flex items-center justify-center text-xs font-medium">
                                  {item.quantity}
                                </span>
                                <button
                                  onClick={() =>
                                    updateQuantity(item.variantId, item.quantity + 1)
                                  }
                                  className="w-7 h-7 flex items-center justify-center text-secondary-text hover:text-primary-text transition-colors"
                                  aria-label="Increase quantity"
                                >
                                  <Plus className="w-3 h-3" />
                                </button>
                              </div>

                              {/* Price + remove */}
                              <div className="flex items-center gap-3">
                                <span className="text-sm font-semibold">
                                  {formatPrice(item.price * item.quantity)}
                                </span>
                                <button
                                  onClick={() => removeItem(item.variantId)}
                                  className="p-1 text-secondary-text hover:text-sale transition-colors"
                                  aria-label={`Remove ${item.title}`}
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                  
                  {/* Upsell Section */}
                  <div className="mt-8 pt-6 border-t border-[rgba(0,0,0,0.04)]">
                    <h3 className="text-xs font-bold uppercase tracking-widest mb-4">You might also like</h3>
                    <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                      {upsellProducts.map((product) => (
                        <div key={product.id} className="w-[140px] flex-shrink-0 group">
                          <Link href={`/products/${product.slug}`} onClick={closeCart} className="block relative aspect-[3/4] bg-secondary-bg rounded-xl overflow-hidden mb-3">
                            <Image 
                              src={product.images?.[0]?.image_url || '/placeholder.png'} 
                              alt={product.title} 
                              fill
                              className="object-cover" 
                            />
                            <div className="absolute inset-0 bg-transparent group-hover:bg-[#0a111f]/10 transition-colors duration-500 ease-[0.16,1,0.3,1]" />
                          </Link>
                          <Link href={`/products/${product.slug}`} onClick={closeCart} className="block text-xs font-bold uppercase tracking-wide line-clamp-1 hover:text-primary-text/70 transition-colors">
                            {product.title}
                          </Link>
                          <div className="text-xs font-semibold mt-1 tracking-tight">{formatPrice(product.price)}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Footer — coupon + summary + checkout */}
                <div className="flex-shrink-0 border-t border-[rgba(0,0,0,0.04)] px-6 py-6 space-y-6">
                  {/* Coupon */}
                  {appliedCoupon ? (
                    <div className="flex items-center justify-between bg-secondary-bg px-4 py-3 rounded-xl text-sm">
                      <div className="flex items-center gap-2 text-primary-text">
                        <Tag className="w-4 h-4" />
                        <span className="font-bold uppercase tracking-wider">{appliedCoupon}</span>
                      </div>
                      <button
                        onClick={removeCoupon}
                        className="text-xs font-bold uppercase tracking-widest text-secondary-text hover:text-sale transition-colors"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={couponInput}
                        onChange={(e) => setCouponInput(e.target.value)}
                        placeholder="Coupon code"
                        className="flex-1 h-12 px-4 text-sm font-medium border border-[rgba(0,0,0,0.08)] rounded-xl focus:ring-2 focus:ring-primary-text focus:outline-none transition-all uppercase placeholder:normal-case"
                      />
                      <button
                        onClick={handleApplyCoupon}
                        disabled={isCheckingCoupon || !couponInput.trim()}
                        className="h-12 px-6 text-xs font-bold uppercase tracking-widest border-2 border-primary-text text-primary-text rounded-xl hover:bg-secondary-bg transition-colors disabled:opacity-40"
                      >
                        {isCheckingCoupon ? '...' : 'Apply'}
                      </button>
                    </div>
                  )}
                  {couponError && (
                    <p className="text-xs text-sale">{couponError}</p>
                  )}

                  {/* Summary */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-base">
                      <span className="font-bold uppercase tracking-wider text-xs">Subtotal</span>
                      <span className="font-bold tracking-tight">{formatPrice(subtotal)}</span>
                    </div>
                    <p className="text-xs font-medium text-secondary-text uppercase tracking-wider">
                      Shipping & taxes calculated at checkout
                    </p>
                  </div>

                  {/* Checkout CTA */}
                  <Link
                    href="/checkout"
                    onClick={closeCart}
                    className="flex items-center justify-center w-full h-14 bg-primary-text text-white text-sm font-bold uppercase tracking-widest rounded-xl hover:bg-primary-text/90 transition-colors"
                  >
                    Proceed to Checkout — {formatPrice(subtotal)}
                  </Link>

                  <Link
                    href="/cart"
                    onClick={closeCart}
                    className="block text-center text-xs text-secondary-text underline hover:text-primary-text transition-colors"
                  >
                    View full cart
                  </Link>
                </div>
              </>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
