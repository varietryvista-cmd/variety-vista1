import { Metadata } from 'next';
import CollectionForm from '@/components/admin/CollectionForm';
import { getAdminCollection } from '@/app/actions/admin/collections';
import { notFound } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Edit Collection | Admin',
};

export default async function EditCollectionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { data: collection, error } = await getAdminCollection(id);

  if (error || !collection) {
    notFound();
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Edit Collection: {collection.title}</h1>
      <CollectionForm collection={collection} />
    </div>
  );
}
