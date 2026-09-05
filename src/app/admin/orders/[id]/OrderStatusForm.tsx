'use client';

import React, { useState } from 'react';
import Button from '@/components/ui/CustomButton';
import { updateAdminOrderStatus } from '@/app/actions/admin/orders';

export default function OrderStatusForm({ order }: { order: { id: string; status: string; payment_status: string; fulfillment_status: string | null } }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    const formData = new FormData(e.currentTarget);
    const res = await updateAdminOrderStatus(order.id, formData);

    setLoading(false);
    if (res?.error) {
      setError(res.error);
    } else {
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
      <h2 className="font-bold text-gray-900 mb-4">Manage Order</h2>
      
      {error && <div className="text-red-500 text-sm mb-4 bg-red-50 p-2 rounded">{error}</div>}
      {success && <div className="text-green-600 text-sm mb-4 bg-green-50 p-2 rounded">Status updated successfully</div>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700">Order Status</label>
          <select 
            name="status" 
            defaultValue={order.status}
            className="w-full border-gray-300 rounded-md shadow-sm text-sm"
          >
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
            <option value="refunded">Refunded</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700">Payment Status</label>
          <select 
            name="payment_status" 
            defaultValue={order.payment_status}
            className="w-full border-gray-300 rounded-md shadow-sm text-sm"
          >
            <option value="pending">Pending</option>
            <option value="paid">Paid</option>
            <option value="failed">Failed</option>
            <option value="refunded">Refunded</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700">Fulfillment Status</label>
          <select 
            name="fulfillment_status" 
            defaultValue={order.fulfillment_status || 'unfulfilled'}
            className="w-full border-gray-300 rounded-md shadow-sm text-sm"
          >
            <option value="unfulfilled">Unfulfilled</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
          </select>
        </div>

        <Button type="submit" disabled={loading} className="w-full">
          {loading ? 'Updating...' : 'Update Order'}
        </Button>
      </form>
    </div>
  );
}
