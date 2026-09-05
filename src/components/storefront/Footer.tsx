'use client';

import Link from 'next/link';
import Image from 'next/image';
import { MapPin, Phone, Mail } from 'lucide-react';

// Lucide-react doesn't include brand icons, so we use inline SVGs
const InstagramIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
);

const FacebookIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
);

const TwitterIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
);

const YoutubeIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
);

const FOOTER_NAV = {
  shop: {
    title: 'Shop',
    links: [
      { label: "Women's Jeans", href: '/collections/women' },
      { label: "Men's Jeans", href: '/collections/men' },
      { label: 'New Arrivals', href: '/collections/new-arrivals' },
      { label: 'Best Sellers', href: '/collections/best-sellers' },
      { label: 'Sale', href: '/collections/sale' },
    ],
  },
  fits: {
    title: 'Fits',
    links: [
      { label: 'Bootcut', href: '/collections/bootcut' },
      { label: 'Baggy', href: '/collections/baggy' },
      { label: 'Straight', href: '/collections/straight' },
      { label: 'Skinny', href: '/collections/skinny' },
      { label: 'Wide Leg', href: '/collections/wide-leg' },
      { label: 'Mom Fit', href: '/collections/mom' },
      { label: 'Flare', href: '/collections/flare' },
    ],
  },
  help: {
    title: 'Help',
    links: [
      { label: 'Contact Us', href: '/contact' },
      { label: 'FAQ', href: '/faq' },
      { label: 'Size Guide', href: '/size-guide' },
      { label: 'Track Your Order', href: '/track-order' },
      { label: 'Shipping Policy', href: '/policies' },
      { label: 'Returns & Exchange', href: '/policies' },
    ],
  },
  company: {
    title: 'Company',
    links: [
      { label: 'About Us', href: '/about' },
      { label: 'Privacy Policy', href: '/policies' },
      { label: 'Terms of Service', href: '/policies' },
    ],
  },
};

const SOCIAL_LINKS = [
  { icon: InstagramIcon, href: '#', label: 'Instagram' },
  { icon: FacebookIcon, href: '#', label: 'Facebook' },
  { icon: TwitterIcon, href: '#', label: 'Twitter' },
  { icon: YoutubeIcon, href: '#', label: 'YouTube' },
];

const PAYMENT_METHODS = ['Visa', 'Mastercard', 'UPI', 'RuPay', 'COD'];

export default function Footer() {
  return (
    <footer className="bg-[#0A0A0A] text-white">
      {/* Main footer content */}
      <div className="page-container py-20 md:py-28">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand column */}
          <div className="col-span-2 md:col-span-3 lg:col-span-1 mb-4 lg:mb-0">
            <Link href="/" className="inline-flex items-center mb-5 group">
              <div className="relative w-[150px] h-[50px] flex-shrink-0">
                <Image
                  src="/assets/logo.png"
                  alt="Variety Vista"
                  fill
                  sizes="150px"
                  className="object-contain group-hover:scale-105 transition-transform duration-300"
                />
              </div>
            </Link>
            <p className="text-sm text-white/60 leading-relaxed mb-6 max-w-xs">
              Jeans that define you. Premium denim for every fit, every style, every you.
              Delivered across India.
            </p>

            {/* Social icons */}
            <div className="flex items-center gap-3">
              {SOCIAL_LINKS.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 flex items-center justify-center bg-white/5 hover:bg-[#B8913A]/20 hover:text-[#B8913A] transition-all duration-300"
                  aria-label={social.label}
                >
                  <social.icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Nav columns */}
          {Object.values(FOOTER_NAV).map((section) => (
            <div key={section.title}>
              <h3 className="text-[10px] font-semibold tracking-[0.2em] uppercase text-white/30 mb-5">
                {section.title}
              </h3>
              <ul className="space-y-2.5">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-white/60 hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Contact info strip */}
        <div className="mt-16 pt-10 border-t border-white/6 flex flex-wrap items-center gap-8 text-sm text-white/35">
          <a
            href="mailto:varietryvista@gmail.com"
            className="flex items-center gap-2 hover:text-white/80 transition-colors"
          >
            <Mail className="w-4 h-4" />
            varietryvista@gmail.com
          </a>
          <a
            href="tel:+919920255905"
            className="flex items-center gap-2 hover:text-white/80 transition-colors"
          >
            <Phone className="w-4 h-4" />
            +91 99202 55905
          </a>
          <span className="flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            Mumbai Maharashtra, India
          </span>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="page-container py-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-white/40">
            © {new Date().getFullYear()} Variety Vista. All rights reserved.
          </p>

          {/* Payment methods */}
          <div className="flex items-center gap-3">
            <span className="text-[10px] text-white/30 uppercase tracking-wider mr-1">
              We accept
            </span>
            {PAYMENT_METHODS.map((method) => (
              <span
                key={method}
                className="text-[10px] font-medium text-white/50 bg-white/10 px-2 py-0.5 rounded"
              >
                {method}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
