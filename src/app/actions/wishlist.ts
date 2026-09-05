'use server';

import { createClient } from '@/lib/supabase';

export interface WishlistProductDetail {
  id: string;
  title: string;
  slug: string;
  price: number;
  sale_price: number | null;
  fit_type: string;
  gender: string;
  imageUrl: string;
  totalStock: number;
  variants: {
    id: string;
    sku: string;
    waist_size: string;
    inseam_length?: string;
    stock_quantity: number;
  }[];
}

export async function getWishlistProductDetails(productIds: string[]): Promise<WishlistProductDetail[]> {
  if (!productIds || productIds.length === 0) {
    return [];
  }

  try {
    const supabase = await createClient();

    const { data: products, error } = await supabase
      .from('products')
      .select(`
        id,
        title,
        slug,
        price,
        sale_price,
        fit_type,
        gender,
        images:product_images(image_url, is_primary, sort_order),
        variants:product_variants(id, sku, waist_size, inseam_length, stock_quantity)
      `)
      .in('id', productIds)
      .eq('status', 'active');

    if (error || !products) {
      console.error('Failed to fetch wishlist products:', error);
      return [];
    }

    return (products as any[]).map((p) => {
      const primaryImg = p.images?.find((img: any) => img.is_primary)?.image_url;
      const firstImg = p.images?.[0]?.image_url;
      const imageUrl = primaryImg || firstImg || '/images/placeholders/product-1.jpg';

      const variants = (p.variants || []).map((v: any) => ({
        id: v.id,
        sku: v.sku,
        waist_size: v.waist_size,
        inseam_length: v.inseam_length,
        stock_quantity: v.stock_quantity || 0,
      }));

      const totalStock = variants.reduce((sum: number, v: any) => sum + v.stock_quantity, 0);

      return {
        id: p.id,
        title: p.title,
        slug: p.slug,
        price: p.price,
        sale_price: p.sale_price,
        fit_type: p.fit_type,
        gender: p.gender,
        imageUrl,
        totalStock,
        variants,
      };
    });
  } catch (err) {
    console.error('Error in getWishlistProductDetails:', err);
    return [];
  }
}
