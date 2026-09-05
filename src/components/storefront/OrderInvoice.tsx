'use client';

import * as React from 'react';
import { Printer, X } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import type { Order, OrderItem } from '@/types';

interface OrderInvoiceProps {
  order: Order;
  isOpen: boolean;
  onClose: () => void;
}

export default function OrderInvoice({ order, isOpen, onClose }: OrderInvoiceProps) {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const shipping = (order.shipping_address as Record<string, string>) || {};
  const isInterState = shipping.state && shipping.state.toLowerCase() !== 'maharashtra';
  const invoiceNumber = `INV-${order.order_number}`;
  const invoiceDate = new Date(order.created_at).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  // Calculate approximate GST (12% Apparel rate: 6% CGST + 6% SGST, or 12% IGST)
  const taxableAmount = Math.round((order.subtotal || order.total) / 1.12);
  const gstAmount = (order.subtotal || order.total) - taxableAmount;
  const halfGst = Math.round(gstAmount / 2);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 overflow-y-auto print:p-0 print:bg-white print:static">
      <div className="bg-white text-gray-900 max-w-3xl w-full p-8 md:p-12 shadow-2xl relative border border-gray-200 my-8 print:border-none print:shadow-none print:m-0 print:p-0">
        {/* Screen Action Bar (hidden in print) */}
        <div className="flex items-center justify-between border-b border-gray-200 pb-4 mb-6 print:hidden">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
              Tax Invoice Preview
            </span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-2 px-4 py-2 bg-black text-white text-xs font-bold uppercase tracking-wider rounded hover:bg-gray-800 transition-colors"
            >
              <Printer className="w-3.5 h-3.5" /> Print / Save PDF
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-gray-400 hover:text-gray-600 rounded"
              aria-label="Close invoice"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Invoice Printable Content */}
        <div className="space-y-6 text-xs text-gray-800">
          {/* Header */}
          <div className="flex items-start justify-between border-b-2 border-black pb-6">
            <div>
              <h1 className="text-2xl font-black uppercase tracking-tight text-black">
                Variety Vista
              </h1>
              <p className="font-semibold text-gray-600 mt-1 uppercase tracking-wider text-[10px]">
                Denim Studios Private Limited
              </p>
              <p className="text-gray-600 mt-1">Mumbai Maharashtra, India</p>
              <p className="text-gray-600">GSTIN: <strong className="text-black">27AAACV1234F1Z5</strong></p>
              <p className="text-gray-600">State: Maharashtra (Code: 27)</p>
            </div>
            <div className="text-right">
              <span className="inline-block px-3 py-1 bg-black text-white font-bold uppercase tracking-widest text-xs mb-2">
                TAX INVOICE
              </span>
              <p className="font-bold text-sm text-black">{invoiceNumber}</p>
              <p className="text-gray-600 mt-0.5">Date: {invoiceDate}</p>
              <p className="text-gray-600">Order ID: #{order.order_number}</p>
              <p className="text-gray-600 uppercase font-semibold text-[10px]">
                Payment: {order.payment_method} ({order.payment_status})
              </p>
            </div>
          </div>

          {/* Billing & Shipping Details */}
          <div className="grid grid-cols-2 gap-8 border-b border-gray-200 pb-6">
            <div>
              <h3 className="font-bold uppercase tracking-wider text-[11px] text-black mb-2">
                Billed / Shipped To:
              </h3>
              <p className="font-bold text-gray-900">{shipping.full_name || shipping.first_name || 'Customer'}</p>
              <p className="text-gray-600">{shipping.address_line1 || shipping.address}</p>
              <p className="text-gray-600">{shipping.city}, {shipping.state} - {shipping.pincode}</p>
              <p className="text-gray-600">Phone: {shipping.phone}</p>
              <p className="text-gray-600">Place of Supply: {shipping.state || 'Maharashtra'}</p>
            </div>
            <div className="text-right">
              <h3 className="font-bold uppercase tracking-wider text-[11px] text-black mb-2">
                Dispatch Details:
              </h3>
              <p className="text-gray-600">Courier: {order.courier_name || 'Shiprocket Logistics'}</p>
              <p className="text-gray-600">AWB No: {order.awb_code || 'Pending'}</p>
              <p className="text-gray-600">Reverse Pickup Window: 7 Days</p>
            </div>
          </div>

          {/* Items Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-300 bg-gray-50 text-[10px] font-bold uppercase tracking-wider text-gray-700">
                  <th className="py-2.5 px-3">#</th>
                  <th className="py-2.5 px-3">Description of Goods</th>
                  <th className="py-2.5 px-3">HSN Code</th>
                  <th className="py-2.5 px-3 text-center">Qty</th>
                  <th className="py-2.5 px-3 text-right">Rate</th>
                  <th className="py-2.5 px-3 text-right">Taxable Value</th>
                  <th className="py-2.5 px-3 text-right">Total (₹)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {(order.items || []).map((item: OrderItem, index: number) => {
                  const lineTotal = item.line_total || (item.unit_price || 0) * (item.quantity || 1);
                  const itemTaxable = Math.round(lineTotal / 1.12);
                  return (
                    <tr key={item.id || index}>
                      <td className="py-3 px-3 text-gray-500">{index + 1}</td>
                      <td className="py-3 px-3 font-semibold text-black">
                        <div>{item.title}</div>
                        {item.waist_size && (
                          <div className="text-[10px] text-gray-500 font-normal">
                            Waist Size: {item.waist_size}
                          </div>
                        )}
                      </td>
                      <td className="py-3 px-3 text-gray-600 font-mono text-[11px]">6203.42.00</td>
                      <td className="py-3 px-3 text-center font-bold">{item.quantity}</td>
                      <td className="py-3 px-3 text-right">{formatPrice(item.unit_price || 0)}</td>
                      <td className="py-3 px-3 text-right">{formatPrice(itemTaxable)}</td>
                      <td className="py-3 px-3 text-right font-bold">{formatPrice(lineTotal)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Tax Breakdown & Totals */}
          <div className="border-t-2 border-black pt-4 flex flex-col sm:flex-row justify-between gap-6">
            <div className="max-w-xs text-gray-500 space-y-1">
              <p className="font-bold text-black uppercase text-[10px] tracking-wider">Tax Summary Breakdown:</p>
              {isInterState ? (
                <p>Integrated GST (IGST @ 12%): <strong className="text-black">{formatPrice(gstAmount)}</strong></p>
              ) : (
                <>
                  <p>Central GST (CGST @ 6%): <strong className="text-black">{formatPrice(halfGst)}</strong></p>
                  <p>State GST (SGST @ 6%): <strong className="text-black">{formatPrice(halfGst)}</strong></p>
                </>
              )}
              <p className="text-[10px] text-gray-400 pt-2">
                This is a computer-generated tax invoice and requires no physical signature under Indian IT Act.
              </p>
            </div>

            <div className="w-64 space-y-2 text-right">
              <div className="flex justify-between text-gray-600">
                <span>Taxable Subtotal</span>
                <span>{formatPrice(taxableAmount)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Total GST (12%)</span>
                <span>{formatPrice(gstAmount)}</span>
              </div>
              {order.discount_amount > 0 && (
                <div className="flex justify-between text-green-700 font-medium">
                  <span>Discount</span>
                  <span>-{formatPrice(order.discount_amount)}</span>
                </div>
              )}
              <div className="flex justify-between text-gray-600">
                <span>Shipping Charges</span>
                <span>{order.shipping_cost === 0 ? 'FREE' : formatPrice(order.shipping_cost)}</span>
              </div>
              <div className="border-t border-black pt-2 flex justify-between font-black text-base text-black">
                <span>Invoice Total</span>
                <span>{formatPrice(order.total)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
