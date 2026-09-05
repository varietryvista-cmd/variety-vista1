'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Loader2, ArrowLeft, X } from 'lucide-react';
import {
  Dialog,
  DialogContent,
} from '@/components/ui/dialog';
import Button from '@/components/ui/CustomButton';
import ProductCard from './ProductCard';
import { calculateFitRecommendations, type FitFinderAnswers } from '@/app/actions/fit-finder';
import type { Product, ProductImage, ProductVariant } from '@/types';

type FullProduct = Product & { images: ProductImage[]; variants: ProductVariant[] };

const STEPS = [
  {
    id: 'gender',
    title: 'Who are we shopping for?',
    options: [
      { value: 'women', label: 'Women', icon: '👩' },
      { value: 'men', label: 'Men', icon: '👨' },
      { value: 'unisex', label: 'Anyone', icon: '✨' },
    ]
  },
  {
    id: 'bodyShape',
    title: 'What best describes your body shape?',
    options: [
      { value: 'straight', label: 'Straight', desc: 'Hips and waist are similar in width' },
      { value: 'curvy', label: 'Curvy', desc: 'Hips are significantly wider than waist' },
      { value: 'athletic', label: 'Athletic', desc: 'Muscular or broader build' },
    ]
  },
  {
    id: 'preferredRise',
    title: 'Where do you like your jeans to sit?',
    options: [
      { value: 'high', label: 'High Rise', desc: 'Sits at or above the belly button' },
      { value: 'mid', label: 'Mid Rise', desc: 'Sits just below the belly button' },
      { value: 'low', label: 'Low Rise', desc: 'Sits at the hips' },
    ]
  },
  {
    id: 'preferredFit',
    title: 'How do you want your jeans to fit?',
    options: [
      { value: 'skinny', label: 'Skinny', desc: 'Form-fitting from hip to hem' },
      { value: 'slim', label: 'Slim', desc: 'Fitted but not skin-tight' },
      { value: 'straight', label: 'Straight', desc: 'Same width from knee to hem' },
      { value: 'relaxed', label: 'Relaxed/Baggy', desc: 'Loose and comfortable all over' },
    ]
  },
  {
    id: 'height',
    title: 'How tall are you?',
    options: [
      { value: 'petite', label: 'Petite', desc: '5\'3" and under' },
      { value: 'regular', label: 'Regular', desc: '5\'4" to 5\'7"' },
      { value: 'tall', label: 'Tall', desc: '5\'8" and over' },
    ]
  }
];

export function FitFinderModal({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Partial<FitFinderAnswers>>({});
  const [isCalculating, setIsCalculating] = useState(false);
  const [recommendations, setRecommendations] = useState<FullProduct[] | null>(null);

  const handleSelect = async (value: string) => {
    const stepId = STEPS[currentStep].id as keyof FitFinderAnswers;
    const newAnswers = { ...answers, [stepId]: value };
    setAnswers(newAnswers);

    if (currentStep < STEPS.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      // Calculate results
      setIsCalculating(true);
      try {
        const results = await calculateFitRecommendations(newAnswers as FitFinderAnswers);
        setRecommendations(results);
      } catch (error) {
        console.error('Error fetching recommendations:', error);
        // show some error fallback
        setRecommendations([]);
      } finally {
        setIsCalculating(false);
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const reset = () => {
    setCurrentStep(0);
    setAnswers({});
    setRecommendations(null);
  };

  const handleClose = () => {
    onOpenChange(false);
    // Optional: reset on close
    setTimeout(reset, 300);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[700px] p-0 overflow-hidden bg-white rounded-xl">
        <div className="relative min-h-[500px] flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-divider">
            <div className="flex items-center gap-2">
              {currentStep > 0 && !recommendations && !isCalculating && (
                <button 
                  onClick={handleBack}
                  className="p-2 hover:bg-secondary-bg rounded-full transition-colors"
                >
                  <ArrowLeft className="h-5 w-5" />
                </button>
              )}
              <h2 className="text-lg font-bold">Fit Finder</h2>
            </div>
            <button 
              onClick={handleClose}
              className="p-2 hover:bg-secondary-bg rounded-full transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Progress Bar */}
          {!recommendations && !isCalculating && (
            <div className="w-full bg-secondary-bg h-1">
              <div 
                className="bg-black h-full transition-all duration-300 ease-in-out"
                style={{ width: `${((currentStep + 1) / STEPS.length) * 100}%` }}
              />
            </div>
          )}

          {/* Content Area */}
          <div className="flex-1 flex flex-col items-center justify-center p-6 sm:p-10 relative overflow-hidden">
            <AnimatePresence mode="wait">
              {isCalculating ? (
                <motion.div
                  key="calculating"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.05 }}
                  className="flex flex-col items-center text-center space-y-4"
                >
                  <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mb-4">
                    <Loader2 className="h-8 w-8 text-white animate-spin" />
                  </div>
                  <h3 className="text-2xl font-bold">Finding your perfect fit...</h3>
                  <p className="text-secondary-text">Analyzing thousands of styles based on your preferences.</p>
                </motion.div>
              ) : recommendations ? (
                <motion.div
                  key="results"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="w-full h-full flex flex-col"
                >
                  <div className="text-center mb-8">
                    <h3 className="text-2xl sm:text-3xl font-bold mb-2">Your Perfect Matches</h3>
                    <p className="text-secondary-text">Based on your answers, we think you&apos;ll love these.</p>
                  </div>
                  
                  {recommendations.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 overflow-y-auto max-h-[400px] px-2 pb-4">
                      {recommendations.map(product => (
                        <div key={product.id} onClick={() => onOpenChange(false)}>
                          <ProductCard product={product} />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <p className="text-secondary-text mb-4">We couldn&apos;t find an exact match, but check out our new arrivals.</p>
                      <Button onClick={() => { onOpenChange(false); window.location.href='/collections/new-arrivals'; }}>
                        Shop New Arrivals
                      </Button>
                    </div>
                  )}
                  
                  <div className="mt-auto pt-6 flex justify-center">
                    <button 
                      onClick={reset}
                      className="text-sm text-secondary-text hover:text-black underline underline-offset-4"
                    >
                      Retake Quiz
                    </button>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                  className="w-full max-w-lg flex flex-col"
                >
                  <h3 className="text-2xl sm:text-3xl font-bold text-center mb-8">
                    {STEPS[currentStep].title}
                  </h3>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {STEPS[currentStep].options.map((option, idx) => (
                      <button
                        key={option.value}
                        onClick={() => handleSelect(option.value)}
                        className={`
                          p-6 border-2 rounded-xl text-left transition-all duration-200
                          hover:border-black hover:bg-[#f9f9f9]
                          flex flex-col gap-2
                          ${STEPS[currentStep].options.length % 2 !== 0 && idx === STEPS[currentStep].options.length - 1 ? 'sm:col-span-2' : ''}
                        `}
                      >
                        <div className="flex items-center gap-3">
                          {'icon' in option && <span className="text-2xl">{option.icon}</span>}
                          <span className="font-semibold text-lg">{option.label}</span>
                        </div>
                        {'desc' in option && (
                          <span className="text-sm text-secondary-text">{option.desc}</span>
                        )}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
