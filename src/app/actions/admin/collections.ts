'use server';

import { createAdminClient } from '@/lib/supabase';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

const CollectionSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  slug: z.string().min(1, 'Slug is required'),
  description: z.string().optional().nullable(),
  image_url: z.string().url('Must be a valid URL').optional().nullable(),
  is_active: z.boolean().default(true),
});

export async function getAdminCollections() {
  const supabase = await createAdminClient();
  const { data, error } = await supabase
    .from('collections')
    .select('*, collection_products(count)')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Failed to fetch admin collections:', error);
    return { error: 'Failed to fetch collections' };
  }
  return { data };
}

export async function getAdminCollection(id: string) {
  const supabase = await createAdminClient();
  const { data, error } = await supabase
    .from('collections')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Failed to fetch admin collection:', error);
    return { error: 'Failed to fetch collection' };
  }
  return { data };
}

export async function createAdminCollection(formData: FormData) {
  const supabase = await createAdminClient();
  
  try {
    const rawData = {
      title: formData.get('title'),
      slug: formData.get('slug'),
      description: formData.get('description'),
      image_url: formData.get('image_url') || null,
      is_active: formData.get('is_active') === 'true',
    };

    const parsed = CollectionSchema.parse(rawData);

    const { data, error } = await supabase
      .from('collections')
      .insert(parsed)
      .select('id')
      .single();

    if (error) throw error;
    
    revalidatePath('/admin/collections');
    return { success: true, id: data.id };
  } catch (err: unknown) {
    console.error('Create collection error:', err);
    return { error: err instanceof Error ? err.message : 'Failed to create collection' };
  }
}

export async function updateAdminCollection(id: string, formData: FormData) {
  const supabase = await createAdminClient();
  
  try {
    const rawData = {
      title: formData.get('title'),
      slug: formData.get('slug'),
      description: formData.get('description'),
      image_url: formData.get('image_url') || null,
      is_active: formData.get('is_active') === 'true',
    };

    const parsed = CollectionSchema.parse(rawData);

    const { error } = await supabase
      .from('collections')
      .update(parsed)
      .eq('id', id);

    if (error) throw error;
    
    revalidatePath('/admin/collections');
    revalidatePath(`/admin/collections/${id}/edit`);
    return { success: true };
  } catch (err: unknown) {
    console.error('Update collection error:', err);
    return { error: err instanceof Error ? err.message : 'Failed to update collection' };
  }
}
