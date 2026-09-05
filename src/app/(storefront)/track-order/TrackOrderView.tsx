'use client';

import * as React from 'react';
import { Search, Truck, CheckCircle2, Clock, ArrowRight, MessageCircle, AlertCircle } from 'lucide-react';
import { trackOrder, type TrackedOrder } from '@/app/actions/tracking';
import { formatPrice } from '@/lib/utils';

export default function TrackOrderView({ initialQuery = '' }: { initialQuery?: string }) {
  const [query, setQuery] = React.useState(initialQuery);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [order, setOrder] = React.useState<TrackedOrder | null>(null);

  const handleTrack = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const result = await trackOrder(query);
      if (result.success && result.order) {
        setOrder(result.order);
        setError(null);
      } else {
        setOrder(null);
        setError(result.message || 'Order not found.');
      }
    } catch {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    if (initialQuery) {
      handleTrack();
    }
  }, [initialQuery]);

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center mb-12">
        <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#B8913A] mb-3 block">
          Shipment Intelligence
        </span>
        <h1 className="text-4xl md:text-5xl font-bold uppercase tracking-[-0.03em] text-[#0A0A0A] mb-4">
          Track Your Order
        </h1>
        <p className="text-[#8B8680] text-sm max-w-md mx-auto leading-relaxed">
          Enter your Order Number (e.g. <strong className="text-[#0A0A0A]">VV-10001</strong>) or registered email to view real-time delivery status.
        </p>
      </div>

      {/* Search Input Box */}
      <form onSubmit={handleTrack} className="mb-14">
        <div className="flex flex-col sm:flex-row gap-3 max-w-2xl mx-auto">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-[#8B8680] absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Order Number (VV-10001) or Email"
              className="w-full h-14 pl-11 pr-4 bg-[#FAFAF9] border border-[rgba(10,10,10,0.15)] text-sm font-semibold uppercase tracking-wider text-[#0A0A0A] focus:outline-none focus:border-[#0A0A0A] placeholder:text-[#8B8680] placeholder:normal-case transition-colors"
            />
          </div>
          <button
            type="submit"
            disabled={loading || !query.trim()}
            className="h-14 px-8 bg-[#0A0A0A] text-[#FAFAF9] hover:bg-[#B8913A] transition-colors text-xs font-bold uppercase tracking-[0.15em] flex items-center justify-center gap-2 shrink-0 disabled:opacity-40"
          >
            {loading ? (
              <span>Searching...</span>
            ) : (
              <>
                <span>Track Order</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </form>

      {/* Error Message */}
      {error && (
        <div className="max-w-2xl mx-auto p-4 mb-10 bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-center gap-3">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Order Results */}
      {order && (
        <div className="space-y-10 animate-fade-in">
          {/* Order Header Summary Banner */}
          <div className="p-8 bg-[#F5F4F2] border border-[rgba(10,10,10,0.06)] flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h2 className="text-xl font-bold uppercase tracking-tight text-[#0A0A0A]">
                  Order #{order.orderNumber}
                </h2>
                <span className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest bg-[#B8913A] text-white">
                  {order.fulfillmentStatus}
                </span>
              </div>
              <p className="text-xs text-[#8B8680] font-semibold uppercase tracking-wider">
                Placed on {order.createdAt} · Delivering to {order.shippingCity}, {order.shippingState}
              </p>
            </div>

            <div className="flex items-center gap-3 text-xs font-semibold uppercase tracking-wider text-[#8B8680]">
              <Truck className="w-4 h-4 text-[#B8913A]" />
              <span>Courier: <strong className="text-[#0A0A0A]">{order.courierName}</strong></span>
            </div>
          </div>

          {/* Delivery Milestone Timeline */}
          <div className="p-8 md:p-10 bg-[#FAFAF9] border border-[rgba(10,10,10,0.08)]">
            <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-[#0A0A0A] mb-8">
              Shipment Progress
            </h3>

            <div className="relative pl-6 md:pl-8 space-y-8 before:absolute before:left-[11px] md:before:left-[15px] before:top-3 before:bottom-3 before:w-0.5 before:bg-[rgba(10,10,10,0.1)]">
              {order.timeline.map((step, idx) => (
                <div key={idx} className="relative flex items-start gap-4 group">
                  {/* Milestone Node Icon */}
                  <div
                    className={`absolute -left-6 md:-left-8 top-0.5 w-6 h-6 md:w-8 md:h-8 flex items-center justify-center border transition-colors ${
                      step.isCompleted
                        ? 'bg-[#B8913A] border-[#B8913A] text-white'
                        : step.isCurrent
                        ? 'bg-[#0A0A0A] border-[#0A0A0A] text-white'
                        : 'bg-[#FAFAF9] border-[rgba(10,10,10,0.15)] text-[#8B8680]'
                    }`}
                  >
                    {step.isCompleted ? (
                      <CheckCircle2 className="w-3.5 h-3.5 md:w-4 md:h-4" />
                    ) : (
                      <Clock className="w-3.5 h-3.5 md:w-4 md:h-4" />
                    )}
                  </div>

                  {/* Step Description */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1">
                      <h4
                        className={`text-sm font-bold uppercase tracking-wider ${
                          step.isCompleted || step.isCurrent ? 'text-[#0A0A0A]' : 'text-[#8B8680]'
                        }`}
                      >
                        {step.title}
                      </h4>
                      {step.date && (
                        <span className="text-[10px] font-semibold text-[#8B8680] uppercase tracking-wider">
                          {step.date}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-[#8B8680] leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Items & Payment Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            {/* Items */}
            <div className="md:col-span-7 p-6 bg-[#F5F4F2] border border-[rgba(10,10,10,0.06)]">
              <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-[#0A0A0A] mb-4">
                Items in this Shipment ({order.items.length})
              </h3>
              <div className="divide-y divide-[rgba(10,10,10,0.06)]">
                {order.items.map((item, i) => (
                  <div key={i} className="py-4 flex items-center justify-between gap-4">
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-tight text-[#0A0A0A]">
                        {item.title}
                      </h4>
                      <p className="text-[11px] font-semibold text-[#8B8680] mt-0.5 uppercase tracking-wider">
                        {item.waistSize && `Waist: ${item.waistSize}`} · Qty: {item.quantity}
                      </p>
                    </div>
                    <span className="text-xs font-bold text-[#0A0A0A]">
                      {formatPrice(item.unitPrice * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Price Summary & Help */}
            <div className="md:col-span-5 flex flex-col gap-6">
              <div className="p-6 bg-[#F5F4F2] border border-[rgba(10,10,10,0.06)] space-y-3 text-xs font-semibold uppercase tracking-wider text-[#8B8680]">
                <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-[#0A0A0A] mb-4">
                  Payment Summary
                </h3>
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="text-[#0A0A0A] font-bold">{formatPrice(order.subtotal)}</span>
                </div>
                {order.discountAmount > 0 && (
                  <div className="flex justify-between text-[#B8913A]">
                    <span>Discount</span>
                    <span className="font-bold">-{formatPrice(order.discountAmount)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="text-[#0A0A0A] font-bold">
                    {order.shippingCost === 0 ? 'Free' : formatPrice(order.shippingCost)}
                  </span>
                </div>
                <div className="border-t border-[rgba(10,10,10,0.06)] pt-3 flex justify-between text-sm font-bold text-[#0A0A0A]">
                  <span>Total Paid</span>
                  <span>{formatPrice(order.total)}</span>
                </div>
              </div>

              {/* Need Help CTA */}
              <div className="p-6 bg-[#0A0A0A] text-[#FAFAF9] flex items-center justify-between gap-4">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider mb-1">Need assistance?</h4>
                  <p className="text-[11px] text-white/50">Our denim concierge is available 24/7.</p>
                </div>
                <a
                  href={`https://wa.me/919920255905?text=Hello%20Variety%20Vista%2C%20I%20have%20a%20question%20regarding%20my%20Order%20%23${order.orderNumber}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2.5 bg-[#25D366] text-white hover:bg-[#1EBE5D] transition-colors text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 shrink-0"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>WhatsApp</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
