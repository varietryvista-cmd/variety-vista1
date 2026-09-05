'use client';

import * as React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Search, Plus, Edit, ExternalLink, Package } from 'lucide-react';
import { formatPrice } from '@/lib/utils';

interface ProductRow {
  id: string;
  title: string;
  slug: string;
  gender: string;
  fit_type: string;
  status: 'active' | 'draft';
  price: number;
  sale_price?: number | null;
  bestseller?: boolean;
  new_arrival?: boolean;
  featured?: boolean;
  images?: { image_url: string }[];
  variants?: { stock_quantity: number }[];
  created_at?: string;
  updated_at?: string;
}

export default function ProductsTable({ products = [] }: { products: ProductRow[] }) {
  const [search, setSearch] = React.useState('');
  const [filterGender, setFilterGender] = React.useState('all');
  const [filterStatus, setFilterStatus] = React.useState('all');

  const filtered = React.useMemo(() => {
    return products.filter((p) => {
      const matchSearch =
        p.title.toLowerCase().includes(search.toLowerCase()) ||
        p.slug.toLowerCase().includes(search.toLowerCase());
      const matchGender = filterGender === 'all' || p.gender === filterGender;
      const matchStatus = filterStatus === 'all' || p.status === filterStatus;
      return matchSearch && matchGender && matchStatus;
    });
  }, [products, search, filterGender, filterStatus]);

  return (
    <div className="space-y-6">
      {/* Top Header & Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Products ({products.length})</h1>
          <p className="text-sm text-gray-500">Manage catalog inventory, pricing, and variants.</p>
        </div>
        <Link
          href="/admin/products/new"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-black text-white text-xs font-bold uppercase tracking-wider rounded-md hover:bg-gray-800 transition-colors"
        >
          <Plus className="w-4 h-4" /> Add Product
        </Link>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 bg-white p-4 rounded-lg border border-gray-200">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by product title or slug..."
            className="w-full h-10 pl-9 pr-3 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-black"
          />
        </div>
        <select
          value={filterGender}
          onChange={(e) => setFilterGender(e.target.value)}
          className="h-10 px-3 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-black bg-white"
        >
          <option value="all">All Genders</option>
          <option value="men">Men</option>
          <option value="women">Women</option>
          <option value="unisex">Unisex</option>
        </select>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="h-10 px-3 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-black bg-white"
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="draft">Draft</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-gray-600 text-xs uppercase font-semibold border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 w-16">Image</th>
                <th className="px-4 py-3">Product</th>
                <th className="px-4 py-3">Gender / Fit</th>
                <th className="px-4 py-3">Price</th>
                <th className="px-4 py-3">Stock</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-gray-500">
                    <Package className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                    No products matching your search.
                  </td>
                </tr>
              ) : (
                filtered.map((product) => {
                  const image = product.images?.[0]?.image_url;
                  const totalStock = (product.variants || []).reduce(
                    (sum, v) => sum + (v.stock_quantity || 0),
                    0
                  );

                  return (
                    <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3">
                        <div className="relative w-10 h-12 bg-gray-100 rounded overflow-hidden">
                          {image ? (
                            <Image src={image} alt={product.title} fill className="object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-[10px] text-gray-400">
                              N/A
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3 font-medium text-gray-900">
                        <div>{product.title}</div>
                        <div className="text-xs text-gray-400 font-mono">/{product.slug}</div>
                      </td>
                      <td className="px-4 py-3 text-gray-600 capitalize">
                        {product.gender} · {product.fit_type?.replace('_', ' ')}
                      </td>
                      <td className="px-4 py-3 font-semibold text-gray-900">
                        {formatPrice(product.price)}
                        {product.sale_price && (
                          <span className="ml-2 text-xs text-red-500 line-through">
                            {formatPrice(product.sale_price)}
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                            totalStock > 5
                              ? 'bg-green-100 text-green-800'
                              : totalStock > 0
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {totalStock} in stock
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium capitalize ${
                            product.status === 'active'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {product.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="inline-flex items-center gap-2">
                          <Link
                            href={`/products/${product.slug}`}
                            target="_blank"
                            className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded"
                            title="View on site"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </Link>
                          <Link
                            href={`/admin/products/${product.id}/edit`}
                            className="p-1.5 text-gray-600 hover:text-black hover:bg-gray-100 rounded font-medium inline-flex items-center gap-1 text-xs"
                          >
                            <Edit className="w-4 h-4" /> Edit
                          </Link>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
