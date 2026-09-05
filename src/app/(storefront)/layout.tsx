import { CartProvider } from '@/hooks/useCart';
import { WishlistProvider } from '@/hooks/useWishlist';
import AnnouncementBar from '@/components/storefront/AnnouncementBar';
import Header from '@/components/storefront/Header';
import Footer from '@/components/storefront/Footer';
import CartDrawer from '@/components/storefront/CartDrawer';
import { ToastProvider } from '@/components/ui/Toast';

export default function StorefrontLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <CartProvider>
      <WishlistProvider>
        <ToastProvider>
          <div className="flex flex-col min-h-screen bg-[#FAFAF9] text-[#0A0A0A]">
            <AnnouncementBar />
            <Header />
            <main className="flex-1 bg-[#FAFAF9] text-[#0A0A0A]">{children}</main>
            <Footer />
            <CartDrawer />
          </div>
        </ToastProvider>
      </WishlistProvider>
    </CartProvider>
  );
}
