'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { formatPrice } from '@/lib/utils';
import { format } from 'date-fns';
import {
  Truck,
  Package,
  CreditCard,
  ChevronUp,
  ChevronDown,
  Check,
  X,
  RefreshCw,
  Truck as TruckIcon,
  DollarSign,
  Clock,
  Printer,
  FileText,
} from 'lucide-react';
import Button from '@/components/ui/CustomButton';

interface OrderItem {
  id: string;
  title: string;
  unit_price: number;
  quantity: number;
  line_total: number;
  waist_size?: string;
  variant?: { sku: string; waist_size?: string; inseam_length?: string; colour?: string; colour_id?: string; images?: { image_url: string }[] };
  product?: { images: { image_url: string }[] };
}

interface ShippingAddress {
  full_name: string;
  address_line1: string;
  address_line2?: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
  phone: string;
}

interface Order {
  id: string;
  order_number: string;
  created_at: string;
  email: string;
  shipping_address: ShippingAddress;
  billing_address: ShippingAddress;
  shipping_method: string;
  shipping_cost: number;
  subtotal: number;
  discount_amount: number;
  tax_amount: number;
  total: number;
  coupon_code: string;
  payment_method: string;
  payment_status: string;
  fulfillment_status: string;
  razorpay_order_id: string;
  razorpay_payment_id: string;
  shiprocket_order_id: number;
  shiprocket_shipment_id: number;
  awb_code: string;
  courier_name: string;
  tracking_status: string;
  estimated_delivery_date: string;
  notes: string;
  items: OrderItem[];
  timeline: { id: string; status: string; note: string; created_at: string }[];
}

interface ShiprocketTrackResponse {
  tracking_data: {
    shipment_status: number;
    shipment_track: Array<{
      date: string;
      activity: string;
      location: string;
      status: string;
    }>;
  };
}

