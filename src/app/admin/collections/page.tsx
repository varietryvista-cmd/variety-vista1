import { Metadata } from 'next';
import Link from 'next/link';
import { Plus, Edit } from 'lucide-react';
import Button from '@/components/ui/CustomButton';
import { getAdminCollections } from '@/app/actions/admin/collections';

export const metadata: Metadata = {
  title: 'Collections | Admin',
};

export default async function AdminCollectionsPage() {
  const { data: collections } = await getAdminCollections();

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Collections</h1>
        <Link href="/admin/collections/new">
          <Button className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Add Collection
          </Button>
        </Link>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-500 text-sm">
                <th className="px-6 py-3 font-medium">Title</th>
                <th className="px-6 py-3 font-medium">Slug</th>
                <th className="px-6 py-3 font-medium">Status</th>
                <th className="px-6 py-3 font-medium">Products</th>
                <th className="px-6 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {collections?.map((col: { id: string; title: string; slug: string; is_active: boolean; collection_products?: { count: number }[] }) => (
                <tr key={col.id} className="text-gray-900">
                  <td className="px-6 py-4 font-medium">{col.title}</td>
                  <td className="px-6 py-4 text-gray-500">{col.slug}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      col.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {col.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4">{col.collection_products?.[0]?.count || 0}</td>
                  <td className="px-6 py-4">
                    <Link href={`/admin/collections/${col.id}/edit`} className="text-sm text-blue-600 hover:underline flex items-center gap-1">
                      <Edit className="w-4 h-4" /> Edit
                    </Link>
                  </td>
                </tr>
              ))}
              {(!collections || collections.length === 0) && (
                <tr>
                  <td colSpan={5} className="py-16 text-center">
                    <div className="flex flex-col items-center justify-center text-gray-500">
                      <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                        </svg>
                      </div>
                      <p className="font-medium text-gray-900 mb-1">No collections found</p>
                      <p className="text-sm mb-4">Create your first collection to group products together.</p>
                      <Link href="/admin/collections/new">
                        <Button variant="outline" className="flex items-center gap-2">
                          <Plus className="w-4 h-4" />
                          Add Collection
                        </Button>
                      </Link>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
