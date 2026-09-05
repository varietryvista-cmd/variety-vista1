import { notFound } from 'next/navigation';
import ProductView from './ProductView';
import { Metadata } from 'next';
import { createServerClient } from '@/lib/supabase';
import type { Product, ProductImage, ProductVariant } from '@/types';

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

type FullProduct = Product & { images: ProductImage[]; variants: ProductVariant[] };

async function fetchProduct(slug: string): Promise<FullProduct | null> {
  const supabase = await createServerClient();
  const { data, error } = await supabase
    .from('products')
    .select('*, images:product_images(*), variants:product_variants(*)')
    .eq('slug', slug)
    .single();

  if (error || !data) {
    return null;
  }
  
  return (data as unknown) as FullProduct;
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await fetchProduct(slug);
  if (!product) return { title: 'Product Not Found | Variety Vista' };
  
  return {
    title: `${product.title} | Variety Vista`,
    description: product.description || `Buy ${product.title} at Variety Vista.`,
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await fetchProduct(slug);

  if (!product) {
    notFound();
  }

  // Fetch related products (same gender, different ID, limit 8)
  const supabase = await createServerClient();
  const { data: relatedData } = await supabase
    .from('products')
    .select('*, images:product_images(*), variants:product_variants(*)')
    .eq('gender', product.gender)
    .neq('id', product.id)
    .limit(8);

  const relatedProducts = (relatedData || []) as unknown as FullProduct[];

  return (
    <div className="min-h-screen bg-[#FAFAF9] text-[#0A0A0A]">
      <ProductView product={product} relatedProducts={relatedProducts} />
    </div>
  );
}
