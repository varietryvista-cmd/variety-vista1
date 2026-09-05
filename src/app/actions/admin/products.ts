'use server';

import { createAdminClient } from '@/lib/supabase';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

// Fetch all products with basic info for the admin list
export async function getAdminProducts() {
  const supabase = await createAdminClient();
  const { data, error } = await supabase
    .from('products')
    .select('*, variants:product_variants(id, stock_quantity, price), images:product_images(image_url)')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Failed to fetch admin products:', error);
    return { error: 'Failed to fetch products' };
  }
  return { data };
}

// Fetch a single product for editing
export async function getAdminProduct(id: string) {
  const supabase = await createAdminClient();
  const { data, error } = await supabase
    .from('products')
    .select('*, variants:product_variants(*), images:product_images(*)')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Failed to fetch admin product:', error);
    return { error: 'Failed to fetch product' };
  }
  return { data };
}

const ProductSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  slug: z.string().min(1, 'Slug is required'),
  description: z.string().optional(),
  gender: z.enum(['men', 'women', 'unisex']),
  fit_type: z.enum(['bootcut', 'baggy', 'straight', 'skinny', 'wide_leg', 'mom', 'flare']),
  price: z.coerce.number().min(0, 'Price must be positive'),
  sale_price: z.coerce.number().optional().nullable(),
  status: z.enum(['draft', 'active']),
  colour: z.string().optional(),
  bestseller: z.boolean().default(false),
  new_arrival: z.boolean().default(false),
  featured: z.boolean().default(false),
});

// Update a product
export async function updateAdminProduct(id: string, formData: FormData) {
  const supabase = await createAdminClient();
  
  try {
    const rawData = {
      title: formData.get('title'),
      slug: formData.get('slug'),
      description: formData.get('description'),
      gender: formData.get('gender'),
      fit_type: formData.get('fit_type'),
      price: formData.get('price'),
      sale_price: formData.get('sale_price') || null,
      status: formData.get('status'),
      colour: formData.get('colour'),
      bestseller: formData.get('bestseller') === 'true',
      new_arrival: formData.get('new_arrival') === 'true',
      featured: formData.get('featured') === 'true',
    };

    const parsed = ProductSchema.parse(rawData);

    const { error } = await supabase
      .from('products')
      .update(parsed)
      .eq('id', id);

    if (error) throw error;
    
    revalidatePath('/admin/products');
    revalidatePath(`/admin/products/${id}/edit`);
    return { success: true };
  } catch (err: unknown) {
    console.error('Update product error:', err);
    return { error: err instanceof Error ? err.message : 'Failed to update product' };
  }
}

// Create a new product
export async function createAdminProduct(formData: FormData) {
  const supabase = await createAdminClient();
  
  try {
    const rawData = {
      title: formData.get('title'),
      slug: formData.get('slug'),
      description: formData.get('description'),
      gender: formData.get('gender'),
      fit_type: formData.get('fit_type'),
      price: formData.get('price'),
      sale_price: formData.get('sale_price') || null,
      status: formData.get('status'),
      colour: formData.get('colour'),
      bestseller: formData.get('bestseller') === 'true',
      new_arrival: formData.get('new_arrival') === 'true',
      featured: formData.get('featured') === 'true',
    };

    const parsed = ProductSchema.parse(rawData);

    const { data, error } = await supabase
      .from('products')
      .insert(parsed)
      .select('id')
      .single();

    if (error) throw error;
    
    revalidatePath('/admin/products');
    return { success: true, id: data.id };
  } catch (err: unknown) {
    console.error('Create product error:', err);
    return { error: err instanceof Error ? err.message : 'Failed to create product' };
  }
}

