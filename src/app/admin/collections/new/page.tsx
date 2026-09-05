import { Metadata } from 'next';
import CollectionForm from '@/components/admin/CollectionForm';

export const metadata: Metadata = {
  title: 'New Collection | Admin',
};

export default function NewCollectionPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Add New Collection</h1>
      <CollectionForm />
    </div>
  );
}
