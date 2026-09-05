'use client';

import * as React from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

const FITS = [
  {
    id: 'straight',
    name: 'The Straight',
    description: 'Our modern take on the classic straight leg. Clean lines from hip to hem, providing a timeless silhouette that works with any footwear.',
    image: '/assets/PHOTO-2026-08-02-12-56-02.jpg',
    measurements: { rise: '11.5"', legOpening: '15.5"', stretch: 'Rigid' },
    link: '/collections/straight-fit'
  },
  {
    id: 'baggy',
    name: 'The Baggy',
    description: 'Generous room through the seat and thigh with a slight taper at the ankle. Maximum comfort meets 90s nostalgia.',
    image: '/assets/PHOTO-2026-08-02-12-56-14.jpg',
    measurements: { rise: '12"', legOpening: '17"', stretch: 'Slight' },
    link: '/collections/baggy-fit'
  },
  {
    id: 'bootcut',
    name: 'The Bootcut',
    description: 'Fitted through the thigh and kicks out slightly from the knee down. Designed to stack perfectly over boots or heavy sneakers.',
    image: '/assets/PHOTO-2026-08-02-12-56-21.jpg',
    measurements: { rise: '11"', legOpening: '18.5"', stretch: 'Rigid' },
    link: '/collections/bootcut-fit'
  }
];

export default function FitGuide() {
  const [activeFitIndex, setActiveFitIndex] = React.useState(0);
  const activeFit = FITS[activeFitIndex];

  return (
    <div className="min-h-screen bg-primary-text text-white relative flex flex-col justify-between overflow-hidden">
      {/* Background Images */}
      <div className="absolute inset-0 z-0 opacity-40">
        <AnimatePresence initial={false} mode="wait">
          <motion.div
            key={activeFitIndex}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-0"
          >
            <Image
              src={activeFit.image}
              alt={activeFit.name}
              fill
              className="object-cover"
              priority
              sizes="100vw"
            />
          </motion.div>
        </AnimatePresence>
        <div className="absolute inset-0 bg-gradient-to-t from-primary-text via-primary-text/80 to-transparent" />
      </div>

      {/* Header */}
      <header className="relative z-10 w-full p-6 md:p-12 flex justify-between items-center">
        <Link href="/" className="z-10 hover:opacity-80 transition-opacity">
          <div className="relative w-[150px] h-[50px]">
            <Image
              src="/assets/logo.png"
              alt="Variety Vista"
              fill
              className="object-contain"
              priority
            />
          </div>
        </Link>
        <div className="text-xs font-bold uppercase tracking-[0.2em] text-white/50">
          The Fit Guide
        </div>
      </header>

      {/* Content */}
      <main className="relative z-10 page-container w-full h-full flex flex-col justify-end pb-12 md:pb-24 mt-auto">
        <div className="max-w-3xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeFitIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            >
              <h1 className="text-5xl md:text-7xl lg:text-[7rem] font-bold tracking-tight uppercase leading-[0.9] mb-6">
                {activeFit.name}
              </h1>
              
              <p className="text-lg md:text-xl text-white/80 max-w-xl font-light mb-8">
                {activeFit.description}
              </p>

              <div className="grid grid-cols-3 gap-4 border-y border-white/10 py-6 mb-10 max-w-lg">
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-widest text-white/40 mb-1">Rise</div>
                  <div className="font-semibold text-lg">{activeFit.measurements.rise}</div>
                </div>
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-widest text-white/40 mb-1">Leg Opening</div>
                  <div className="font-semibold text-lg">{activeFit.measurements.legOpening}</div>
                </div>
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-widest text-white/40 mb-1">Stretch</div>
                  <div className="font-semibold text-lg">{activeFit.measurements.stretch}</div>
                </div>
              </div>

              <Link 
                href={activeFit.link}
                className="inline-flex h-14 items-center gap-3 bg-white text-primary-text px-8 rounded-full font-bold uppercase tracking-widest text-sm hover:bg-white/90 transition-colors"
              >
                Shop {activeFit.name}
                <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* Navigation Controls */}
      <div className="relative z-10 w-full p-6 md:p-12 flex items-center justify-between border-t border-white/5">
        <div className="flex gap-2">
          {FITS.map((fit, idx) => (
            <button
              key={fit.id}
              onClick={() => setActiveFitIndex(idx)}
              className={`h-1 transition-all duration-300 rounded-full ${activeFitIndex === idx ? 'w-12 bg-white' : 'w-4 bg-white/20 hover:bg-white/40'}`}
              aria-label={`Go to ${fit.name}`}
            />
          ))}
        </div>
        
        <div className="flex gap-4">
          <button
            onClick={() => setActiveFitIndex(prev => prev === 0 ? FITS.length - 1 : prev - 1)}
            className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center hover:bg-white/10 transition-colors text-white"
            aria-label="Previous fit"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => setActiveFitIndex(prev => (prev + 1) % FITS.length)}
            className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center hover:bg-white/10 transition-colors text-white"
            aria-label="Next fit"
          >
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
