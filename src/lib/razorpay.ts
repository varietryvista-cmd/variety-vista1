'use server'

import Razorpay from 'razorpay'
import crypto from 'crypto'

export const razorpayInstance = new Razorpay({
  key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || '',
  key_secret: process.env.RAZORPAY_KEY_SECRET || '',
})

export async function createRazorpayOrder(amount: number, currency: string, receipt: string) {
  const options = {
    amount: Math.round(amount * 100), // amount in the smallest currency unit
    currency,
    receipt,
  }

  try {
    const order = await razorpayInstance.orders.create(options)
    return order
  } catch (error) {
    console.error('Error creating Razorpay order:', error)
    throw error
  }
}

export async function verifyPaymentSignature(
  orderId: string,
  paymentId: string,
  signature: string
): Promise<boolean> {
  const body = orderId + '|' + paymentId

  const expectedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || '')
    .update(body.toString())
    .digest('hex')

  const isAuthentic = expectedSignature === signature
  return isAuthentic
}
