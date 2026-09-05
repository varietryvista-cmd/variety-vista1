'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/hooks/useCart';
import { formatPrice } from '@/lib/utils';
import Image from 'next/image';
import Button from '@/components/ui/CustomButton';
import { ShieldCheck, Truck, Tag, X } from 'lucide-react';
import Script from 'next/script';
import { createCheckoutOrder, type CheckoutFormData } from '@/app/actions/checkout';
import { validateCoupon } from '@/app/actions/coupons';

export default function CheckoutView() {
  const router = useRouter();
  const { items, subtotal, clearCart, appliedCoupon: cartCoupon } = useCart();
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  
  // Coupon State
  const [couponInput, setCouponInput] = React.useState(cartCoupon || '');
  const [appliedCoupon, setAppliedCoupon] = React.useState<{
    code: string;
    discountAmount: number;
  } | null>(null);
  const [couponError, setCouponError] = React.useState<string | null>(null);
  const [couponLoading, setCouponLoading] = React.useState(false);

  // Payment Method State
  const [paymentMethod, setPaymentMethod] = React.useState<'razorpay' | 'cod'>('razorpay');

  // Form State
  const [formData, setFormData] = React.useState({
    email: '',
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    phone: ''
  });

  // Automatically validate cart coupon if present
  React.useEffect(() => {
    if (cartCoupon && !appliedCoupon) {
      validateCoupon(cartCoupon, subtotal).then((res) => {
        if (res.valid && res.coupon) {
          setAppliedCoupon({
            code: res.coupon.code,
            discountAmount: res.coupon.discountAmount,
          });
        }
      });
    }
  }, [cartCoupon, subtotal, appliedCoupon]);

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    setCouponLoading(true);
    setCouponError(null);

    try {
      const res = await validateCoupon(couponInput, subtotal);
      if (res.valid && res.coupon) {
        setAppliedCoupon({
          code: res.coupon.code,
          discountAmount: res.coupon.discountAmount,
        });
        setCouponError(null);
      } else {
        setCouponError(res.message);
      }
    } catch {
      setCouponError('Unable to apply coupon.');
    } finally {
      setCouponLoading(false);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponInput('');
    setCouponError(null);
  };

  // Calculate totals
  const discount = appliedCoupon ? appliedCoupon.discountAmount : 0;
  const shipping = subtotal > 1999 ? 0 : 100;
  const total = Math.max(0, subtotal - discount + shipping);

  React.useEffect(() => {
    // If cart is empty, redirect to home
    if (items.length === 0) {
      router.push('/');
    }
  }, [items, router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const payload: CheckoutFormData = {
        ...formData,
        paymentMethod,
        couponCode: appliedCoupon?.code,
      };

      const result = await createCheckoutOrder(payload);

      if (result.error) {
        setError(result.error);
        setLoading(false);
        return;
      }

      if (result.success) {
        if (paymentMethod === 'cod') {
          clearCart();
          router.push(`/order-confirmation?id=${result.orderId}`);
        } else if (paymentMethod === 'razorpay' && result.razorpayOrderId) {
          // Initialize Razorpay
          const options = {
            key: result.keyId,
            amount: result.amount,
            currency: result.currency,
            name: "Variety Vista",
            description: "Order Payment",
            order_id: result.razorpayOrderId,
            handler: function () {
              // The webhook handles the actual payment verification on backend.
              // We just redirect the user.
              clearCart();
              router.push(`/order-confirmation?id=${result.orderId}`);
            },
            prefill: {
              name: `${formData.firstName} ${formData.lastName}`,
              email: formData.email,
              contact: formData.phone
            },
            theme: {
              color: "#111111"
            },
            modal: {
              ondismiss: function() {
                setLoading(false);
              }
            }
          };
          const RazorpayConstructor = (window as unknown as { Razorpay: new (opts: unknown) => { on: (evt: string, cb: (res: { error: { description: string } }) => void) => void, open: () => void } }).Razorpay;
          const razorpay = new RazorpayConstructor(options);
          razorpay.on('payment.failed', function (response: { error: { description: string } }){
            setError(response.error.description);
            setLoading(false);
          });
          razorpay.open();
        }
      }
    } catch (err) {
      console.error(err);
      setError('An unexpected error occurred. Please try again.');
      setLoading(false);
    }
  };

  if (items.length === 0) return null;

  return (
    <>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />
      <div className="min-h-screen bg-[#050914] text-white selection:bg-cta selection:text-black">
        <div className="max-w-6xl mx-auto px-4 md:px-8 py-12">
        <div className="flex flex-col lg:flex-row gap-10">
          
          {/* Left Column: Form */}
          <div className="w-full lg:w-3/5">
            <form onSubmit={handlePlaceOrder} className="space-y-8">
              
              {error && (
                <div className="bg-red-500/10 text-red-500 p-4 rounded-sm text-sm border border-red-500/20">
                  {error}
                </div>
              )}

              {/* Contact Info */}
              <div className="bg-black/40 backdrop-blur-md p-8 rounded-sm border border-white/10">
                <h2 className="text-sm font-bold uppercase tracking-widest mb-6 text-white">Contact Information</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Email</label>
                    <input 
                      type="email" 
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full h-14 bg-zinc-950 border border-white/10 rounded-sm px-4 text-sm font-medium text-white focus:ring-1 focus:ring-cta focus:border-cta focus:outline-none transition-all placeholder:text-gray-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Phone Number</label>
                    <input 
                      type="tel" 
                      name="phone"
                      required
                      minLength={10}
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full h-14 bg-zinc-950 border border-white/10 rounded-sm px-4 text-sm font-medium text-white focus:ring-1 focus:ring-cta focus:border-cta focus:outline-none transition-all placeholder:text-gray-500"
                    />
                  </div>
                </div>
              </div>

              {/* Shipping Address */}
              <div className="bg-black/40 backdrop-blur-md p-8 rounded-sm border border-white/10">
                <h2 className="text-sm font-bold uppercase tracking-widest mb-6 text-white">Shipping Address</h2>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">First Name</label>
                      <input 
                        type="text" 
                        name="firstName"
                        required
                        minLength={2}
                        value={formData.firstName}
                        onChange={handleInputChange}
                        className="w-full h-14 bg-zinc-950 border border-white/10 rounded-sm px-4 text-sm font-medium text-white focus:ring-1 focus:ring-cta focus:border-cta focus:outline-none transition-all placeholder:text-gray-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Last Name</label>
                      <input 
                        type="text" 
                        name="lastName"
                        required
                        minLength={2}
                        value={formData.lastName}
                        onChange={handleInputChange}
                        className="w-full h-14 bg-zinc-950 border border-white/10 rounded-sm px-4 text-sm font-medium text-white focus:ring-1 focus:ring-cta focus:border-cta focus:outline-none transition-all placeholder:text-gray-500"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Address</label>
                    <input 
                      type="text" 
                      name="address"
                      required
                      minLength={5}
                      value={formData.address}
                      onChange={handleInputChange}
                      className="w-full h-14 bg-zinc-950 border border-white/10 rounded-sm px-4 text-sm font-medium text-white focus:ring-1 focus:ring-cta focus:border-cta focus:outline-none transition-all placeholder:text-gray-500"
                    />
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div className="md:col-span-1">
                      <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Pincode</label>
                      <input 
                        type="text" 
                        name="pincode"
                        required
                        minLength={6}
                        value={formData.pincode}
                        onChange={handleInputChange}
                        className="w-full h-14 bg-zinc-950 border border-white/10 rounded-sm px-4 text-sm font-medium text-white focus:ring-1 focus:ring-cta focus:border-cta focus:outline-none transition-all placeholder:text-gray-500"
                      />
                      {formData.pincode.startsWith('400') && (
                        <p className="mt-2 text-xs font-bold text-[#25D366] flex items-center gap-1">
                          <Truck className="w-3 h-3" /> Same-Day Delivery!
                        </p>
                      )}
                    </div>
                    <div className="md:col-span-1">
                      <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">City</label>
                      <input 
                        type="text" 
                        name="city"
                        required
                        minLength={2}
                        value={formData.city}
                        onChange={handleInputChange}
                        className="w-full h-14 bg-zinc-950 border border-white/10 rounded-sm px-4 text-sm font-medium text-white focus:ring-1 focus:ring-cta focus:border-cta focus:outline-none transition-all placeholder:text-gray-500"
                      />
                    </div>
                    <div className="md:col-span-1">
                      <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">State</label>
                      <input 
                        type="text" 
                        name="state"
                        required
                        minLength={2}
                        value={formData.state}
                        onChange={handleInputChange}
                        className="w-full h-14 bg-zinc-950 border border-white/10 rounded-sm px-4 text-sm font-medium text-white focus:ring-1 focus:ring-cta focus:border-cta focus:outline-none transition-all placeholder:text-gray-500"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="bg-black/40 backdrop-blur-md p-8 rounded-sm border border-white/10">
                <h2 className="text-sm font-bold uppercase tracking-widest mb-6 text-white">Payment Method</h2>
                
                <div className="space-y-3 mb-8">
                  <label className={`flex items-center p-5 border-2 rounded-sm cursor-pointer transition-all duration-300 ease-[0.16,1,0.3,1] ${paymentMethod === 'razorpay' ? 'border-cta bg-white/5' : 'border-white/10 hover:border-white/30'}`}>
                    <input 
                      type="radio" 
                      name="paymentMethod" 
                      value="razorpay"
                      checked={paymentMethod === 'razorpay'}
                      onChange={() => setPaymentMethod('razorpay')}
                      className="w-4 h-4 text-cta border-white/10 focus:ring-cta"
                    />
                    <div className="ml-4 flex-1 flex items-center justify-between">
                      <span className="font-bold text-sm text-white">Online Payment (Razorpay)</span>
                      <ShieldCheck className="w-5 h-5 text-cta" />
                    </div>
                  </label>
                  
                  <label className={`flex items-center p-5 border-2 rounded-sm cursor-pointer transition-all duration-300 ease-[0.16,1,0.3,1] ${paymentMethod === 'cod' ? 'border-cta bg-white/5' : 'border-white/10 hover:border-white/30'}`}>
                    <input 
                      type="radio" 
                      name="paymentMethod" 
                      value="cod"
                      checked={paymentMethod === 'cod'}
                      onChange={() => setPaymentMethod('cod')}
                      className="w-4 h-4 text-cta border-white/10 focus:ring-cta"
                    />
                    <div className="ml-4 flex-1">
                      <span className="font-bold text-sm text-white">Cash on Delivery (COD)</span>
                    </div>
                  </label>
                </div>

                <Button type="submit" fullWidth className="h-14 rounded-sm text-sm tracking-widest uppercase bg-white text-[#0a0a0a] hover:bg-gray-200" loading={loading}>
                  {paymentMethod === 'cod' ? 'Place Order (COD)' : `Pay ${formatPrice(total)}`}
                </Button>
              </div>
              
            </form>
          </div>

          {/* Right Column: Order Summary */}
          <div className="w-full lg:w-2/5">
            <div className="bg-black/40 backdrop-blur-md text-white p-8 rounded-sm sticky top-24 border border-white/10">
              <h2 className="text-sm font-bold uppercase tracking-widest mb-8 text-white">Order Summary</h2>
              
              <div className="space-y-6 mb-8 max-h-[40vh] overflow-y-auto pr-2 scrollbar-hide">
                {items.map(item => (
                  <div key={item.variantId} className="flex gap-4">
                    <div className="relative w-20 h-24 bg-zinc-950 rounded-sm overflow-hidden shrink-0">
                      {item.image && <Image src={item.image} alt={item.title} fill className="object-cover" />}
                      <div className="absolute top-0 right-0 w-6 h-6 bg-white text-[#0a0a0a] text-xs font-bold rounded-bl-sm flex items-center justify-center">
                        {item.quantity}
                      </div>
                    </div>
                    <div className="flex-1 text-sm flex flex-col justify-center">
                      <p className="font-bold tracking-wide line-clamp-2 text-white">{item.title}</p>
                      <p className="text-gray-400 mt-1 text-xs uppercase tracking-widest">Size: {item.waistSize}</p>
                    </div>
                    <div className="font-bold tracking-tight flex items-center text-white">
                      {formatPrice(item.price * item.quantity)}
                    </div>
                  </div>
                ))}
              </div>

              {/* Promo Code Input */}
              <div className="border-t border-white/10 pt-6 mb-6">
                {appliedCoupon ? (
                  <div className="flex items-center justify-between bg-white/5 border border-[#B8913A]/30 px-4 py-3 rounded-sm text-xs">
                    <div className="flex items-center gap-2 text-[#B8913A]">
                      <Tag className="w-4 h-4" />
                      <span className="font-bold uppercase tracking-wider">{appliedCoupon.code}</span>
                      <span className="text-white/60">(-{formatPrice(appliedCoupon.discountAmount)})</span>
                    </div>
                    <button
                      type="button"
                      onClick={handleRemoveCoupon}
                      className="text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-red-400 transition-colors p-1"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={couponInput}
                        onChange={(e) => setCouponInput(e.target.value)}
                        placeholder="PROMO CODE (e.g. WELCOME15)"
                        className="flex-1 h-11 bg-zinc-950 border border-white/10 rounded-sm px-3 text-xs uppercase font-medium text-white focus:ring-1 focus:ring-white focus:outline-none placeholder:text-gray-500 placeholder:normal-case"
                      />
                      <button
                        type="button"
                        onClick={handleApplyCoupon}
                        disabled={couponLoading || !couponInput.trim()}
                        className="h-11 px-4 text-xs font-bold uppercase tracking-wider border border-white/20 hover:border-white text-white rounded-sm hover:bg-white/10 transition-colors disabled:opacity-40"
                      >
                        {couponLoading ? '...' : 'Apply'}
                      </button>
                    </div>
                    {couponError && (
                      <p className="text-xs text-red-400">{couponError}</p>
                    )}
                  </div>
                )}
              </div>

              <div className="border-t border-white/10 pt-6 space-y-4 text-sm font-medium">
                <div className="flex justify-between text-gray-400">
                  <span className="uppercase tracking-widest text-xs">Subtotal</span>
                  <span className="text-white font-bold">{formatPrice(subtotal)}</span>
                </div>
                {appliedCoupon && (
                  <div className="flex justify-between text-[#B8913A]">
                    <span className="uppercase tracking-widest text-xs font-bold">Discount ({appliedCoupon.code})</span>
                    <span className="font-bold">-{formatPrice(appliedCoupon.discountAmount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-gray-400">
                  <span className="uppercase tracking-widest text-xs">Shipping</span>
                  <span className="text-white font-bold">{shipping === 0 ? 'Free' : formatPrice(shipping)}</span>
                </div>
                <div className="border-t border-white/10 pt-6 flex justify-between font-bold text-xl items-end">
                  <span className="uppercase tracking-widest text-sm text-gray-400">Total</span>
                  <span className="text-white">{formatPrice(total)}</span>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
      </div>
    </>
  );
}
