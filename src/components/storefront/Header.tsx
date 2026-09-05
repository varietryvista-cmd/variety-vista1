'use client';

import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Link from 'next/link';
import Image from 'next/image';
import { Search, User, ShoppingBag, Menu, X, Heart } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { useWishlist } from '@/hooks/useWishlist';
import { SearchOverlay } from './SearchOverlay';
import { FitFinderModal } from './FitFinderModal';
import { cn } from '@/lib/utils';

const NAV_LINKS = [
  { label: 'NEW ARRIVALS', href: '/collections/new-arrivals' },
  { label: 'MEN', href: '/collections/men' },
  { label: 'WOMEN', href: '/collections/women' },
  { label: 'SALE', href: '/collections/sale' },
];

export default function Header() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isFitFinderOpen, setIsFitFinderOpen] = useState(false);
  const { itemCount, openCart } = useCart();
  const { itemCount: wishlistCount } = useWishlist();
  
  const isHomePage = pathname === '/';
  const isTransparent = isHomePage && !isScrolled;
  const textColorClass = isTransparent ? 'text-white' : 'text-[#0A0A0A]';

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  return (
    <motion.header
      className={`sticky top-0 z-[50] transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${textColorClass}`}
      style={{
        height: isScrolled ? 'var(--header-height-scrolled)' : 'var(--header-height)',
        borderBottom: isScrolled ? '1px solid rgba(10,10,10,0.06)' : (isTransparent ? '1px solid rgba(255,255,255,0.08)' : '1px solid transparent'),
        backdropFilter: isScrolled ? 'saturate(180%) blur(20px)' : 'none',
        backgroundColor: isScrolled ? 'rgba(250,250,249,0.95)' : (isTransparent ? 'transparent' : '#FAFAF9'),
      }}
      initial={false}
      animate={{ y: 0 }}
    >
      <div className="page-container h-full flex items-center justify-between">
        {/* Left — Mobile menu toggle + Nav */}
        <div className="flex items-center gap-10">
          {/* Mobile menu toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="lg:hidden p-1 -ml-1"
            aria-label="Open menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Desktop nav — left-to-right underline draw on hover */}
          <nav className="hidden lg:flex items-center gap-10" aria-label="Main navigation">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "relative text-[11px] font-semibold tracking-[0.15em] uppercase transition-colors duration-300 group py-1",
                  isTransparent ? 'text-white/80 hover:text-white' : 'text-[#8B8680] hover:text-[#0A0A0A]'
                )}
              >
                {link.label}
                {/* Underline draws left→right */}
                <span
                  className={cn(
                    "absolute bottom-0 left-0 h-px w-0 group-hover:w-full transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
                    isTransparent ? 'bg-white' : 'bg-[#B8913A]'
                  )}
                />
              </Link>
            ))}
          </nav>
        </div>

        {/* Center — Logo */}
        <Link href="/" className="absolute left-1/2 -translate-x-1/2 group outline-none" aria-label="Variety Vista Home">
          <div className="relative w-[140px] h-[46px] md:w-[170px] md:h-[56px] flex-shrink-0">
            <Image
              src="/assets/logo.png"
              alt="Variety Vista"
              fill
              sizes="(max-width: 768px) 140px, 170px"
              className="object-contain"
              priority
            />
          </div>
        </Link>

        {/* Right — Actions */}
        <div className="flex items-center gap-1 sm:gap-4">
          {/* Desktop search */}
          <div className="hidden lg:flex items-center mr-2">
            <button
              onClick={() => setIsSearchOpen(true)}
              className={cn(
                "flex items-center gap-2.5 px-4 py-2 border transition-all duration-300 w-44 group",
                isTransparent 
                  ? "border-white/15 hover:border-white/30 text-white/50 hover:text-white" 
                  : "border-[rgba(10,10,10,0.06)] hover:border-[rgba(10,10,10,0.12)] text-[#8B8680] hover:text-[#0A0A0A]"
              )}
            >
              <Search className="w-3.5 h-3.5" />
              <span className="text-[10px] font-semibold tracking-[0.15em] uppercase">Search</span>
            </button>
          </div>

          <button
            onClick={() => setIsSearchOpen(true)}
            className="lg:hidden p-2 transition-colors duration-300"
            aria-label="Search"
          >
            <Search className="w-5 h-5" />
          </button>

          <Link
            href="/account/wishlist"
            className="relative hidden sm:flex p-2 transition-colors duration-300 hover:text-[#B8913A]"
            aria-label={`Wishlist${wishlistCount > 0 ? `, ${wishlistCount} items` : ''}`}
          >
            <Heart className="w-5 h-5" />
            <AnimatePresence>
              {wishlistCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-[#B8913A] text-white text-[9px] font-bold flex items-center justify-center shadow-sm"
                >
                  {wishlistCount > 99 ? '99+' : wishlistCount}
                </motion.span>
              )}
            </AnimatePresence>
          </Link>

          <Link
            href="/account"
            className="p-2 transition-colors duration-300"
            aria-label="Account"
          >
            <User className="w-5 h-5" />
          </Link>

          <button
            onClick={openCart}
            className="relative p-2 transition-colors duration-300"
            aria-label={`Cart${itemCount > 0 ? `, ${itemCount} items` : ''}`}
          >
            <ShoppingBag className="w-5 h-5" />
            <AnimatePresence>
              {itemCount > 0 && (
                <motion.span
                  key={itemCount}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  className="absolute -top-0.5 -right-0.5 flex items-center justify-center bg-[#B8913A] text-white text-[9px] font-bold rounded-full min-w-[18px] h-[18px]"
                >
                  {itemCount}
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-black/40 z-50 lg:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
            />

            {/* Menu Panel */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="fixed inset-y-0 left-0 w-[85%] max-w-sm bg-[#FAFAF9] z-50 flex flex-col lg:hidden"
            >
              {/* Menu Header */}
              <div className="flex items-center justify-between px-6 h-16 border-b border-[rgba(10,10,10,0.06)] text-[#0A0A0A]">
                <Link
                  href="/"
                  className="relative w-[120px] h-[38px] block"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Image
                    src="/assets/logo.png"
                    alt="Variety Vista"
                    fill
                    className="object-contain"
                  />
                </Link>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-1"
                  aria-label="Close menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Menu Links */}
              <nav className="flex-1 px-6 py-10" aria-label="Mobile navigation">
                <div className="space-y-1">
                  {NAV_LINKS.map((link, index) => (
                    <motion.div
                      key={link.href}
                      initial={{ opacity: 0, x: -15 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 + index * 0.05, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                    >
                      <Link
                        href={link.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="block py-3.5 text-sm font-semibold tracking-[0.1em] uppercase text-[#0A0A0A] hover:text-[#B8913A] transition-colors duration-300"
                      >
                        {link.label}
                      </Link>
                    </motion.div>
                  ))}
                </div>

                {/* Divider */}
                <div className="my-8 border-t border-[rgba(10,10,10,0.06)]" />

                {/* Secondary links */}
                <div className="space-y-1">
                  {[
                    { label: 'Find Your Fit', href: '#', icon: Search, onClick: () => setIsFitFinderOpen(true) },
                    { label: 'My Account', href: '/account', icon: User },
                    { label: 'Wishlist', href: '/account/wishlist', icon: Heart },
                    { label: 'Search', href: '#', icon: Search, onClick: () => setIsSearchOpen(true) },
                  ].map((link, index) => (
                    <motion.div
                      key={link.label}
                      initial={{ opacity: 0, x: -15 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 + index * 0.05, duration: 0.4 }}
                    >
                      <Link
                        href={link.href}
                        onClick={(e) => {
                          if (link.onClick) {
                            e.preventDefault();
                            link.onClick();
                          }
                          setIsMobileMenuOpen(false);
                        }}
                        className="flex items-center gap-3.5 py-3 text-sm text-[#8B8680] hover:text-[#0A0A0A] transition-colors duration-300"
                      >
                        <link.icon className="w-4 h-4" />
                        {link.label}
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <SearchOverlay open={isSearchOpen} onOpenChange={setIsSearchOpen} />
      <FitFinderModal open={isFitFinderOpen} onOpenChange={setIsFitFinderOpen} />

      {/* Mobile Bottom Navigation */}
      <motion.div
        className="md:hidden fixed bottom-0 left-0 right-0 bg-[#FAFAF9] border-t border-[rgba(10,10,10,0.06)] z-40 pb-safe"
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="flex items-center justify-around h-14">
          <Link href="/" className="flex flex-col items-center justify-center w-full h-full text-[#8B8680] hover:text-[#0A0A0A] transition-colors duration-300">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 mb-1"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
            <span className="text-[10px] font-medium">Home</span>
          </Link>
          <button 
            onClick={() => setIsSearchOpen(true)}
            className="flex flex-col items-center justify-center w-full h-full text-[#8B8680] hover:text-[#0A0A0A] transition-colors duration-300"
          >
            <Search className="w-5 h-5 mb-1" />
            <span className="text-[10px] font-medium">Search</span>
          </button>
          <button 
            onClick={openCart}
            className="flex flex-col items-center justify-center w-full h-full text-[#8B8680] hover:text-[#0A0A0A] transition-colors duration-300 relative"
          >
            <div className="relative">
              <ShoppingBag className="w-5 h-5 mb-1" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1.5 flex items-center justify-center bg-[#B8913A] text-white text-[9px] font-bold rounded-full min-w-[16px] h-[16px]">
                  {itemCount}
                </span>
              )}
            </div>
            <span className="text-[10px] font-medium">Cart</span>
          </button>
          <Link href="/account" className="flex flex-col items-center justify-center w-full h-full text-[#8B8680] hover:text-[#0A0A0A] transition-colors duration-300">
            <User className="w-5 h-5 mb-1" />
            <span className="text-[10px] font-medium">Profile</span>
          </Link>
        </div>
      </motion.div>
    </motion.header>
  );
}