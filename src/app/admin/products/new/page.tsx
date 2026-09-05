import { Metadata } from 'next';
import ProductForm from '@/components/admin/ProductForm';

export const metadata: Metadata = {
  title: 'New Product | Admin',
};

export default function NewProductPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Add New Product</h1>
      <ProductForm />
    </div>
  );
}