// Upload product images
export async function uploadProductImages(formData: FormData) {
  const supabase = await createAdminClient();
  
  try {
    const productId = formData.get('product_id') as string;
    if (!productId) throw new Error('Product ID required');

    const imageFiles = formData.getAll('images') as File[];

    if (imageFiles.length === 0) {
      return { error: 'No images provided' };
    }

    // Upload to Supabase Storage
    const uploads = imageFiles.map(async (file, index) => {
      const imageType = formData.getAll('image_type')[index] as string || 'flat';
      const sortOrder = parseInt(formData.getAll('sort_order')[index] as string || String(index), 10);
      const altText = formData.getAll('alt_text')[index] as string || '';
      
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `products/${productId}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
        });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('product-images')
        .getPublicUrl(filePath);

      return { imageUrl: publicUrl, imageType, sortOrder, altText };
    });

    const uploadedImages = await Promise.all(uploads);

    // Insert image records
    const imageRecords = uploadedImages.map((img) => ({
      product_id: productId,
      image_url: img.imageUrl,
      image_type: img.imageType as 'flat' | 'on_model' | 'detail',
      sort_order: img.sortOrder,
      alt_text: img.altText,
    }));

    const { error: insertError } = await supabase
      .from('product_images')
      .insert(imageRecords);

    if (insertError) throw insertError;

    revalidatePath('/admin/products');
    return { success: true };
  } catch (err: unknown) {
    console.error('Upload images error:', err);
    return { error: err instanceof Error ? err.message : 'Failed to upload images' };
  }
}

// Update product variant
export async function updateProductVariant(variantId: string, data: {
  product_id: string;
  waist_size: number;
  inseam_length: number | null;
  stock_quantity: number;
  price: number | null;
}) {
  const supabase = await createAdminClient();
  
  try {
    const { error } = await supabase
      .from('product_variants')
      .update({
        waist_size: data.waist_size,
        inseam_length: data.inseam_length,
        stock_quantity: data.stock_quantity,
        price: data.price,
      })
      .eq('id', variantId);

    if (error) throw error;
    
    revalidatePath('/admin/products');
    return { success: true };
  } catch (err: unknown) {
    console.error('Update variant error:', err);
    return { error: err instanceof Error ? err.message : 'Failed to update variant' };
  }
}

// Create product variant
export async function createProductVariant(data: {
  product_id: string;
  waist_size: number;
  inseam_length: number | null;
  stock_quantity: number;
  price: number | null;
}) {
  const supabase = await createAdminClient();
  
  try {
    const { data: variantData, error } = await supabase
      .from('product_variants')
      .insert({
        product_id: data.product_id,
        waist_size: data.waist_size,
        inseam_length: data.inseam_length,
        stock_quantity: data.stock_quantity,
        price: data.price,
        sku: `${data.product_id.slice(0, 8)}-${data.waist_size}-${data.inseam_length || 'reg'}`.toUpperCase(),
      })
      .select('id')
      .single();

    if (error) throw error;
    
    revalidatePath('/admin/products');
    return { success: true, id: variantData.id };
  } catch (err: unknown) {
    console.error('Create variant error:', err);
    return { error: err instanceof Error ? err.message : 'Failed to create variant' };
  }
}

// Delete product variant
export async function deleteProductVariant(variantId: string) {
  const supabase = await createAdminClient();
  
  try {
    const { error } = await supabase
      .from('product_variants')
      .delete()
      .eq('id', variantId);

    if (error) throw error;
    
    revalidatePath('/admin/products');
    return { success: true };
  } catch (err: unknown) {
    console.error('Delete variant error:', err);
    return { error: err instanceof Error ? err.message : 'Failed to delete variant' };
  }
}

// Delete product image
export async function deleteProductImage(imageId: string) {
  const supabase = await createAdminClient();
  
  try {
    // Get image info first
    const { data: image, error: fetchError } = await supabase
      .from('product_images')
      .select('image_url')
      .eq('id', imageId)
      .single();

    if (fetchError) throw fetchError;

    // Delete from storage
    if (image?.image_url) {
      const url = new URL(image.image_url);
      const pathParts = url.pathname.split('/');
      const filePath = pathParts.slice(pathParts.indexOf('product-images') + 1).join('/');
      
      if (filePath) {
        await supabase.storage
          .from('product-images')
          .remove([filePath]);
      }
    }

    // Delete from database
    const { error } = await supabase
      .from('product_images')
      .delete()
      .eq('id', imageId);

    if (error) throw error;
    
    revalidatePath('/admin/products');
    return { success: true };
  } catch (err: unknown) {
    console.error('Delete image error:', err);
    return { error: err instanceof Error ? err.message : 'Failed to delete image' };
  }
}
