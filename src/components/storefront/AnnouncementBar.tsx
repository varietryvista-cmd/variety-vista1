'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';

interface AnnouncementBarProps {
  messages?: string[];
  link?: string;
  backgroundColor?: string;
}

export default function AnnouncementBar({
  messages = [
    'Urgent Jeans Needed? Get Same-Day Delivery in Mumbai! 🚀',
    'Free Shipping on Orders Above ₹999',
    'Easy 7-Day Returns on All Orders',
  ],
  link,
  backgroundColor = '#2B3A55',
}: AnnouncementBarProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    if (messages.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % messages.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [messages.length]);

  if (isDismissed || messages.length === 0) return null;

  const content = (
    <AnimatePresence mode="wait">
      <motion.span
        key={currentIndex}
        initial={{ y: 12, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -12, opacity: 0 }}
        transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
        className="block text-center"
      >
        {messages[currentIndex]}
      </motion.span>
    </AnimatePresence>
  );

  return (
    <div
      className="relative flex items-center justify-center text-white text-[11px] font-medium tracking-[0.08em] uppercase"
      style={{
        backgroundColor,
        height: 'var(--announcement-height)',
      }}
    >
      {link ? (
        <a href={link} className="hover:underline">
          {content}
        </a>
      ) : (
        content
      )}

      {/* Dismiss button — mobile only */}
      <button
        onClick={() => setIsDismissed(true)}
        className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-white/70 hover:text-white transition-colors md:hidden"
        aria-label="Dismiss announcement"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
