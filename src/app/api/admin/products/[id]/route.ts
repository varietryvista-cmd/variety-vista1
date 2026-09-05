import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase';

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const supabase = await createAdminClient();

    const { error } = await supabase
      .from('products')
      .update(body)
      .eq('id', id);

    if (error) {
      console.error('Update product error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error('Update product error:', e);
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createAdminClient();

    // Delete related images from storage first
    const { data: images } = await supabase
      .from('product_images')
      .select('image_url')
      .eq('product_id', id);

    if (images && images.length > 0) {
      for (const img of images) {
        try {
          const url = new URL(img.image_url);
          const pathParts = url.pathname.split('/');
          const filePath = pathParts.slice(pathParts.indexOf('product-images') + 1).join('/');
          if (filePath) {
            await supabase.storage.from('product-images').remove([filePath]);
          }
        } catch (e) {
          console.warn('Failed to delete image from storage:', e);
        }
      }
    }

    // Delete product (cascades to variants, images, etc. due to FK constraints)
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Delete product error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error('Delete product error:', e);
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
  }
}