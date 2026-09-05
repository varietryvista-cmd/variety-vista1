'use client';

import { motion } from 'motion/react';
import { Truck, RefreshCcw, ShieldCheck } from 'lucide-react';
import { useReducedMotion } from 'motion/react';

export default function TrustStrip() {
  const reducedMotion = useReducedMotion();
  const trustFeatures = [
    {
      icon: Truck,
      title: 'Fast Shipping',
      description: 'Same-day delivery in Mumbai. 2-4 days pan-India.',
    },
    {
      icon: RefreshCcw,
      title: '7-Day Easy Returns',
      description: 'No-questions-asked return policy for a perfect fit.',
    },
    {
      icon: ShieldCheck,
      title: '100% Secure Payment',
      description: 'All major credit cards, UPI, and Cash on Delivery accepted.',
    },
  ];

  return (
    <section className="bg-[#0A0A0A] border-t border-white/5 py-20 md:py-24">
      <div className="page-container">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-0">
          {trustFeatures.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={index}
                initial={reducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }}
                whileInView={reducedMotion ? { opacity: 1, y: 0 } : { opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.6, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
                className={`flex flex-col items-center text-center px-8 ${
                  index > 0 ? 'md:border-l md:border-white/6' : ''
                }`}
              >
                <Icon className="w-5 h-5 text-[#B8913A] mb-5" strokeWidth={1.5} />
                <h3 className="text-[11px] font-semibold tracking-[0.15em] uppercase text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-[13px] text-white/35 max-w-[240px] leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}