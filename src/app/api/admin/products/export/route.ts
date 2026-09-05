import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    const gender = searchParams.get('gender');
    const fit = searchParams.get('fit');

    const supabase = await createAdminClient();

    let query = supabase
      .from('products')
      .select('id, title, slug, gender, fit_type, status, price, sale_price, bestseller, new_arrival, featured, created_at, updated_at')
      .order('created_at', { ascending: false });

    if (status && status !== 'all') {
      query = query.eq('status', status);
    }
    if (gender && gender !== 'all') {
      query = query.eq('gender', gender);
    }
    if (fit && fit !== 'all') {
      query = query.eq('fit_type', fit);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Export products error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const headers = ['ID', 'Title', 'Slug', 'Gender', 'Fit', 'Status', 'Price', 'Sale Price', 'Bestseller', 'New Arrival', 'Featured', 'Created', 'Updated'];
    const rows = (data || []).map(p => [
      p.id,
      p.title,
      p.slug,
      p.gender,
      p.fit_type,
      p.status,
      p.price,
      p.sale_price || '',
      p.bestseller ? 'Yes' : 'No',
      p.new_arrival ? 'Yes' : 'No',
      p.featured ? 'Yes' : 'No',
      new Date(p.created_at).toLocaleDateString(),
      new Date(p.updated_at).toLocaleDateString(),
    ]);

    const csv = [headers, ...rows].map(r => r.map(v => `"${v}"`).join(',')).join('\n');

    return new NextResponse(csv, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="products-${new Date().toISOString().split('T')[0]}.csv"`,
      },
    });
  } catch (e) {
    console.error('Export error:', e);
    return NextResponse.json({ error: 'Failed to export' }, { status: 500 });
  }
}