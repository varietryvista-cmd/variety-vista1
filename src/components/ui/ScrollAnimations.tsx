'use client';

import React from 'react';
import { motion, HTMLMotionProps } from 'motion/react';
import { useScrollAnimation, useParallax, useStaggeredAnimation } from '@/hooks/useScrollAnimation';
import { ReactNode } from 'react';

interface ScrollRevealProps extends Omit<HTMLMotionProps<'div'>, 'initial' | 'animate' | 'transition'> {
  children: ReactNode;
  delay?: number;
  threshold?: number;
  rootMargin?: string;
  triggerOnce?: boolean;
  className?: string;
  key?: React.Key;
}

export function ScrollReveal({
  children,
  delay = 0,
  threshold = 0.1,
  rootMargin = '0px 0px -50px 0px',
  triggerOnce = true,
  className = '',
  ...props
}: ScrollRevealProps) {
  const { ref, isVisible } = useScrollAnimation({
    threshold,
    rootMargin,
    triggerOnce,
    delay,
  });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}

interface StaggerContainerProps {
  children: ReactNode;
  baseDelay?: number;
  className?: string;
  itemClassName?: string;
}

export function StaggerContainer({
  children,
  baseDelay = 100,
  className = '',
  itemClassName = '',
}: StaggerContainerProps) {
  const childrenArray = React.Children.toArray(children);
  const { ref, visibleItems } = useStaggeredAnimation(childrenArray.length, baseDelay);

  return (
    <div ref={ref} className={className}>
      {childrenArray.map((child, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 30 }}
          animate={visibleItems.has(index) ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className={itemClassName}
        >
          {child}
        </motion.div>
      ))}
    </div>
  );
}

interface ParallaxProps {
  children: ReactNode;
  speed?: number;
  className?: string;
}

export function Parallax({ children, speed = 0.3, className = '' }: ParallaxProps) {
  const { ref, offset } = useParallax(speed);

  return (
    <div ref={ref} className={className}>
      <motion.div
        style={{ transform: `translateY(${offset}px)` }}
        className="will-change-transform"
      >
        {children}
      </motion.div>
    </div>
  );
}