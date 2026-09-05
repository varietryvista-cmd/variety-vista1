'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/components/ui/CustomButton';
import CustomInput from '@/components/ui/CustomInput';
import { createAdminCollection, updateAdminCollection } from '@/app/actions/admin/collections';

export default function CollectionForm({ collection }: { collection?: { id: string; title: string; slug: string; description?: string | null; image_url?: string | null; is_active: boolean } }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    const formData = new FormData(e.currentTarget);
    
    // Check checkboxes
    if (!formData.has('is_active')) {
      formData.append('is_active', 'false');
    } else if (formData.get('is_active') === 'on') {
      formData.set('is_active', 'true');
    }

    let res;
    if (collection) {
      res = await updateAdminCollection(collection.id, formData);
    } else {
      res = await createAdminCollection(formData);
    }

    setLoading(false);
    if (res?.error) {
      setError(res.error);
    } else {
      router.push('/admin/collections');
      router.refresh();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl bg-white p-6 rounded-xl border border-gray-200">
      {error && <div className="text-red-500 bg-red-50 p-3 rounded-md">{error}</div>}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium mb-1">Title</label>
          <CustomInput name="title" defaultValue={collection?.title} required />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Slug</label>
          <CustomInput name="slug" defaultValue={collection?.slug} required />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Description</label>
        <textarea 
          name="description" 
          defaultValue={collection?.description || ''}
          rows={3}
          className="w-full border-gray-300 rounded-md shadow-sm focus:border-black focus:ring-black"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Image URL</label>
        <CustomInput type="url" name="image_url" defaultValue={collection?.image_url || ''} />
      </div>

      <div>
        <label className="flex items-center gap-2">
          <input type="checkbox" name="is_active" defaultChecked={collection ? collection.is_active : true} className="rounded border-gray-300 text-black focus:ring-black" />
          <span className="text-sm font-medium">Active</span>
        </label>
      </div>

      <div className="flex justify-end pt-4 border-t">
        <Button type="submit" disabled={loading}>
          {loading ? 'Saving...' : 'Save Collection'}
        </Button>
      </div>
    </form>
  );
}
