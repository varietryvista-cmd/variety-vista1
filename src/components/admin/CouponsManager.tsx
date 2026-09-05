'use client';

import * as React from 'react';
import { Plus, Tag, Search, Trash2, CheckCircle2, XCircle, X } from 'lucide-react';
import { createAdminCoupon, toggleAdminCoupon, deleteAdminCoupon } from '@/app/actions/admin/coupons';
import { formatPrice } from '@/lib/utils';
import type { Coupon } from '@/types';

export default function CouponsManager({ initialCoupons = [] }: { initialCoupons: Coupon[] }) {
  const [coupons, setCoupons] = React.useState<Coupon[]>(initialCoupons);
  const [search, setSearch] = React.useState('');
  const [filterStatus, setFilterStatus] = React.useState('all');
  const [isCreateOpen, setIsCreateOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  // Form State
  const [formData, setFormData] = React.useState({
    code: '',
    type: 'percentage' as 'percentage' | 'fixed',
    value: 10,
    min_order_amount: 1500,
    usage_limit: '',
    valid_to: '',
  });

  const filteredCoupons = React.useMemo(() => {
    return coupons.filter((c) => {
      const matchSearch = c.code.toLowerCase().includes(search.toLowerCase());
      const matchStatus =
        filterStatus === 'all' ||
        (filterStatus === 'active' ? c.is_active : !c.is_active);
      return matchSearch && matchStatus;
    });
  }, [coupons, search, filterStatus]);

  const handleToggle = async (coupon: Coupon) => {
    const nextStatus = !coupon.is_active;
    setCoupons((prev) =>
      prev.map((c) => (c.id === coupon.id ? { ...c, is_active: nextStatus } : c))
    );
    await toggleAdminCoupon(coupon.id, nextStatus);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this coupon?')) return;
    setCoupons((prev) => prev.filter((c) => c.id !== id));
    await deleteAdminCoupon(id);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const result = await createAdminCoupon({
      code: formData.code,
      type: formData.type,
      value: Number(formData.value),
      min_order_amount: Number(formData.min_order_amount) || 0,
      usage_limit: formData.usage_limit ? Number(formData.usage_limit) : undefined,
      valid_to: formData.valid_to || undefined,
    });

    if (result.error) {
      setError(result.error);
      setLoading(false);
      return;
    }

    // Add locally and close
    const newCoupon: Coupon = {
      id: 'temp-' + Date.now(),
      code: formData.code.trim().toUpperCase(),
      type: formData.type,
      value: Number(formData.value),
      min_order_amount: Number(formData.min_order_amount) || 0,
      usage_limit: formData.usage_limit ? Number(formData.usage_limit) : undefined,
      per_customer_limit: 1,
      times_used: 0,
      valid_to: formData.valid_to || undefined,
      is_active: true,
      created_at: new Date().toISOString(),
    };

    setCoupons([newCoupon, ...coupons]);
    setIsCreateOpen(false);
    setFormData({
      code: '',
      type: 'percentage',
      value: 10,
      min_order_amount: 1500,
      usage_limit: '',
      valid_to: '',
    });
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Coupons & Discounts ({coupons.length})</h1>
          <p className="text-sm text-gray-500">Manage promotional codes, discount thresholds, and campaigns.</p>
        </div>
        <button
          onClick={() => setIsCreateOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-black text-white text-xs font-bold uppercase tracking-wider rounded-md hover:bg-gray-800 transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" /> Create Coupon
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 bg-white p-4 rounded-lg border border-gray-200">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search coupon code (e.g. WELCOME15)..."
            className="w-full h-10 pl-9 pr-3 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-black uppercase placeholder:normal-case font-medium"
          />
        </div>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="h-10 px-3 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-black bg-white"
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      {/* Coupons Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-gray-600 text-xs uppercase font-semibold border-b border-gray-200">
              <tr>
                <th className="px-5 py-3.5">Code</th>
                <th className="px-5 py-3.5">Discount</th>
                <th className="px-5 py-3.5">Min Order</th>
                <th className="px-5 py-3.5">Usage</th>
                <th className="px-5 py-3.5">Valid Until</th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredCoupons.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-gray-500">
                    <Tag className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                    No coupon codes found. Click &quot;Create Coupon&quot; to add one.
                  </td>
                </tr>
              ) : (
                filteredCoupons.map((coupon) => (
                  <tr key={coupon.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-4 font-bold text-gray-900 font-mono tracking-wider text-base">
                      {coupon.code}
                    </td>
                    <td className="px-5 py-4 font-semibold text-gray-900">
                      {coupon.type === 'percentage' ? `${coupon.value}% OFF` : `${formatPrice(coupon.value)} OFF`}
                    </td>
                    <td className="px-5 py-4 text-gray-600 font-medium">
                      {coupon.min_order_amount ? formatPrice(coupon.min_order_amount) : 'None'}
                    </td>
                    <td className="px-5 py-4 text-gray-600 font-medium">
                      {coupon.times_used || 0}
                      {coupon.usage_limit ? ` / ${coupon.usage_limit}` : ' (Unlimited)'}
                    </td>
                    <td className="px-5 py-4 text-gray-500 text-xs">
                      {coupon.valid_to ? new Date(coupon.valid_to).toLocaleDateString('en-IN') : 'No Expiry'}
                    </td>
                    <td className="px-5 py-4">
                      <button
                        onClick={() => handleToggle(coupon)}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold transition-colors ${
                          coupon.is_active
                            ? 'bg-green-100 text-green-800 hover:bg-green-200'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        {coupon.is_active ? (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5 text-green-600" /> Active
                          </>
                        ) : (
                          <>
                            <XCircle className="w-3.5 h-3.5 text-gray-400" /> Inactive
                          </>
                        )}
                      </button>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <button
                        onClick={() => handleDelete(coupon.id)}
                        className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                        title="Delete coupon"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Coupon Modal */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-lg max-w-lg w-full p-6 shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <h2 className="text-lg font-bold text-gray-900">Create New Coupon</h2>
              <button
                onClick={() => setIsCreateOpen(false)}
                className="p-1 text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {error && (
              <div className="p-3 bg-red-50 text-red-700 text-xs font-semibold rounded">
                {error}
              </div>
            )}

            <form onSubmit={handleCreate} className="space-y-4 text-sm">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                  Coupon Code *
                </label>
                <input
                  type="text"
                  required
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  placeholder="e.g. SUMMER20"
                  className="w-full h-10 px-3 border border-gray-200 rounded-md font-mono uppercase font-bold text-gray-900 focus:outline-none focus:ring-1 focus:ring-black"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                    Discount Type *
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as 'percentage' | 'fixed' })}
                    className="w-full h-10 px-3 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-black bg-white"
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed Amount (₹)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                    Value *
                  </label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={formData.value}
                    onChange={(e) => setFormData({ ...formData, value: Number(e.target.value) })}
                    className="w-full h-10 px-3 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-black"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                    Min Order Value (₹)
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={formData.min_order_amount}
                    onChange={(e) => setFormData({ ...formData, min_order_amount: Number(e.target.value) })}
                    className="w-full h-10 px-3 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-black"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                    Usage Limit (Optional)
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={formData.usage_limit}
                    onChange={(e) => setFormData({ ...formData, usage_limit: e.target.value })}
                    placeholder="Unlimited"
                    className="w-full h-10 px-3 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-black"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                  Expiry Date (Optional)
                </label>
                <input
                  type="date"
                  value={formData.valid_to}
                  onChange={(e) => setFormData({ ...formData, valid_to: e.target.value })}
                  className="w-full h-10 px-3 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-black"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsCreateOpen(false)}
                  className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-gray-600 hover:bg-gray-100 rounded-md"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2 text-xs font-bold uppercase tracking-wider bg-black text-white rounded-md hover:bg-gray-800 transition-colors disabled:opacity-50"
                >
                  {loading ? 'Creating...' : 'Save Coupon'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
