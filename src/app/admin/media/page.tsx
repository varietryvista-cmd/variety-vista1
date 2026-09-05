import { Metadata } from 'next';
import Button from '@/components/ui/CustomButton';
import { Upload } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Media Library | Admin',
};

export default function AdminMediaPage() {
  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Media Library</h1>
          <p className="text-gray-500 mt-1">Manage images and assets.</p>
        </div>
        <Button className="flex items-center gap-2">
          <Upload className="w-4 h-4" />
          Upload Files
        </Button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-12 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
          <Upload className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-1">No media found</h3>
        <p className="text-gray-500 max-w-sm mx-auto">
          Upload images here to use them in your products and collections. Supabase storage integration pending.
        </p>
      </div>
    </div>
  );
}
