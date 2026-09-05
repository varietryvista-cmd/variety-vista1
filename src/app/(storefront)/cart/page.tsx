import { Metadata } from 'next';
import CartView from './CartView';

export const metadata: Metadata = {
  title: 'Your Cart | Variety Vista',
  description: 'Review your cart items before checkout.',
};

export default function CartPage() {
  return (
    <div className="bg-[#FAFAF9] text-[#0A0A0A] min-h-screen py-16 md:py-24">
      <div className="page-container">
        <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#8B8680] block mb-3">
          Shopping Bag
        </span>
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold uppercase tracking-[-0.04em] text-[#0A0A0A] mb-12 leading-[0.9]">
          Your Cart
        </h1>
        <CartView />
      </div>
    </div>
  );
}
