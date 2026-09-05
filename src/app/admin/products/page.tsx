import { Metadata } from 'next';
import { Suspense } from 'react';
import ProductsTable from '@/components/admin/ProductsTable';
import { getAdminProducts } from '@/app/actions/admin/products';

export const metadata: Metadata = {
  title: 'Products | Admin',
};

export default async function AdminProductsPage() {
  const { data: products } = await getAdminProducts();
  
  return (
    <div>
      <Suspense fallback={<ProductsTableSkeleton />}>
        <ProductsTable products={products as ProductRow[]} />
      </Suspense>
    </div>
  );
}

type ProductRow = {
  id: string;
  title: string;
  slug: string;
  gender: string;
  fit_type: string;
  status: 'active' | 'draft';
  price: number;
  sale_price?: number | null;
  bestseller: boolean;
  new_arrival: boolean;
  featured: boolean;
  images: { image_url: string }[];
  variants: { stock_quantity: number }[];
  created_at: string;
  updated_at: string;
};

function ProductRowSkeleton() {
  return (
    <tr>
      <td className="px-4 py-4"><div className="w-4 h-4 bg-gray-200 rounded animate-pulse"></div></td>
      <td className="px-4 py-4"><div className="w-10 h-12 bg-gray-200 rounded animate-pulse"></div></td>
      <td className="px-4 py-4"><div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div></td>
      <td className="px-4 py-4"><div className="h-4 w-20 bg-gray-200 rounded animate-pulse"></div></td>
      <td className="px-4 py-4"><div className="h-4 w-16 bg-gray-200 rounded animate-pulse"></div></td>
      <td className="px-4 py-4"><div className="h-4 w-16 bg-gray-200 rounded animate-pulse"></div></td>
      <td className="px-4 py-4"><div className="h-4 w-16 bg-gray-200 rounded animate-pulse"></div></td>
      <td className="px-4 py-4"><div className="h-4 w-20 bg-gray-200 rounded animate-pulse"></div></td>
      <td className="px-4 py-4"><div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div></td>
      <td className="px-4 py-4"><div className="h-4 w-20 bg-gray-200 rounded animate-pulse"></div></td>
      <td className="px-4 py-4"><div className="h-4 w-20 bg-gray-200 rounded animate-pulse"></div></td>
    </tr>
  );
}

function ProductsTableSkeleton() {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-gray-50 text-gray-500 text-sm">
            <th className="px-4 py-3 font-medium w-12"></th>
            <th className="px-4 py-3 font-medium">Product</th>
            <th className="px-4 py-3 font-medium">Gender</th>
            <th className="px-4 py-3 font-medium">Fit</th>
            <th className="px-4 py-3 font-medium">Status</th>
            <th className="px-4 py-3 font-medium">Price</th>
            <th className="px-4 py-3 font-medium">Created</th>
            <th className="px-4 py-3 font-medium">Stock</th>
            <th className="px-4 py-3 font-medium">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {[...Array(5)].map((_, i) => <ProductRowSkeleton key={i} />)}
        </tbody>
      </table>
    </div>
  );
}