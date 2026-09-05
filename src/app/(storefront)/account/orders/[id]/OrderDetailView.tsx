import * as React from 'react';
import type { Order } from '@/types';
import { Package, Truck, FileText, CheckCircle2, RotateCcw, Printer } from 'lucide-react';
import Image from 'next/image';
import ReturnRequestModal from '@/components/storefront/ReturnRequestModal';
import OrderInvoice from '@/components/storefront/OrderInvoice';

interface OrderDetailViewProps {
  order: Order;
}

export default function OrderDetailView({ order }: OrderDetailViewProps) {
  const [isReturnOpen, setIsReturnOpen] = React.useState(false);
  const [isInvoiceOpen, setIsInvoiceOpen] = React.useState(false);

  // Safe cast since the DB stores JSON for addresses
  const shipping = order.shipping_address as Record<string, string>;
  const billing = order.billing_address as Record<string, string> || shipping;

  return (
    <div className="space-y-8">
      {/* Quick Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-white border border-gray-100 rounded-xl shadow-sm">
        <div className="flex items-center gap-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
          <span>Need help or documents for Order #{order.order_number}?</span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsInvoiceOpen(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 border border-gray-200 hover:border-black text-gray-800 text-xs font-bold uppercase tracking-wider rounded-lg transition-colors"
          >
            <Printer className="w-3.5 h-3.5" /> Tax Invoice
          </button>
          <button
            onClick={() => setIsReturnOpen(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#0A0A0A] hover:bg-[#B8913A] text-white text-xs font-bold uppercase tracking-wider rounded-lg transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Return / Exchange
          </button>
        </div>
      </div>

      {/* Tracking Section */}
      <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm">
        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Truck className="w-5 h-5 text-gray-500" /> 
          Tracking Information
        </h3>
        
        {order.awb_code ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-1">
              <p className="text-sm text-gray-500 mb-1">Courier Partner</p>
              <p className="font-medium text-gray-900">{order.courier_name || 'Standard Shipping'}</p>
            </div>
            <div className="md:col-span-1">
              <p className="text-sm text-gray-500 mb-1">Tracking Number (AWB)</p>
              <p className="font-medium text-gray-900">{order.awb_code}</p>
            </div>
            <div className="md:col-span-1">
              <p className="text-sm text-gray-500 mb-1">Estimated Delivery</p>
              <p className="font-medium text-gray-900">
                {order.estimated_delivery_date 
                  ? new Date(order.estimated_delivery_date).toLocaleDateString() 
                  : 'Pending update from courier'}
              </p>
            </div>
            
            <div className="md:col-span-3 mt-4">
              <a 
                href={`https://shiprocket.co/tracking/${order.awb_code}`} 
                target="_blank" 
                rel="noreferrer"
                className="inline-block bg-[#111] text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors"
              >
                Track on Shiprocket
              </a>
            </div>
          </div>
        ) : (
          <div className="text-center py-6 bg-gray-50 rounded-lg">
            <Package className="w-8 h-8 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-600 font-medium">Tracking details not yet available.</p>
            <p className="text-sm text-gray-500 mt-1">We will update you once the order is dispatched.</p>
          </div>
        )}
        
        {/* Timeline (if any) */}
        {order.timeline && order.timeline.length > 0 && (
          <div className="mt-8 pt-6 border-t border-gray-100">
            <h4 className="text-sm font-bold text-gray-900 mb-4 uppercase tracking-wider">Order Updates</h4>
            <div className="space-y-4">
              {order.timeline.map((event: import('@/types').OrderTimeline) => (
                <div key={event.id} className="flex gap-4">
                  <div className="mt-0.5">
                    <CheckCircle2 className="w-5 h-5 text-gray-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 capitalize">
                      {event.status.replace(/_/g, ' ')}
                    </p>
                    {event.note && (
                      <p className="text-sm text-gray-600 mt-0.5">{event.note}</p>
                    )}
                    <p className="text-xs text-gray-400 mt-1">
                      {new Date(event.created_at).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Items */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Package className="w-5 h-5 text-gray-500" /> 
              Items Ordered
            </h3>
            
            <div className="divide-y divide-gray-100">
              {order.items?.map((item: import('@/types').OrderItem) => (
                <div key={item.id} className="py-4 flex flex-col sm:flex-row gap-4 first:pt-0 last:pb-0">
                  <div className="w-20 h-24 bg-gray-100 rounded-md shrink-0 flex items-center justify-center overflow-hidden relative">
                    <Image 
                      src="/images/placeholders/product-1.jpg" // We don't store image in order_items right now, so placeholder
                      alt={item.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{item.title}</h4>
                    <div className="text-sm text-gray-500 mt-1 space-y-0.5">
                      {item.waist_size && <p>Size: {item.waist_size} {item.inseam_length ? `x ${item.inseam_length}` : ''}</p>}
                      {item.wash && <p>Wash: {item.wash}</p>}
                    </div>
                    <div className="mt-2 flex items-center justify-between">
                      <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                      <p className="font-medium text-gray-900">₹{item.line_total.toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Summary & Addresses */}
        <div className="space-y-6">
          {/* Order Summary */}
          <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-gray-500" /> 
              Order Summary
            </h3>
            
            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>₹{order.subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Shipping</span>
                <span>{order.shipping_cost === 0 ? 'Free' : `₹${order.shipping_cost.toLocaleString()}`}</span>
              </div>
              {order.tax_amount > 0 && (
                <div className="flex justify-between text-gray-600">
                  <span>Taxes</span>
                  <span>₹{order.tax_amount.toLocaleString()}</span>
                </div>
              )}
              {order.discount_amount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Discount {order.coupon_code && `(${order.coupon_code})`}</span>
                  <span>-₹{order.discount_amount.toLocaleString()}</span>
                </div>
              )}
              <div className="border-t border-gray-100 pt-3 flex justify-between font-bold text-gray-900 text-base">
                <span>Total</span>
                <span>₹{order.total.toLocaleString()}</span>
              </div>
            </div>
            
            <div className="mt-6 p-4 bg-gray-50 rounded-lg text-sm">
              <div className="flex justify-between mb-2">
                <span className="text-gray-500">Payment Method:</span>
                <span className="font-medium text-gray-900 uppercase">{order.payment_method}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Payment Status:</span>
                <span className="font-medium text-gray-900 capitalize">{order.payment_status}</span>
              </div>
            </div>
          </div>

          {/* Addresses */}
          <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm">
            <div className="mb-6">
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-3">Shipping Address</h3>
              <div className="text-sm text-gray-600 space-y-1">
                <p className="font-medium text-gray-900">{shipping.full_name}</p>
                <p>{shipping.address_line1}</p>
                {shipping.address_line2 && <p>{shipping.address_line2}</p>}
                <p>{shipping.city}, {shipping.state} {shipping.pincode}</p>
                <p>{shipping.country || 'India'}</p>
                <p className="pt-2">Phone: {shipping.phone}</p>
              </div>
            </div>
            
            <div className="pt-6 border-t border-gray-100">
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-3">Billing Address</h3>
              <div className="text-sm text-gray-600 space-y-1">
                <p className="font-medium text-gray-900">{billing.full_name}</p>
                <p>{billing.address_line1}</p>
                {billing.address_line2 && <p>{billing.address_line2}</p>}
                <p>{billing.city}, {billing.state} {billing.pincode}</p>
                <p>{billing.country || 'India'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Return / Exchange Request Modal */}
      <ReturnRequestModal
        order={order}
        isOpen={isReturnOpen}
        onClose={() => setIsReturnOpen(false)}
      />

      {/* Printable Tax Invoice Modal */}
      <OrderInvoice
        order={order}
        isOpen={isInvoiceOpen}
        onClose={() => setIsInvoiceOpen(false)}
      />
    </div>
  );
}
