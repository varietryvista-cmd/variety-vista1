import { Metadata } from 'next';
import CheckoutView from './CheckoutView';

export const metadata: Metadata = {
  title: 'Checkout | Variety Vista',
  description: 'Complete your purchase securely.',
};

export default function CheckoutPage() {
  return (
    <div className="bg-gray-50 min-h-screen pt-8 pb-20">
      <CheckoutView />
    </div>
  );
}