export default function AdminOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'details' | 'timeline' | 'shipment' | 'payments'>('details');
  const [shippingLoading, setShippingLoading] = useState(false);
  const [tracking, setTracking] = useState<any>(null);
  const [shipmentId, setShipmentId] = useState<string | null>(null);
  const [awbCode, setAwbCode] = useState<string>('');

  // Fetch order on mount
  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const { id } = await params;
        const response = await fetch(`/api/admin/orders/${id}`);
        if (!response.ok) throw new Error('Failed to fetch order');
        const _data = await response.json();
        if (data.error) throw new Error(data.error);
        setOrder(data);
        if (data.shiprocket_shipment_id) {
          setShipmentId(data.shiprocket_shipment_id.toString());
        }
        if (data.awb_code) {
          setAwbCode(data.awb_code);
        }
      } catch (_e) {
        setError('Failed to load order');
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [params]);

  const handleShipOrder = async () => {
    if (!order) return;
    
    const confirmShip = window.confirm(
      `Ship order ${order.order_number}? This will create a shipment with Shiprocket.`
    );
    if (!confirmShip) return;

    setShippingLoading(true);
    try {
      const response = await fetch(`/api/admin/orders/${order.id}/ship`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          pickup_pincode: process.env.SHIPROCKET_PICKUP_PINCODE,
          weight: order.items.reduce((sum, item) => sum + ((item.variant as any)?.weight || 0.5) * item.quantity, 0),
        }),
      });
      
      if (!response.ok) throw new Error('Failed to create shipment');
      
      const _data = await response.json();
      window.alert(`Shipment created! AWB: ${data.awb_code}`);
      router.refresh();
    } catch (_e) {
      window.alert('Failed to create shipment: ' + (e as Error).message);
    } finally {
      setShippingLoading(false);
    }
  };

  const handleGenerateAWB = async () => {
    if (!order?.shiprocket_shipment_id) return;
    
    try {
      const response = await fetch(`/api/admin/orders/${order.id}/generate-awb`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ shipment_id: order.shiprocket_shipment_id }),
      });
      
      if (!response.ok) throw new Error('Failed to generate AWB');
      
      const _data = await response.json();
      window.alert(`AWB generated: ${data.awb_code}`);
      router.refresh();
    } catch (_e) {
      window.alert('Failed to generate AWB: ' + (e as Error).message);
    }
  };

  const handleSchedulePickup = async () => {
    if (!order?.shiprocket_shipment_id) return;
    
    try {
      const response = await fetch(`/api/admin/orders/${order.id}/schedule-pickup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ shipment_id: order.shiprocket_shipment_id }),
      });
      
      if (!response.ok) throw new Error('Failed to schedule pickup');
      
      const _data = await response.json();
      window.alert('Pickup scheduled successfully!');
      router.refresh();
    } catch (_e) {
      window.alert('Failed to schedule pickup: ' + (e as Error).message);
    }
  };

  const handleTrackShipment = async () => {
    if (!order?.awb_code) return;
    
    try {
      const response = await fetch(`/api/admin/orders/${order.id}/track`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ awb_code: order.awb_code }),
      });
      
      if (!response.ok) throw new Error('Failed to track shipment');
      
      const _data = await response.json();
      setTracking(data.tracking_data);
    } catch (_e) {
      window.alert('Failed to track shipment: ' + (e as Error).message);
    }
  };

  const handlePrintLabel = async () => {
    if (!order?.awb_code) return;
    
    try {
      const response = await fetch(`/api/admin/orders/${order.id}/label`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ awb_code: order.awb_code }),
      });
      
      if (!response.ok) throw new Error('Failed to generate label');
      
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      window.open(url, '_blank');
    } catch (_e) {
      window.alert('Failed to generate label: ' + (e as Error).message);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#111] border-t-transparent"></div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-red-500 mb-4">Failed to load order</p>
          <Button onClick={() => router.refresh()}>Retry</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Order #{order.order_number || order.id.slice(0, 8)}</h1>
          <p className="text-gray-500 mt-1">Placed on {format(new Date(order.created_at), 'MMMM d, yyyy')}</p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/admin/orders" className="text-sm text-gray-500 hover:text-gray-700">← Back to Orders</Link>
          <Button variant="outline" onClick={() => router.refresh()}>
            <RefreshCw className="w-4 h-4 mr-2" /> Refresh
          </Button>
        </div>
      </div>

      {/* Status Header */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <p className="text-sm text-gray-500 mb-1">Order Status</p>
          <div className="flex items-center gap-2">
            <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
              order.fulfillment_status === 'delivered' ? 'bg-green-100 text-green-800' :
              order.fulfillment_status === 'cancelled' ? 'bg-red-100 text-red-800' :
              order.fulfillment_status === 'shipped' ? 'bg-blue-100 text-blue-800' :
              order.fulfillment_status === 'processing' ? 'bg-blue-100 text-blue-800' :
              order.fulfillment_status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
              'bg-gray-100 text-gray-800'
            }`}>
              {(order.fulfillment_status || 'pending').charAt(0).toUpperCase() + (order.fulfillment_status || 'pending').slice(1)}
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <p className="text-sm text-gray-500 mb-1">Payment Status</p>
          <p className="font-semibold capitalize">{order.payment_status}</p>
        </div>
        
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <p className="text-sm text-gray-500 mb-1">Payment Method</p>
          <p className="font-semibold capitalize">{order.payment_method}</p>
        </div>
        
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <p className="text-sm text-gray-500 mb-1">Total</p>
          <p className="text-2xl font-bold">{formatPrice(order.total)}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="mt-8 border-b border-gray-200">
        <nav className="flex gap-8" aria-label="Order tabs">
          {(['details', 'timeline', 'shipment', 'payments'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as typeof activeTab)}
              className={`py-3 px-2 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab
                  ? 'border-[#111] text-[#111]'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </nav>
      </div>

      <div className="mt-6">
          {activeTab === 'details' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Order Items */}
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                  <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                    <h2 className="font-bold text-gray-900">Order Items</h2>
                  </div>
                  <div className="divide-y divide-gray-200 p-6">
                    {order.items?.map((item: OrderItem) => {
                      const product = item.product || item.variant;
                      const imageUrl = item.variant?.images?.[0]?.image_url || item.product?.images?.[0]?.image_url;
                      
                      return (
                        <div key={item.id} className="flex gap-4 py-4 first:pt-0 last:pb-0">
                          <div className="w-16 h-20 bg-gray-100 rounded-md relative overflow-hidden shrink-0">
                            {item.variant?.images?.[0]?.image_url ? (
                              <Image src={item.variant.images[0].image_url} alt={item.title} fill className="object-cover" />
                            ) : item.product?.images?.[0]?.image_url ? (
                              <Image src={item.product.images[0].image_url} alt={item.title} fill className="object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-gray-400">
                                <Package className="w-8 h-8" />
                              </div>
                            )}
                          </div>
                          <div className="flex-1 flex flex-col justify-center">
                            <p className="font-medium text-gray-900">{item.title}</p>
                            <p className="text-sm text-gray-500">
                              SKU: {item.variant?.sku} | Size: {item.waist_size || item.variant?.waist_size}
                            </p>
                            <p className="text-sm text-gray-500 mt-1">
                              {formatPrice(item.unit_price)} × {item.quantity}
                            </p>
                          </div>
                          <div className="text-right font-medium text-gray-900">
                            {formatPrice(item.line_total)}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <div className="bg-gray-50 p-6 border-t border-gray-200">
                    <div className="flex justify-between py-1 text-sm text-gray-600">
                      <span>Subtotal</span>
                      <span>{formatPrice(order.subtotal)}</span>
                    </div>
                    <div className="flex justify-between py-1 text-sm text-gray-600">
                      <span>Shipping</span>
                      <span>{formatPrice(order.shipping_cost)}</span>
                    </div>
                    <div className="flex justify-between py-2 font-bold text-lg border-t border-gray-200 mt-2">
                      <span>Total</span>
                      <span>{formatPrice(order.total)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Customer & Shipping Info */}
              <div className="space-y-6">
                  <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                    <h2 className="font-bold text-gray-900 mb-4">Customer Details</h2>
                    <div className="text-sm space-y-2">
                      <p><span className="font-medium">Name:</span> {order.shipping_address?.full_name}</p>
                      <p><span className="font-medium">Email:</span> {order.email}</p>
                      <p><span className="font-medium">Phone:</span> {order.shipping_address?.phone}</p>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                    <h2 className="font-bold text-gray-900 mb-4">Shipping Address</h2>
                    <div className="text-sm text-gray-600 space-y-1">
                      <p>{order.shipping_address?.address_line1}</p>
                      {order.shipping_address?.address_line2 && <p>{order.shipping_address.address_line2}</p>}
                      <p>{order.shipping_address?.city}, {order.shipping_address?.state} {order.shipping_address?.pincode}</p>
                      <p>{order.shipping_address?.country}</p>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                    <h2 className="font-bold text-gray-900 mb-4">Billing Address</h2>
                    <div className="text-sm text-gray-600 space-y-1">
                      <p>{order.billing_address?.full_name}</p>
                      <p>{order.billing_address?.address_line1}</p>
                      {order.billing_address?.address_line2 && <p>{order.billing_address.address_line2}</p>}
                      <p>{order.billing_address?.city}, {order.billing_address?.state} {order.billing_address?.pincode}</p>
                      <p>{order.billing_address?.country}</p>
                    </div>
                  </div>

                {/* Timeline */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                  <h2 className="font-bold text-gray-900 mb-4">Order Timeline</h2>
                  <div className="space-y-4">
                    {order.timeline?.map((event: { id: string; status: string; note: string; created_at: string }) => (
                      <div key={event.id} className="flex gap-4">
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                          <Clock className="w-4 h-4 text-gray-400" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">{event.status}</p>
                          <p className="text-sm text-gray-500">{event.note}</p>
                          <p className="text-xs text-gray-400 mt-1">{format(new Date(event.created_at), 'MMM d, yyyy h:mm a')}</p>
                        </div>
                      </div>
                    ))}
                    {(!order.timeline || order.timeline.length === 0) && (
                      <p className="text-center text-gray-500 py-8">No timeline events</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

            {/* Timeline Tab */}
            {activeTab === 'timeline' && (
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                <h2 className="font-bold text-gray-900 mb-6">Order Timeline</h2>
                <div className="space-y-6">
                  {order.timeline?.map((event: { id: string; status: string; note: string; created_at: string; created_by?: string }) => (
                    <div key={event.id} className="flex gap-4">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                        <Clock className="w-4 h-4 text-gray-400" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{event.status}</p>
                        <p className="text-gray-600">{event.note}</p>
                        <p className="text-xs text-gray-400 mt-1">{format(new Date(event.created_at), 'MMM d, yyyy h:mm a')}</p>
                      </div>
                    </div>
                  ))}
                  {(!order.timeline || order.timeline.length === 0) && (
                    <p className="text-center text-gray-500 py-8">No timeline events</p>
                  )}
                </div>
              </div>
            )}

            {/* Shipment Tab */}
            {activeTab === 'shipment' && (
              <div className="space-y-6">
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                  <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Truck className="w-5 h-5 text-[#111]" />
                    Shiprocket Shipment
                  </h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-500 mb-1">Shipment ID</p>
                      <p className="font-mono font-medium">{order.shiprocket_shipment_id || 'Not created'}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-500 mb-1">AWB Code</p>
                      <p className="font-mono font-medium">{order.awb_code || 'Not generated'}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-500 mb-1">Courier</p>
                      <p className="font-medium">{order.courier_name || 'Not assigned'}</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {order.awb_code ? (
                      <div>
                        <div className="flex items-center gap-3 flex-wrap">
                          <span className="font-mono text-sm text-gray-600">AWB: {order.awb_code}</span>
                          <Button onClick={handleTrackShipment}>
                            <Truck className="w-4 h-4 mr-2" /> Track Shipment
                          </Button>
                          <Button variant="outline" onClick={handlePrintLabel}>
                            <Printer className="w-4 h-4 mr-2" /> Print Label
                          </Button>
                        </div>
                        
                        {tracking && (
                          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                            <h4 className="font-medium mb-3">Tracking History</h4>
                            <div className="space-y-2">
                              {tracking?.shipment_track?.map((track: any, idx: number) => (
                                <div key={idx} className="flex gap-3 p-3 bg-white rounded-lg border border-gray-100">
                                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                                    <Truck className="w-4 h-4 text-gray-400" />
                                  </div>
                                  <div className="flex-1">
                                    <p className="font-medium text-gray-900">{track.activity}</p>
                                    <p className="text-sm text-gray-500">{track.location}</p>
                                    <p className="text-xs text-gray-400">{track.date}</p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">Shipment not created</h3>
                        <p className="text-gray-500 mb-4">Create a shipment to generate AWB and track shipment</p>
                        <Button onClick={handleShipOrder} disabled={shippingLoading}>
                          <Truck className="w-4 h-4 mr-2" />
                          {shippingLoading ? 'Creating...' : 'Create Shipment'}
                        </Button>
                      </div>
                    )}
                  </div>

                    {/* Generate AWB & Pickup */}
                    {order.shiprocket_shipment_id && !order.awb_code && (
                      <div className="mt-4 p-4 bg-blue-50 border border-blue-100 rounded-lg">
                        <p className="text-sm text-blue-700 mb-3">Shipment created but AWB not generated yet</p>
                        <div className="flex gap-3">
                          <Button onClick={handleGenerateAWB}>
                            <FileText className="w-4 h-4 mr-2" /> Generate AWB
                          </Button>
                          <Button variant="outline" onClick={handleSchedulePickup}>
                            <Truck className="w-4 h-4 mr-2" /> Schedule Pickup
                          </Button>
                        </div>
                      </div>
                    )}

                    {order.awb_code && !tracking && (
                      <div className="mt-4 p-4 bg-yellow-50 border border-yellow-100 rounded-lg">
                        <p className="text-sm text-yellow-700 mb-3">AWB generated but tracking not loaded</p>
                        <Button onClick={handleTrackShipment}>
                          <Truck className="w-4 h-4 mr-2" /> Track Shipment
                        </Button>
                      </div>
                    )}

                    {/* Print Label */}
                    {order.awb_code && (
                      <div className="mt-4 pt-4 border-t">
                        <Button variant="outline" onClick={handlePrintLabel}>
                          <Printer className="w-4 h-4 mr-2" /> Print Shipping Label
                        </Button>
                      </div>
                    )}
                  </div>

                  {/* Payment Status */}
                  <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                    <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <CreditCard className="w-5 h-5 text-[#111]" />
                      Payment Information
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                        <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center shrink-0">
                          <CreditCard className="w-5 h-5 text-purple-600" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Payment Method</p>
                          <p className="font-semibold text-[#111] capitalize">{order.payment_method}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                        <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
                          <DollarSign className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Total Paid</p>
                          <p className="font-semibold text-[#111]">{formatPrice(order.total)}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                        <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center shrink-0">
                          <Truck className="w-5 h-5 text-green-600" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Order Status</p>
                          <p className="font-semibold text-[#111] capitalize">{order.fulfillment_status || 'pending'}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

            {/* Payments Tab */}
            {activeTab === 'payments' && (
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                <h2 className="font-bold text-gray-900 mb-4">Payment Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-500 mb-1">Payment Method</p>
                    <p className="font-semibold capitalize">{order.payment_method}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-500 mb-1">Payment Status</p>
                    <p className={`font-semibold capitalize ${order.payment_status === 'paid' ? 'text-green-600' : order.payment_status === 'failed' ? 'text-red-600' : 'text-yellow-600'}`}>
                      {order.payment_status}
                    </p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-500 mb-1">Razorpay Order ID</p>
                    <p className="font-mono text-sm text-gray-900">{order.razorpay_order_id || 'N/A'}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-500 mb-1">Razorpay Payment ID</p>
                    <p className="font-mono text-sm text-gray-900">{order.razorpay_payment_id || 'N/A'}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-500 mb-1">Total Paid</p>
                    <p className="font-semibold">{formatPrice(order.total)}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Settings Tab - Not implemented yet */}
          </div>
        </div>
      );
    }