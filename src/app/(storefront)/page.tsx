import Link from 'next/link';
import Image from 'next/image';
import ProductCard from '@/components/storefront/ProductCard';
import TrustStrip from '@/components/storefront/TrustStrip';
import NewsletterSection from '@/components/storefront/NewsletterSection';
import Hero from '@/components/storefront/Hero';
import { ArrowRight } from 'lucide-react';
import type { Product, ProductImage, ProductVariant } from '@/types';
import { ScrollReveal, StaggerContainer } from '@/components/ui/ScrollAnimations';
import CountUp from '@/components/ui/CountUp';

type FullProduct = Product & { images: ProductImage[]; variants: ProductVariant[] };

async function fetchProducts(): Promise<FullProduct[]> {
  const { createServerClient } = await import('@/lib/supabase');
  const supabase = await createServerClient();
  const { data, error } = await supabase
    .from('products')
    .select('*, images:product_images(*), variants:product_variants(*)')
    .order('created_at', { ascending: false });
  if (error) {
    console.error('Error fetching products:', error);
    return [];
  }
  return (data as unknown) as FullProduct[];
}

export default async function HomePage() {
  const products = await fetchProducts();

  return (
    <div className="flex flex-col bg-[#FAFAF9] min-h-screen text-[#0A0A0A]">
      <StaggerContainer baseDelay={120} className="w-full">
        {/* 1. Hero Section */}
        <Hero />

        {/* 2. Trending Now */}
        <TrendingNow products={products} />

        {/* 3. Shop by Fit */}
        <CategoryShowcase />

        {/* 4. All Products */}
        <ScrollReveal className="py-32 md:py-40">
          <AllProducts products={products} />
        </ScrollReveal>

        {/* 5. Social Proof */}
        <SocialProofSection />

        {/* 6. Trust & Newsletter */}
        <TrustStrip />
        <NewsletterSection />
      </StaggerContainer>
    </div>
  );
}

/* ═══════════════════════════════════════════
   Trending Now — Restrained product showcase
   ═══════════════════════════════════════════ */
