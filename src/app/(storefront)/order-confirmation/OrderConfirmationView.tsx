'use client';

import * as React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { CheckCircle2, Package, Mail, Truck, CreditCard, DollarSign, Printer } from 'lucide-react';
import Button from '@/components/ui/CustomButton';
import { formatPrice } from '@/lib/utils';
import type { Order, OrderItem, Product, ProductImage } from '@/types';
import OrderInvoice from '@/components/storefront/OrderInvoice';

interface OrderConfirmationViewProps {
  order: Order | null;
  orderItems: (OrderItem & { product?: Product & { images?: ProductImage[] } })[];
}

export default function OrderConfirmationView({ order, orderItems }: OrderConfirmationViewProps) {
  const [isInvoiceOpen, setIsInvoiceOpen] = React.useState(false);
  const orderId = order?.id || 'ORD-' + Math.floor(100000 + Math.random() * 900000);
  const orderNumber = order?.order_number || orderId.slice(0, 8).toUpperCase();
  const customerEmail = order?.email || 'your email address';
  const totalAmount = order?.total || 0;
  const paymentMethod = order?.payment_method || 'razorpay';
  const paymentStatus = order?.payment_status || 'pending';
  const fulfillmentStatus = order?.fulfillment_status || 'pending';

  const shippingAddress = order?.shipping_address as Record<string, unknown> | null;
  const addressLine = shippingAddress
    ? `${shippingAddress.first_name} ${shippingAddress.last_name}, ${shippingAddress.address}, ${shippingAddress.city}, ${shippingAddress.state} - ${shippingAddress.pincode}, ${shippingAddress.country || 'India'}`
    : 'Address not available';

  return (
    <div className="max-w-3xl mx-auto px-4 md:px-8">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        
        {/* Header */}
        <div className="bg-green-50 px-8 py-12 text-center border-b border-green-100">
          <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-6" />
          <h1 className="text-3xl font-bold text-[#111] mb-2">Order Confirmed!</h1>
          <p className="text-gray-600">Thank you for shopping with Variety Vista.</p>
        </div>

        {/* Details */}
        <div className="p-8 md:p-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
                <Package className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Order Number</p>
                <p className="font-semibold text-[#111] text-lg">{orderNumber}</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center shrink-0">
                <Mail className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Confirmation Email</p>
                <p className="font-semibold text-[#111] text-sm">Sent to {customerEmail}</p>
              </div>
            </div>
          </div>

          {/* Order Items */}
          {orderItems.length > 0 && (
            <div className="mb-10">
              <h2 className="text-lg font-bold text-[#111] mb-4 uppercase tracking-wider">Order Items</h2>
              <div className="space-y-4">
                {orderItems.map((item) => {
                  const product = item.product as { title?: string; images?: ProductImage[] } | undefined;
                  const imageUrl = product?.images?.[0]?.image_url;
                  const title = product?.title || 'Product';
                  const price = item.unit_price || 0;
                  const quantity = item.quantity || 1;
                  const size = item.waist_size || (item.variant_id ? `Size ${item.waist_size}` : '');
                  
                  return (
                    <div key={item.id} className="flex gap-4 p-4 bg-gray-50 rounded-lg border border-gray-100">
                      <div className="relative w-16 h-20 bg-gray-100 rounded-lg overflow-hidden shrink-0">
                        {imageUrl && (
                          <Image
                            src={imageUrl}
                            alt={title}
                            fill
                            className="object-cover"
                            sizes="64px"
                          />
                        )}
                      </div>
                      <div className="flex-1 flex flex-col justify-center">
                        <p className="font-semibold text-[#111] text-sm">{title}</p>
                        <p className="text-gray-500 text-xs uppercase tracking-wider">Size: {size}</p>
                      </div>
                      <div className="flex items-center gap-4 text-sm font-medium text-[#111]">
                        <span className="text-gray-500">Qty: {quantity}</span>
                        <span>{formatPrice(price * quantity)}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Shipping Address */}
          <div className="bg-gray-50 rounded-lg p-6 mb-10">
            <h3 className="font-bold text-[#111] mb-3 uppercase tracking-wider text-sm">Shipping Address</h3>
            <p className="text-gray-600 leading-relaxed">{addressLine}</p>
          </div>

          {/* Payment & Status */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
              <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center shrink-0">
                <CreditCard className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Payment Method</p>
                <p className="font-semibold text-[#111] capitalize">{paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online (Razorpay)'}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
              <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
                <DollarSign className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Paid</p>
                <p className="font-semibold text-[#111]">{formatPrice(totalAmount)}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
              <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center shrink-0">
                <Truck className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Order Status</p>
                <p className="font-semibold text-[#111] capitalize">{fulfillmentStatus}</p>
              </div>
            </div>
          </div>

          {/* Status Message */}
          <div className="bg-gray-50 rounded-lg p-6 mb-10 text-center text-gray-600">
            {paymentStatus === 'paid' && (
              <>
                <p className="mb-2 font-medium text-green-700">✓ Payment confirmed</p>
                <p>We&apos;re preparing your order for shipment.</p>
              </>
            )}
            {paymentStatus === 'cod_pending' && (
              <>
                <p className="mb-2 font-medium text-blue-700">✓ Order placed successfully</p>
                <p>You will pay on delivery. Our team will contact you shortly.</p>
              </>
            )}
            {paymentStatus === 'pending' && (
              <>
                <p className="mb-2 font-medium text-yellow-700">⏳ Payment pending</p>
                <p>We&apos;ll confirm your order once payment is received.</p>
              </>
            )}
            {paymentStatus === 'failed' && (
              <>
                <p className="mb-2 font-medium text-red-700">✗ Payment failed</p>
                <p>Please try again or contact support.</p>
              </>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/collections/all">
              <Button size="lg">
                Continue Shopping
              </Button>
            </Link>
            {order && (
              <Button variant="outline" size="lg" onClick={() => setIsInvoiceOpen(true)} className="flex items-center gap-2">
                <Printer className="w-4 h-4" /> Tax Invoice
              </Button>
            )}
            <Link href="/account/orders">
              <Button variant="outline" size="lg">
                View My Orders
              </Button>
            </Link>
          </div>
        </div>

      </div>

      {/* Printable Tax Invoice Modal */}
      {order && (
        <OrderInvoice
          order={order}
          isOpen={isInvoiceOpen}
          onClose={() => setIsInvoiceOpen(false)}
        />
      )}
    </div>
  );
}