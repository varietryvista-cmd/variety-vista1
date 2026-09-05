'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { motion } from 'motion/react';

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'text' | 'rect' | 'circle' | 'card';
  width?: string | number;
  height?: string | number;
}

export default function Skeleton({ className, variant = 'rect', width, height, ...props }: SkeletonProps) {
  const styles = {
    width: width || (variant === 'text' ? '100%' : undefined),
    height: height || (variant === 'text' ? '1rem' : undefined),
  };

  const variants = {
    text: 'rounded-md',
    rect: 'rounded-md',
    circle: 'rounded-full aspect-square',
    card: 'rounded-xl min-h-[300px] w-full',
  };

  return (
    <div
      style={styles}
      className={cn(
        'bg-gray-200 relative overflow-hidden',
        variants[variant],
        className
      )}
      {...props}
    >
      <motion.div
        className="absolute inset-0 z-10 bg-gradient-to-r from-transparent via-white/50 to-transparent"
        initial={{ x: '-100%' }}
        animate={{ x: '100%' }}
        transition={{
          repeat: Infinity,
          duration: 1.5,
          ease: 'linear'
        }}
      />
    </div>
  );
}