function TrendingNow({ products }: { products: FullProduct[] }) {
  const displayProducts = products.length > 0 ? products : getMockProducts();

  return (
    <section className="py-32 md:py-40">
      <div className="page-container">
        <ScrollReveal className="mb-16">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div>
              <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#8B8680] block mb-4">
                Curated Selection
              </span>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold uppercase tracking-[-0.04em] text-[#0A0A0A] leading-[0.9]">
                Trending Now
              </h2>
            </div>
            <Link
              href="/collections/trending"
              className="group inline-flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.15em] text-[#8B8680] hover:text-[#0A0A0A] transition-colors duration-500 shrink-0"
            >
              Shop All
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]" />
            </Link>
          </div>
          {/* Hairline */}
          <div className="mt-8 border-t border-[rgba(10,10,10,0.06)]" />
        </ScrollReveal>

        <StaggerContainer baseDelay={80} className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {displayProducts.slice(0, 4).map((product) => (
            <div key={product.id} className="w-full">
              <ProductCard product={product} index={0} />
            </div>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════
   Shop by Fit — Grayscale → color on hover
   ═══════════════════════════════════════════ */
function CategoryShowcase() {
  const categories = [
    {
      title: 'SKINNY',
      subtitle: 'Second-skin fit',
      image: '/assets/PHOTO-2026-08-02-12-56-06.jpg',
      href: '/collections/skinny',
    },
    {
      title: 'SLIM',
      subtitle: 'Tailored silhouette',
      image: '/assets/PHOTO-2026-08-02-12-56-13.jpg',
      href: '/collections/slim',
    },
    {
      title: 'STRAIGHT',
      subtitle: 'Classic straight leg',
      image: '/assets/PHOTO-2026-08-02-12-56-21.jpg',
      href: '/collections/straight',
    },
    {
      title: 'RELAXED',
      subtitle: 'Easy everyday fit',
      image: '/assets/PHOTO-2026-08-02-12-56-26.jpg',
      href: '/collections/relaxed',
    },
  ];

  return (
    <section className="py-32 md:py-40 bg-[#F5F4F2]">
      <div className="page-container">
        <ScrollReveal className="text-center max-w-2xl mx-auto mb-20">
          <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#8B8680] block mb-4">
            Find Your Silhouette
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold uppercase tracking-[-0.04em] text-[#0A0A0A] leading-[0.9]">
            Shop by Fit
          </h2>
        </ScrollReveal>

        <StaggerContainer baseDelay={100} className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {categories.map((category) => (
            <Link
              key={category.title}
              href={category.href}
              className="group relative overflow-hidden aspect-[3/4]"
            >
              <div className="absolute inset-0">
                <Image
                  src={category.image}
                  alt={category.title}
                  fill
                  className="object-cover transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] grayscale group-hover:grayscale-0 group-hover:scale-105"
                  sizes="(max-width: 768px) 50vw, 25vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent opacity-80 group-hover:opacity-70 transition-opacity duration-500" />
              </div>
              <div className="relative z-10 absolute inset-0 flex flex-col items-center justify-end p-8 text-center">
                <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/60 mb-2">
                  {category.subtitle}
                </span>
                <h3 className="text-xl md:text-2xl font-bold text-white uppercase tracking-[-0.02em] mb-4">
                  {category.title}
                </h3>
                <span className="inline-flex items-center gap-2 text-white text-[10px] font-semibold tracking-[0.15em] uppercase opacity-0 group-hover:opacity-100 translate-y-3 group-hover:translate-y-0 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]">
                  Explore <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </Link>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════
   Social Proof — Count-up stats + reviews
   ═══════════════════════════════════════════ */
function SocialProofSection() {
  const stats = [
    { value: 50, suffix: 'K+', label: 'Happy Customers' },
    { value: 4.8, suffix: '★', label: 'Average Rating', isDecimal: true },
    { value: 15, suffix: 'K+', label: 'Reviews' },
    { value: 95, suffix: '%', label: 'Repeat Rate' },
  ];

  const reviews = [
    {
      name: 'Rahul M.',
      location: 'Mumbai',
      rating: 5,
      text: 'Best denim I\'ve ever owned. The fit is impeccable and the quality shows in every stitch.',
      product: 'Slim Fit Raw Denim'
    },
    {
      name: 'Priya S.',
      location: 'Bangalore',
      rating: 5,
      text: 'Finally found jeans that fit my curves perfectly. The stretch is just right without losing shape.',
      product: 'High Rise Skinny'
    },
    {
      name: 'Arjun K.',
      location: 'Delhi',
      rating: 5,
      text: 'Been wearing Variety Vista for 3 years. The raw denim ages beautifully — each pair tells a story.',
      product: 'Straight Fit Selvedge'
    },
  ];

  return (
    <section className="py-32 md:py-40 bg-[#F5F4F2]">
      <div className="page-container">
        {/* Stats with count-up */}
        <ScrollReveal className="mb-24">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 md:gap-16">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-5xl md:text-6xl font-bold text-[#0A0A0A] tracking-[-0.04em] mb-3">
                  {stat.isDecimal ? (
                    <span>{stat.value}{stat.suffix}</span>
                  ) : (
                    <CountUp end={stat.value} suffix={stat.suffix} />
                  )}
                </div>
                <div className="text-[11px] text-[#8B8680] uppercase tracking-[0.2em] font-semibold">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </ScrollReveal>

        {/* Hairline */}
        <div className="border-t border-[rgba(10,10,10,0.06)] mb-24" />

        {/* Reviews */}
        <ScrollReveal className="mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold uppercase tracking-[-0.04em] text-[#0A0A0A] text-center leading-[0.9]">
            What Our Customers Say
          </h2>
        </ScrollReveal>

        <StaggerContainer baseDelay={100} className="grid grid-cols-1 md:grid-cols-3 gap-px bg-[rgba(10,10,10,0.06)]">
          {reviews.map((review) => (
            <div key={review.name} className="bg-[#F5F4F2] p-10 md:p-12">
              <div className="flex items-center gap-0.5 mb-6">
                {Array.from({ length: review.rating }).map((_, i) => (
                  <span key={i} className="text-[#B8913A] text-sm">★</span>
                ))}
              </div>
              <p className="text-[#8B8680] mb-8 leading-relaxed text-base">&ldquo;{review.text}&rdquo;</p>
              <div>
                <p className="font-semibold text-[#0A0A0A] text-sm tracking-tight">{review.name}</p>
                <p className="text-[#8B8680] text-[11px] uppercase tracking-[0.15em] mt-1">{review.location}</p>
                <p className="text-[#B8913A] text-[11px] font-semibold uppercase tracking-[0.15em] mt-2">{review.product}</p>
              </div>
            </div>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════
   All Products — Full collection grid
   ═══════════════════════════════════════════ */
function AllProducts({ products }: { products: FullProduct[] }) {
  const displayProducts = products.length > 0 ? products : getMockProducts();

  return (
    <section className="py-0">
      <div className="page-container">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-16 gap-6">
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#8B8680] block mb-4">
              Browse Collection
            </span>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold uppercase tracking-[-0.04em] text-[#0A0A0A] leading-[0.9]">
              All Products
            </h2>
          </div>
          <Link
            href="/collections/all"
            className="group inline-flex items-center justify-center gap-3 px-8 py-4 border border-[#0A0A0A] text-[11px] font-semibold uppercase tracking-[0.15em] text-[#0A0A0A] hover:bg-[#0A0A0A] hover:text-[#FAFAF9] transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] shrink-0"
          >
            <span className="flex items-center gap-2">
              View All
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-500" />
            </span>
          </Link>
        </div>

        {/* Hairline */}
        <div className="border-t border-[rgba(10,10,10,0.06)] mb-12" />

        <StaggerContainer baseDelay={60} className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {displayProducts.slice(0, 8).map((product) => (
            <div key={product.id} className="w-full">
              <ProductCard product={product} index={0} />
            </div>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════
   Mock Products Fallback
   ═══════════════════════════════════════════ */
function getMockProducts(): FullProduct[] {
  const baseMock = {
    description: 'Premium quality denim',
    price: 2399,
    sale_price: null,
    status: 'active',
    category: 'jeans',
    gender: 'women',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    variants: [{ stock_quantity: 10 }]
  };

  return [
    { ...baseMock, id: 'mock-1', title: 'Bootcut Jeans', slug: 'bootcut-1', fit_type: 'bootcut', images: [{ id: 'img-1', product_id: 'mock-1', image_url: '/assets/PHOTO-2026-08-02-12-56-06.jpg', alt_text: 'Bootcut Jeans', sort_order: 1, image_type: 'on_model', created_at: '', updated_at: '' }] },
    { ...baseMock, id: 'mock-2', title: 'Baggy Jeans', slug: 'baggy-1', fit_type: 'baggy', gender: 'men', images: [{ id: 'img-2', product_id: 'mock-2', image_url: '/assets/PHOTO-2026-08-02-12-56-13.jpg', alt_text: 'Baggy Jeans', sort_order: 1, image_type: 'on_model', created_at: '', updated_at: '' }] },
    { ...baseMock, id: 'mock-3', title: 'Bootcut Jeans', slug: 'bootcut-2', fit_type: 'bootcut', images: [{ id: 'img-3', product_id: 'mock-3', image_url: '/assets/PHOTO-2026-08-02-12-56-21.jpg', alt_text: 'Bootcut Jeans', sort_order: 1, image_type: 'on_model', created_at: '', updated_at: '' }] },
    { ...baseMock, id: 'mock-4', title: 'Bootcut Jeans', slug: 'bootcut-3', fit_type: 'bootcut', images: [{ id: 'img-4', product_id: 'mock-4', image_url: '/assets/PHOTO-2026-08-02-12-56-26.jpg', alt_text: 'Bootcut Jeans', sort_order: 1, image_type: 'on_model', created_at: '', updated_at: '' }] },
    { ...baseMock, id: 'mock-5', title: 'Bootcut Jeans', slug: 'bootcut-4', fit_type: 'bootcut', images: [{ id: 'img-5', product_id: 'mock-5', image_url: '/assets/PHOTO-2026-08-02-12-56-30.jpg', alt_text: 'Bootcut Jeans', sort_order: 1, image_type: 'on_model', created_at: '', updated_at: '' }] },
    { ...baseMock, id: 'mock-6', title: 'Bootcut Jeans', slug: 'bootcut-5', fit_type: 'bootcut', images: [{ id: 'img-6', product_id: 'mock-6', image_url: '/assets/PHOTO-2026-08-02-12-56-31.jpg', alt_text: 'Bootcut Jeans', sort_order: 1, image_type: 'on_model', created_at: '', updated_at: '' }] },
    { ...baseMock, id: 'mock-7', title: 'Baggy Jeans', slug: 'baggy-2', fit_type: 'baggy', gender: 'men', images: [{ id: 'img-7', product_id: 'mock-7', image_url: '/assets/PHOTO-2026-08-02-12-56-32.jpg', alt_text: 'Baggy Jeans', sort_order: 1, image_type: 'on_model', created_at: '', updated_at: '' }] },
    { ...baseMock, id: 'mock-8', title: 'Baggy Jeans', slug: 'baggy-3', fit_type: 'baggy', gender: 'men', images: [{ id: 'img-8', product_id: 'mock-8', image_url: '/assets/PHOTO-2026-08-02-12-56-34.jpg', alt_text: 'Baggy Jeans', sort_order: 1, image_type: 'on_model', created_at: '', updated_at: '' }] },
  ] as unknown as FullProduct[];
}