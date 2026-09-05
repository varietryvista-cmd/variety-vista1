import { Metadata } from 'next';
import ProductForm from '@/components/admin/ProductForm';
import { getAdminProduct } from '@/app/actions/admin/products';
import { notFound } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Edit Product | Admin',
};

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { data: product, error } = await getAdminProduct(id);

  if (error || !product) {
    notFound();
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Edit Product: {product.title}</h1>
      <ProductForm product={product} />
    </div>
  );
}
