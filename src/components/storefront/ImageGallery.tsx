'use client';

import * as React from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/lib/utils';
import type { ProductImage } from '@/types';
import { ChevronLeft, ChevronRight, ZoomIn, X } from 'lucide-react';

interface ImageGalleryProps {
  images: ProductImage[];
  productTitle: string;
}

export default function ImageGallery({ images, productTitle }: ImageGalleryProps) {
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const [zoomPosition, setZoomPosition] = React.useState({ x: 50, y: 50 });
  const [isZooming, setIsZooming] = React.useState(false);
  const [isFullscreen, setIsFullscreen] = React.useState(false);

  const sortedImages = [...images].sort((a, b) => a.sort_order - b.sort_order);
  const selectedImage = sortedImages[selectedIndex];

  const isVideo = (url: string) => url.match(/\.(mp4|webm)$/i);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isVideo(selectedImage.image_url)) return;
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomPosition({ x, y });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') {
      setSelectedIndex(prev => (prev - 1 + sortedImages.length) % sortedImages.length);
    } else if (e.key === 'ArrowRight') {
      setSelectedIndex(prev => (prev + 1) % sortedImages.length);
    } else if (e.key === 'Escape' && isFullscreen) {
      setIsFullscreen(false);
    }
  };

  if (!selectedImage) {
    return (
      <div className="w-full aspect-product md:h-[calc(100vh-120px)] bg-slate-100 rounded-xl flex items-center justify-center text-secondary-text">
        No images available
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Thumbnails */}
      <div className="flex gap-3 overflow-x-auto md:w-24 lg:w-28 shrink-0 pb-2 md:pb-0 hide-scrollbar snap-x snap-mandatory" role="tablist" aria-label="Product images">
        {sortedImages.map((img, idx) => (
          <button
            key={img.id}
            onClick={() => setSelectedIndex(idx)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                setSelectedIndex(idx);
              }
            }}
            role="tab"
            aria-selected={selectedIndex === idx}
            aria-label={`View image ${idx + 1}`}
            className={cn(
              "relative w-20 h-24 md:w-full md:h-28 lg:h-32 rounded-lg overflow-hidden flex-shrink-0 transition-all duration-300 snap-start focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-denim focus-visible:ring-offset-2",
              selectedIndex === idx ? "ring-2 ring-offset-2 ring-denim opacity-100" : "opacity-50 hover:opacity-100"
            )}
          >
            {isVideo(img.image_url) ? (
              <video 
                src={img.image_url} 
                className="object-cover w-full h-full" 
                muted 
                playsInline 
              />
            ) : (
              <Image 
                src={img.image_url} 
                alt={img.alt_text || `${productTitle} - thumbnail ${idx + 1}`}
                fill 
                className="object-cover"
                sizes="80px"
              />
            )}
          </button>
        ))}
      </div>

      {/* Main Image */}
      <div 
        className="relative w-full aspect-product md:aspect-auto md:h-[calc(100vh-120px)] bg-slate-100 rounded-xl overflow-hidden group cursor-zoom-in"
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsZooming(true)}
        onMouseLeave={() => setIsZooming(false)}
        onClick={() => setIsFullscreen(true)}
        onKeyDown={handleKeyDown}
        tabIndex={0}
        role="button"
        aria-label="Click to enlarge image"
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedIndex}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.02 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-0"
          >
            {isVideo(selectedImage.image_url) ? (
              <video
                src={selectedImage.image_url}
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="relative w-full h-full overflow-hidden">
                <Image
                  src={selectedImage.image_url}
                  alt={selectedImage.alt_text || `${productTitle} view`}
                  fill
                  priority={selectedIndex === 0}
                  className={cn(
                    "object-cover transition-transform duration-200 ease-out",
                    isZooming ? "scale-[2]" : "scale-100"
                  )}
                  style={isZooming ? { transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%` } : { transformOrigin: 'center center' }}
                  sizes="(max-width: 768px) 100vw, 60vw"
                />
              </div>
            )}
          </motion.div>
        </AnimatePresence>
        
        {/* Zoom Indicator */}
        <div className="absolute bottom-4 right-4 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-black/70 text-white text-xs font-medium rounded-full">
            <ZoomIn className="w-3.5 h-3.5" />
            <span>Click to zoom</span>
          </div>
        </div>

        {/* Navigation Arrows */}
        {sortedImages.length > 1 && (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setSelectedIndex(prev => (prev - 1 + sortedImages.length) % sortedImages.length);
              }}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center bg-white/90 backdrop-blur-md rounded-full text-zinc-950 opacity-0 group-hover:opacity-100 hover:bg-white transition-all duration-300 shadow-lg"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setSelectedIndex(prev => (prev + 1) % sortedImages.length);
              }}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center bg-white/90 backdrop-blur-md rounded-full text-zinc-950 opacity-0 group-hover:opacity-100 hover:bg-white transition-all duration-300 shadow-lg"
              aria-label="Next image"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}

        {/* Mobile Swipe Indicators (dots) */}
        <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 md:hidden">
          {sortedImages.map((_, idx) => (
            <div 
              key={idx} 
              className={cn(
                "w-1.5 h-1.5 rounded-full transition-all",
                selectedIndex === idx ? "bg-primary-text w-3" : "bg-primary-text/30"
              )} 
            />
          ))}
        </div>

        {/* Image Counter */}
        <div className="absolute top-4 left-4 bg-black/60 text-white text-xs font-medium px-3 py-1.5 rounded-full">
          {selectedIndex + 1} / {sortedImages.length}
        </div>
      </div>

      {/* Fullscreen Modal */}
      <AnimatePresence>
        {isFullscreen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black z-50"
              onClick={() => setIsFullscreen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
            >
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsFullscreen(false);
                }}
                className="absolute top-6 right-6 w-12 h-12 flex items-center justify-center bg-white/10 backdrop-blur-md rounded-full text-white hover:bg-white/20 transition-colors z-10"
                aria-label="Close fullscreen"
              >
                <X className="w-6 h-6" />
              </button>
              
              <div className="relative w-full h-full max-w-6xl max-h-[90vh]">
                {isVideo(selectedImage.image_url) ? (
                  <video
                    src={selectedImage.image_url}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-contain"
                    controls
                  />
                ) : (
                  <Image
                    src={selectedImage.image_url}
                    alt={selectedImage.alt_text || `${productTitle} view`}
                    fill
                    className="object-contain"
                    sizes="100vw"
                  />
                )}
              </div>

              {/* Fullscreen Navigation */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedIndex(prev => (prev - 1 + sortedImages.length) % sortedImages.length);
                }}
                className="absolute left-6 top-1/2 -translate-y-1/2 w-14 h-14 flex items-center justify-center bg-white/10 backdrop-blur-md rounded-full text-white hover:bg-white/20 transition-colors z-10 md:left-0"
                aria-label="Previous image"
              >
                <ChevronLeft className="w-7 h-7" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedIndex(prev => (prev + 1) % sortedImages.length);
                }}
                className="absolute right-6 top-1/2 -translate-y-1/2 w-14 h-14 flex items-center justify-center bg-white/10 backdrop-blur-md rounded-full text-white hover:bg-white/20 transition-colors z-10 md:right-0"
                aria-label="Next image"
              >
                <ChevronRight className="w-7 h-7" />
              </button>

              {/* Fullscreen Thumbnails */}
              <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3">
                {sortedImages.map((img, idx) => (
                  <button
                    key={img.id}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedIndex(idx);
                    }}
                    className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                      idx === selectedIndex ? 'border-white' : 'border-transparent hover:border-white/50'
                    }`}
                    aria-label={`View image ${idx + 1}`}
                  >
                    <Image
                      src={img.image_url}
                      alt=""
                      fill
                      className="object-cover"
                      sizes="64px"
                    />
                  </button>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}