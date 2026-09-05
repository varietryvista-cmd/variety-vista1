import { Metadata } from 'next';
import WishlistView from '@/components/storefront/WishlistView';

export const metadata: Metadata = {
  title: 'My Wishlist | Variety Vista',
  description: 'View and manage your saved premium denim cuts, live stock availability, and exclusive price drop alerts.',
};

export default function WishlistPage() {
  return (
    <div className="w-full">
      <WishlistView />
    </div>
  );
}
