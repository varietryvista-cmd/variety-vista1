'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, CheckCircle } from 'lucide-react';
import { useReducedMotion } from 'motion/react';

export default function NewsletterSection() {
  const reducedMotion = useReducedMotion();
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setIsLoading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 800));
      setIsSubmitted(true);
      setEmail('');
    } catch {
      // Handle error
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="bg-[#0A0A0A] text-white border-t border-white/5 py-32 md:py-40">
      <div className="page-container">
        <div className="flex flex-col lg:flex-row gap-16 lg:gap-32 items-start justify-between">
          <motion.div
            initial={reducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            whileInView={reducedMotion ? { opacity: 1, y: 0 } : { opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="lg:w-1/2"
          >
            <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#B8913A] block mb-6">
              Stay Connected
            </span>
            <h2 className="text-4xl sm:text-5xl md:text-7xl font-bold uppercase tracking-[-0.04em] text-white mb-6 leading-[0.9]">
              Don&apos;t Miss<br />The Drop.
            </h2>
            <p className="text-base text-white/40 max-w-sm leading-relaxed">
              Early access to new collections, exclusive drops, and insider access.
            </p>
          </motion.div>

          <motion.div
            initial={reducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            whileInView={reducedMotion ? { opacity: 1, y: 0 } : { opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="lg:w-1/2 w-full flex flex-col justify-center min-h-[160px]"
          >
            <AnimatePresence mode="wait">
              {isSubmitted ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex items-center gap-4 text-white"
                >
                  <CheckCircle className="w-6 h-6 text-[#B8913A] flex-shrink-0" />
                  <span className="text-xl font-medium tracking-tight">You&apos;re on the list.</span>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  initial={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onSubmit={handleSubmit}
                  className="w-full relative group"
                >
                  <div className="w-full relative">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="ENTER YOUR EMAIL"
                      required
                      className="w-full bg-transparent border-b border-white/15 focus:border-[#B8913A] pb-4 text-2xl md:text-3xl font-bold uppercase tracking-[-0.02em] placeholder:text-white/15 focus:outline-none transition-colors duration-500 rounded-none"
                    />
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="absolute right-0 bottom-4 text-white/30 hover:text-[#B8913A] transition-colors duration-300 disabled:opacity-50"
                    >
                      {isLoading ? (
                        <div className="w-6 h-6 border border-white/20 border-t-[#B8913A] rounded-full animate-spin" />
                      ) : (
                        <ArrowRight className="w-8 h-8" />
                      )}
                    </button>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>

            <motion.div
              initial={reducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }}
              whileInView={reducedMotion ? { opacity: 1, y: 0 } : { opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex flex-wrap gap-6 md:gap-10 mt-16 pt-10 border-t border-white/6"
            >
              <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/25">Free Shipping</span>
              <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/25">7-Day Returns</span>
              <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/25">COD Available</span>
              <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/25">Secure Checkout</span>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}