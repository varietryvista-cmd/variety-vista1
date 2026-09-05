'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { formatPrice } from '@/lib/utils';
import FreeShippingBar from '@/components/storefront/FreeShippingBar';

export default function CartView() {
  const { items, updateQuantity, removeItem, subtotal } = useCart();

  if (items.length === 0) {
    return (
      <div className="text-center py-20 px-4 bg-[#F5F4F2] border border-[rgba(10,10,10,0.06)]">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-[#FAFAF9] text-[#B8913A] mb-6 border border-[rgba(10,10,10,0.06)]">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold uppercase tracking-tight text-[#0A0A0A] mb-3">Your cart is empty</h2>
        <p className="text-[#8B8680] mb-8 max-w-md mx-auto text-sm leading-relaxed">
          Looks like you haven&apos;t added anything to your cart yet. Discover our latest collections and find your perfect fit.
        </p>
        <Link href="/collections/all" className="inline-flex items-center gap-3 px-8 py-4 bg-[#0A0A0A] text-[#FAFAF9] text-xs font-bold uppercase tracking-[0.15em] hover:bg-[#B8913A] transition-colors">
          Continue Shopping <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="text-[#0A0A0A]">
      <FreeShippingBar subtotal={subtotal} className="mb-8" />
      <div className="lg:grid lg:grid-cols-12 lg:gap-x-12 lg:items-start">
        <div className="lg:col-span-8">
        <div className="border-t border-[rgba(10,10,10,0.08)] divide-y divide-[rgba(10,10,10,0.06)]">
          {items.map((item) => (
            <div key={item.variantId} className="flex py-6 sm:py-8 gap-6 items-start">
              <div className="flex-shrink-0 relative w-24 h-32 sm:w-32 sm:h-40 bg-[#F5F4F2] overflow-hidden border border-[rgba(10,10,10,0.06)]">
                {item.image ? (
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover object-center"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <ShoppingBag className="w-8 h-8 text-[#8B8680]" />
                  </div>
                )}
              </div>

              <div className="flex flex-1 flex-col justify-between sm:flex-row sm:items-center gap-6">
                <div>
                  <h3 className="text-base font-bold uppercase tracking-tight text-[#0A0A0A]">
                    <Link href={`/products/${item.slug}`} className="hover:text-[#B8913A] transition-colors">
                      {item.title}
                    </Link>
                  </h3>
                  <div className="mt-1 flex text-xs font-semibold uppercase tracking-wider text-[#8B8680] space-x-2">
                    {item.wash && <span>{item.wash}</span>}
                    {item.waistSize && (
                      <>
                        <span className="border-l border-[rgba(10,10,10,0.12)] pl-2">W{item.waistSize}</span>
                        {item.inseamLength && <span> / L{item.inseamLength}</span>}
                      </>
                    )}
                  </div>
                  <p className="mt-3 text-base font-bold text-[#0A0A0A]">
                    {formatPrice(item.price)}
                  </p>
                </div>

                <div className="flex items-center gap-6">
                  {/* Quantity */}
                  <div className="flex items-center border border-[rgba(10,10,10,0.15)] bg-[#FAFAF9]">
                    <button
                      type="button"
                      className="w-9 h-9 flex items-center justify-center text-[#0A0A0A] hover:bg-[#F5F4F2] disabled:opacity-30"
                      onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                      aria-label="Decrease quantity"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="px-3 text-xs font-bold text-[#0A0A0A] w-10 text-center">
                      {item.quantity}
                    </span>
                    <button
                      type="button"
                      className="w-9 h-9 flex items-center justify-center text-[#0A0A0A] hover:bg-[#F5F4F2]"
                      onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                      aria-label="Increase quantity"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Remove */}
                  <button
                    type="button"
                    className="p-2 text-[#8B8680] hover:text-[#C42B2B] transition-colors"
                    onClick={() => removeItem(item.variantId)}
                    aria-label="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-16 bg-[#F5F4F2] border border-[rgba(10,10,10,0.06)] p-8 lg:mt-0 lg:col-span-4 lg:sticky lg:top-28">
        <h2 className="text-xl font-bold uppercase tracking-tight text-[#0A0A0A] mb-6">Order Summary</h2>
        
        <dl className="space-y-4 text-xs font-semibold uppercase tracking-wider text-[#8B8680]">
          <div className="flex items-center justify-between">
            <dt>Subtotal</dt>
            <dd className="font-bold text-[#0A0A0A] text-sm">{formatPrice(subtotal)}</dd>
          </div>
          <div className="flex items-center justify-between border-t border-[rgba(10,10,10,0.06)] pt-4">
            <dt>Shipping</dt>
            <dd className="font-bold text-[#0A0A0A] text-sm">Calculated at checkout</dd>
          </div>
          <div className="flex items-center justify-between border-t border-[rgba(10,10,10,0.06)] pt-4">
            <dt className="text-sm font-bold text-[#0A0A0A]">Total</dt>
            <dd className="text-base font-bold text-[#0A0A0A]">{formatPrice(subtotal)}</dd>
          </div>
        </dl>

        <div className="mt-8">
          <Link href="/checkout" className="block w-full">
            <button className="w-full py-4 bg-[#0A0A0A] text-[#FAFAF9] text-xs font-bold uppercase tracking-[0.15em] hover:bg-[#B8913A] transition-colors">
              Proceed to Checkout
            </button>
          </Link>
        </div>
        
        <div className="mt-6 text-center text-xs text-[#8B8680]">
          <p>
            or{' '}
            <Link href="/collections/all" className="font-bold uppercase tracking-wider text-[#0A0A0A] hover:text-[#B8913A] transition-colors">
              Continue Shopping &rarr;
            </Link>
          </p>
        </div>
      </div>
    </div>
  </div>
  );
}
