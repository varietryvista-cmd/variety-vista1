'use client';

import { useState, useEffect, useCallback } from 'react';
import { useDebounce } from './useDebounce';
import { ServiceabilityResult } from '@/lib/shiprocket';

export function useServiceability(initialPincode: string = '') {
  const [pincode, setPincode] = useState(initialPincode);
  const debouncedPincode = useDebounce(pincode, 800);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<ServiceabilityResult | null>(null);

  const checkServiceability = useCallback(async (pin: string) => {
    if (!pin || pin.length < 6) {
      setData(null);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Typically you would call a Next.js route handler (API) here to hide Shiprocket credentials,
      // e.g., /api/shiprocket/serviceability?pincode=...
      const response = await fetch(`/api/shiprocket/serviceability?pincode=${pin}`);
      if (!response.ok) {
        throw new Error('Failed to verify pincode');
      }
      const result: ServiceabilityResult = await response.json();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setData(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (debouncedPincode && debouncedPincode.length === 6) {
      checkServiceability(debouncedPincode);
    } else {
      setData(null);
    }
  }, [debouncedPincode, checkServiceability]);

  return {
    pincode,
    setPincode,
    loading,
    error,
    data,
    checkServiceability,
  };
}
