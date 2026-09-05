'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion, useScroll, useTransform, useReducedMotion } from 'motion/react';
import { useRef, useState, useEffect } from 'react';
import { ArrowRight } from 'lucide-react';

export default function Hero() {
  const reducedMotion = useReducedMotion();
  const { scrollY } = useScroll();
  const heroRef = useRef<HTMLElement>(null);
  const [viewportHeight, setViewportHeight] = useState(0);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    setViewportHeight(window.innerHeight);
  }, []);

  const defaultHeight = 900;
  const effectiveHeight = isClient ? viewportHeight : defaultHeight;

  const y = useTransform(scrollY, [0, effectiveHeight], [0, 80]);
  const opacity = useTransform(scrollY, [0, effectiveHeight * 0.5], [1, 0]);
  const scale = useTransform(scrollY, [0, effectiveHeight], [1, 1.08]);

  return (
    <motion.section
      ref={heroRef}
      className="relative h-screen min-h-[700px] w-full flex items-center justify-center overflow-hidden"
      initial={reducedMotion ? { opacity: 1 } : { opacity: 0 }}
      animate={reducedMotion ? { opacity: 1 } : { opacity: 1 }}
      transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
      style={{
        y: reducedMotion ? 0 : y,
        opacity: reducedMotion ? 1 : opacity,
      }}
    >
      {/* Background Image with Parallax */}
      <div className="absolute inset-0 z-0">
        <motion.div
          className="absolute inset-0"
          style={{
            y: reducedMotion ? 0 : y,
            scale: reducedMotion ? 1 : scale,
          }}
        >
          <Image
            src="/assets/PHOTO-2026-08-02-12-56-34.jpg"
            alt="Cinematic Denim Collection"
            fill
            className="object-cover object-top"
            priority
            sizes="100vw"
          />
        </motion.div>
        {/* Subtle dark overlay — not too heavy */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/15" />
      </div>

      {/* Content — massive type, generous spacing */}
      <div className="relative z-10 text-center px-6 w-full max-w-5xl mx-auto flex flex-col items-center">
        <motion.span
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="text-[#B8913A] text-[11px] md:text-xs font-semibold uppercase tracking-[0.25em] mb-8 block"
        >
          The New Standard
        </motion.span>
        <motion.h1
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="text-4xl sm:text-6xl md:text-8xl lg:text-[120px] font-bold text-white uppercase tracking-[-0.04em] leading-[0.9] mb-8 md:mb-10"
        >
          <span className="block">Uncompromised</span>
          <span className="block">Structure</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.65, ease: [0.22, 1, 0.36, 1] }}
          className="text-white/70 text-base md:text-lg font-normal max-w-lg mx-auto mb-14 leading-relaxed"
        >
          Engineered for everyday resilience. Discover our latest collection of premium denim.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col sm:flex-row items-center gap-4"
        >
          {/* Primary CTA — gold fill on hover */}
          <Link
            href="/collections/men"
            className="group relative h-14 px-10 border border-white text-white flex items-center justify-center text-[11px] font-semibold uppercase tracking-[0.15em] overflow-hidden transition-colors duration-500"
          >
            <span className="relative z-10 flex items-center gap-3">
              Shop Menswear
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-500" />
            </span>
            <div className="absolute inset-0 bg-[#B8913A] translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]" />
          </Link>
          {/* Ghost CTA */}
          <Link
            href="/collections/women"
            className="group h-14 px-10 border border-white/30 text-white/70 hover:text-white hover:border-white flex items-center justify-center text-[11px] font-semibold uppercase tracking-[0.15em] transition-all duration-500"
          >
            <span className="flex items-center gap-3">
              Shop Womenswear
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-500" />
            </span>
          </Link>
        </motion.div>

        {/* Scroll Indicator — minimal */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5, delay: 1.5 }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 text-white/30"
          style={{ display: reducedMotion ? 'none' : 'flex' }}
        >
          <span className="text-[10px] font-semibold uppercase tracking-[0.2em]">Scroll</span>
          <div className="w-px h-8 bg-white/20 relative overflow-hidden">
            <motion.div
              className="w-full h-3 bg-white/50"
              animate={{ y: ['-100%', '200%'] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            />
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
}
