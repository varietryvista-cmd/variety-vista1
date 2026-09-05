'use server';

import { createServerClient } from '@/lib/supabase';
import type { Coupon } from '@/types';

export interface CouponValidationResult {
  valid: boolean;
  message: string;
  coupon?: {
    id: string;
    code: string;
    type: 'percentage' | 'fixed';
    value: number;
    discountAmount: number;
  };
}

export async function validateCoupon(
  code: string,
  subtotal: number
): Promise<CouponValidationResult> {
  if (!code || !code.trim()) {
    return { valid: false, message: 'Please enter a coupon code.' };
  }

  const cleanCode = code.trim().toUpperCase();

  try {
    const supabase = await createServerClient();
    const { data: couponData, error } = await supabase
      .from('coupons')
      .select('*')
      .ilike('code', cleanCode)
      .eq('is_active', true)
      .maybeSingle();

    if (error || !couponData) {
      return { valid: false, message: 'Invalid or expired coupon code.' };
    }

    const coupon = couponData as Coupon;
    const now = new Date();

    // Check validity dates
    if (coupon.valid_from && new Date(coupon.valid_from) > now) {
      return { valid: false, message: 'This coupon is not active yet.' };
    }

    if (coupon.valid_to && new Date(coupon.valid_to) < now) {
      return { valid: false, message: 'This coupon has expired.' };
    }

    // Check usage limits
    if (coupon.usage_limit && coupon.times_used !== undefined && coupon.times_used >= coupon.usage_limit) {
      return { valid: false, message: 'This coupon has reached its maximum usage limit.' };
    }

    // Check minimum order amount
    if (coupon.min_order_amount && subtotal < coupon.min_order_amount) {
      return {
        valid: false,
        message: `Minimum order of ₹${coupon.min_order_amount.toLocaleString('en-IN')} required for this coupon.`
      };
    }

    // Calculate discount amount
    let discountAmount = 0;
    if (coupon.type === 'percentage') {
      discountAmount = Math.round((subtotal * coupon.value) / 100);
    } else {
      discountAmount = Math.min(coupon.value, subtotal);
    }

    return {
      valid: true,
      message: `Coupon applied: ₹${discountAmount.toLocaleString('en-IN')} discount!`,
      coupon: {
        id: coupon.id,
        code: coupon.code,
        type: coupon.type,
        value: coupon.value,
        discountAmount
      }
    };
  } catch (err) {
    console.error('Error validating coupon:', err);
    return { valid: false, message: 'Unable to validate coupon at this time.' };
  }
}
