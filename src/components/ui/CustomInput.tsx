'use client';

import * as React from 'react';
import { motion } from 'motion/react';
import { cn } from '@/lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, id, disabled, value, defaultValue, onChange, onFocus, onBlur, ...props }, ref) => {
    const backupId = React.useId();
    const inputId = id || backupId;
    const [isFocused, setIsFocused] = React.useState(false);
    const [hasValue, setHasValue] = React.useState(
      Boolean(value || defaultValue || props.placeholder)
    );

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(true);
      onFocus?.(e);
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(false);
      setHasValue(Boolean(e.target.value));
      onBlur?.(e);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setHasValue(Boolean(e.target.value));
      onChange?.(e);
    };

    const isActive = isFocused || hasValue;

    return (
      <div className="relative w-full flex flex-col gap-1">
        <div className="relative">
          <input
            id={inputId}
            ref={ref}
            disabled={disabled}
            value={value}
            defaultValue={defaultValue}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onChange={handleChange}
            className={cn(
              'peer flex h-14 w-full rounded-md border bg-transparent px-4 pb-2 pt-6 text-base text-[#111] transition-colors outline-none disabled:cursor-not-allowed disabled:opacity-50',
              error
                ? 'border-[#D62828] focus:border-[#D62828]'
                : 'border-gray-300 focus:border-[#2B3A55]',
              className
            )}
            {...props}
          />
          {label && (
            <motion.label
              htmlFor={inputId}
              initial={false}
              animate={{
                y: isActive ? -12 : 0,
                scale: isActive ? 0.85 : 1,
                color: error ? '#D62828' : isFocused ? '#2B3A55' : '#6B6B6B'
              }}
              className="absolute left-4 top-4 origin-top-left pointer-events-none text-base"
            >
              {label}
            </motion.label>
          )}
        </div>
        {error && (
          <span className="text-sm text-[#D62828] px-1">{error}</span>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
