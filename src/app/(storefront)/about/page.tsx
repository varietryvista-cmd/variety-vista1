import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'About Us | Variety Vista',
  description: 'Our story, mission, and commitment to quality denim.',
};

export default function AboutPage() {
  return (
    <div className="bg-[#FAFAF9] text-[#0A0A0A]">
      {/* Hero Section */}
      <section className="relative py-24 md:py-32 w-full flex items-center justify-center bg-[#F5F4F2] border-b border-[rgba(10,10,10,0.06)]">
        <div className="relative z-10 text-center px-4 max-w-3xl mx-auto">
          <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#8B8680] block mb-3">
            Our Heritage
          </span>
          <h1 className="text-4xl md:text-6xl font-bold uppercase tracking-[-0.04em] text-[#0A0A0A] mb-4 leading-[0.9]">
            Our Story
          </h1>
          <p className="text-base md:text-lg text-[#8B8680] leading-relaxed max-w-xl mx-auto">
            Crafting premium denim for every body, designed to last a lifetime.
          </p>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-24 md:py-32 page-container">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div className="space-y-6">
            <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#B8913A] block">
              Craft & Precision
            </span>
            <h2 className="text-3xl md:text-4xl font-bold uppercase tracking-tight text-[#0A0A0A]">
              Built on Quality and Fit
            </h2>
            <p className="text-[#8B8680] leading-relaxed text-sm md:text-base">
              Variety Vista was born from a simple frustration: finding the perfect pair of jeans shouldn&apos;t be so difficult. We set out to create a denim brand that prioritizes exceptional fit, premium materials, and timeless style over fast fashion trends.
            </p>
            <p className="text-[#8B8680] leading-relaxed text-sm md:text-base">
              We work directly with some of the world&apos;s best denim mills to source fabrics that not only look incredible but feel comfortable from the first wear and hold their shape for years.
            </p>
            <div className="pt-4">
              <Link href="/collections/all" className="inline-block bg-[#0A0A0A] text-[#FAFAF9] px-8 py-4 text-xs font-bold uppercase tracking-[0.15em] hover:bg-[#B8913A] transition-colors">
                Shop The Collection
              </Link>
            </div>
          </div>
          <div className="aspect-[4/5] bg-[#F5F4F2] border border-[rgba(10,10,10,0.06)] overflow-hidden relative flex items-center justify-center">
            <span className="text-xs uppercase tracking-widest text-[#8B8680] font-semibold">Variety Vista Denim</span>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-24 md:py-32 bg-[#F5F4F2] border-t border-[rgba(10,10,10,0.06)]">
        <div className="page-container">
          <div className="text-center mb-20">
            <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#8B8680] block mb-3">
              Principles
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold uppercase tracking-[-0.03em] text-[#0A0A0A] mb-4">
              Our Values
            </h2>
            <p className="text-[#8B8680] max-w-xl mx-auto text-sm md:text-base">
              We believe in transparency, sustainability, and making clothes that you&apos;ll reach for every single day.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-[#FAFAF9] p-10 border border-[rgba(10,10,10,0.06)]">
              <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#B8913A] block mb-3">01</span>
              <h3 className="text-lg font-bold uppercase tracking-tight text-[#0A0A0A] mb-3">Sustainable Practices</h3>
              <p className="text-[#8B8680] text-sm leading-relaxed">
                Our denim is washed using minimal water methods, and we prioritize durable materials designed to endure for years.
              </p>
            </div>
            <div className="bg-[#FAFAF9] p-10 border border-[rgba(10,10,10,0.06)]">
              <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#B8913A] block mb-3">02</span>
              <h3 className="text-lg font-bold uppercase tracking-tight text-[#0A0A0A] mb-3">Inclusive Sizing</h3>
              <p className="text-[#8B8680] text-sm leading-relaxed">
                Great style belongs to everyone. We design with multiple body types in mind and rigorously fit-test across a wide range of sizes.
              </p>
            </div>
            <div className="bg-[#FAFAF9] p-10 border border-[rgba(10,10,10,0.06)]">
              <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#B8913A] block mb-3">03</span>
              <h3 className="text-lg font-bold uppercase tracking-tight text-[#0A0A0A] mb-3">Ethical Manufacturing</h3>
              <p className="text-[#8B8680] text-sm leading-relaxed">
                We partner exclusively with certified factories that pay fair wages, ensure safe conditions, and respect workers.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
