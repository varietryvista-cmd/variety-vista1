import { z } from 'zod';

// Zod schema for checkout validation
export const checkoutSchema = z.object({
  email: z.string().email('Invalid email address'),
  firstName: z.string().min(2, 'First name is required'),
  lastName: z.string().min(2, 'Last name is required'),
  address: z.string().min(5, 'Address is required'),
  city: z.string().min(2, 'City is required'),
  state: z.string().min(2, 'State is required'),
  pincode: z.string().min(6, 'Valid pincode required'),
  phone: z.string().min(10, 'Valid phone number required'),
  paymentMethod: z.enum(['razorpay', 'cod']),
  couponCode: z.string().optional(),
});

export type CheckoutFormData = z.infer<typeof checkoutSchema>;