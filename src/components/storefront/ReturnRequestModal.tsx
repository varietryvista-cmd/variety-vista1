'use client';

import * as React from 'react';
import { X, RotateCcw, ArrowRightLeft, CheckCircle2, MessageCircle } from 'lucide-react';
import { submitReturnRequest } from '@/app/actions/returns';
import type { Order, OrderItem } from '@/types';

interface ReturnRequestModalProps {
  order: Order;
  isOpen: boolean;
  onClose: () => void;
}

export default function ReturnRequestModal({ order, isOpen, onClose }: ReturnRequestModalProps) {
  const [type, setType] = React.useState<'exchange' | 'return'>('exchange');
  const [reason, setReason] = React.useState('Size too small / tight');
  const [exchangeSize, setExchangeSize] = React.useState('32');
  const [comments, setComments] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [submitted, setSubmitted] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const items = (order.items || []).map((item: OrderItem) => ({
      title: item.title,
      waistSize: item.waist_size || undefined,
      quantity: item.quantity,
    }));

    const result = await submitReturnRequest({
      orderId: order.id,
      orderNumber: order.order_number,
      type,
      reason,
      requestedExchangeSize: type === 'exchange' ? exchangeSize : undefined,
      comments,
      items,
    });

    if (result.error) {
      setError(result.error);
      setLoading(false);
      return;
    }

    setSubmitted(true);
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-[#FAFAF9] border border-[rgba(10,10,10,0.1)] text-[#0A0A0A] max-w-lg w-full p-6 sm:p-8 relative shadow-2xl animate-fade-in max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1 text-[#8B8680] hover:text-[#0A0A0A] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {submitted ? (
          <div className="text-center py-8 space-y-4">
            <div className="w-14 h-14 bg-[#B8913A]/10 text-[#B8913A] flex items-center justify-center mx-auto rounded-full">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold uppercase tracking-tight text-[#0A0A0A]">
              Request Received!
            </h3>
            <p className="text-xs text-[#8B8680] leading-relaxed max-w-md mx-auto">
              Your {type === 'exchange' ? 'exchange' : 'return'} request for Order #{order.order_number} has been logged. Our logistics team will arrange a free reverse pickup from your doorstep within 24–48 hours.
            </p>
            <div className="pt-4 flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href={`https://wa.me/919920255905?text=Hello%20Variety%20Vista%2C%20I%20have%20submitted%20a%20${type}%20request%20for%20Order%20%23${order.order_number}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 bg-[#25D366] text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-[#1EBE5D] transition-colors"
              >
                <MessageCircle className="w-4 h-4" /> Message Support
              </a>
              <button
                onClick={onClose}
                className="px-6 py-3 bg-[#0A0A0A] text-[#FAFAF9] font-bold text-xs uppercase tracking-wider hover:bg-[#B8913A] transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#B8913A] block mb-1">
                Variety Vista Concierge
              </span>
              <h2 className="text-2xl font-bold uppercase tracking-tight text-[#0A0A0A]">
                Request Return or Exchange
              </h2>
              <p className="text-xs text-[#8B8680] mt-1 font-semibold uppercase tracking-wider">
                Order #{order.order_number} · Free 7-Day Doorstep Pickup
              </p>
            </div>

            {error && (
              <div className="p-3 bg-red-50 text-red-700 text-xs font-semibold">
                {error}
              </div>
            )}

            {/* Type Selector */}
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setType('exchange')}
                className={`p-4 border text-left transition-colors ${
                  type === 'exchange'
                    ? 'border-[#0A0A0A] bg-[#F5F4F2]'
                    : 'border-[rgba(10,10,10,0.1)] hover:border-[rgba(10,10,10,0.3)]'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <ArrowRightLeft className="w-4 h-4 text-[#B8913A]" />
                  <span className="text-xs font-bold uppercase tracking-wider text-[#0A0A0A]">Exchange</span>
                </div>
                <p className="text-[11px] text-[#8B8680]">Swap for a different size</p>
              </button>

              <button
                type="button"
                onClick={() => setType('return')}
                className={`p-4 border text-left transition-colors ${
                  type === 'return'
                    ? 'border-[#0A0A0A] bg-[#F5F4F2]'
                    : 'border-[rgba(10,10,10,0.1)] hover:border-[rgba(10,10,10,0.3)]'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <RotateCcw className="w-4 h-4 text-[#B8913A]" />
                  <span className="text-xs font-bold uppercase tracking-wider text-[#0A0A0A]">Return</span>
                </div>
                <p className="text-[11px] text-[#8B8680]">Refund to original payment</p>
              </button>
            </div>

            {/* Reason Selector */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#0A0A0A] mb-2">
                Reason for {type} *
              </label>
              <select
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full h-11 px-3 bg-[#FAFAF9] border border-[rgba(10,10,10,0.15)] text-xs font-semibold text-[#0A0A0A] focus:outline-none focus:border-[#0A0A0A]"
              >
                <option value="Size too small / tight">Size too small / tight</option>
                <option value="Size too large / loose">Size too large / loose</option>
                <option value="Length / Inseam too long">Length / Inseam too long</option>
                <option value="Fabric / Wash not as expected">Fabric / Wash not as expected</option>
                <option value="Defective or damaged in transit">Defective or damaged in transit</option>
                <option value="Ordered by mistake">Ordered by mistake</option>
              </select>
            </div>

            {/* If Exchange: Pick New Size */}
            {type === 'exchange' && (
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#0A0A0A] mb-2">
                  Select New Waist Size *
                </label>
                <div className="flex flex-wrap gap-2">
                  {['28', '30', '32', '34', '36', '38', '40'].map((sz) => (
                    <button
                      key={sz}
                      type="button"
                      onClick={() => setExchangeSize(sz)}
                      className={`w-12 h-11 font-bold text-xs uppercase transition-colors ${
                        exchangeSize === sz
                          ? 'bg-[#0A0A0A] text-[#FAFAF9]'
                          : 'bg-[#F5F4F2] text-[#0A0A0A] hover:bg-[rgba(10,10,10,0.1)] border border-[rgba(10,10,10,0.06)]'
                      }`}
                    >
                      W{sz}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Comments */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#0A0A0A] mb-2">
                Additional Notes (Optional)
              </label>
              <textarea
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                rows={3}
                placeholder="Let us know any specific fit or delivery preferences..."
                className="w-full p-3 bg-[#FAFAF9] border border-[rgba(10,10,10,0.15)] text-xs text-[#0A0A0A] focus:outline-none focus:border-[#0A0A0A] placeholder:text-[#8B8680]"
              />
            </div>

            <div className="pt-2 flex justify-end gap-3 border-t border-[rgba(10,10,10,0.06)]">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-3 text-xs font-bold uppercase tracking-wider text-[#8B8680] hover:text-[#0A0A0A]"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-3 bg-[#0A0A0A] text-[#FAFAF9] hover:bg-[#B8913A] transition-colors text-xs font-bold uppercase tracking-wider disabled:opacity-50"
              >
                {loading ? 'Submitting...' : `Submit ${type === 'exchange' ? 'Exchange' : 'Return'}`}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
