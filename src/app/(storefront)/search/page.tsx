import { Metadata } from 'next';
import { createServerClient } from '@/lib/supabase';
import type { Product, ProductImage, ProductVariant } from '@/types';
import CollectionView from '../collections/[slug]/CollectionView';
import NoResults from './NoResults';

interface SearchPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

type FullProduct = Product & { images: ProductImage[]; variants: ProductVariant[] };

// Base query logic for search
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function applySearchToQuery(query: any, searchQuery: string) {
  if (searchQuery.trim()) {
    return query.textSearch('title', searchQuery.trim(), {
      type: 'websearch',
      config: 'english'
    });
  }
  return query;
}

async function fetchSearchProducts(
  searchQuery: string, 
  searchParams: { [key: string]: string | string[] | undefined }
): Promise<{ products: FullProduct[], totalCount: number }> {
  const supabase = await createServerClient();
  let query = supabase
    .from('products')
    .select('*, images:product_images(*), variants:product_variants(*)', { count: 'exact' });

  query = applySearchToQuery(query, searchQuery);

  // Apply filters from searchParams
  const fitParams = searchParams.fit;
  if (fitParams) {
    const fits = Array.isArray(fitParams) ? fitParams : fitParams.split(',');
    if (fits.length > 0) {
      query = query.in('fit_type', fits);
    }
  }

  const washParams = searchParams.wash;
  if (washParams) {
    const washes = Array.isArray(washParams) ? washParams : washParams.split(',');
    if (washes.length > 0) {
      query = query.in('wash', washes);
    }
  }

  // Apply sorting
  const sort = searchParams.sort as string || 'recommended';
  if (sort === 'price-low') {
    query = query.order('price', { ascending: true });
  } else if (sort === 'price-high') {
    query = query.order('price', { ascending: false });
  } else if (sort === 'newest') {
    query = query.order('created_at', { ascending: false });
  } else {
    query = query.order('created_at', { ascending: false });
  }

  // Apply pagination
  const limit = 12;
  const page = parseInt(searchParams.page as string || '1');
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  query = query.range(from, to);

  const { data, error, count } = await query;

  if (error) {
    console.error('Error fetching search products:', error);
    return { products: [], totalCount: 0 };
  }
  
  return { 
    products: (data as unknown) as FullProduct[], 
    totalCount: count || 0 
  };
}

async function fetchSearchFilters(searchQuery: string) {
  const supabase = await createServerClient();
  let query = supabase.from('products').select('fit_type, wash');
  query = applySearchToQuery(query, searchQuery);
  
  const { data, error } = await query;
  if (error || !data) return { availableFits: [], availableWashes: [] };

  const fits = new Set<string>();
  const washes = new Set<string>();

  data.forEach(item => {
    if (item.fit_type) fits.add(item.fit_type);
    if (item.wash) washes.add(item.wash);
  });

  return {
    availableFits: Array.from(fits),
    availableWashes: Array.from(washes)
  };
}

export async function generateMetadata({ searchParams }: SearchPageProps): Promise<Metadata> {
  const resolvedSearchParams = await searchParams;
  const query = resolvedSearchParams.q as string || '';
  return {
    title: `Search results for "${query}" | Variety Vista`,
    description: `Search results for ${query} at Variety Vista.`,
  };
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const resolvedSearchParams = await searchParams;
  const searchQuery = resolvedSearchParams.q as string || '';

  const { products, totalCount } = await fetchSearchProducts(searchQuery, resolvedSearchParams);
  const { availableFits, availableWashes } = await fetchSearchFilters(searchQuery);

  if (!searchQuery.trim() || (products.length === 0 && availableFits.length === 0)) {
    return <NoResults query={searchQuery} />;
  }

  const currentPage = parseInt(resolvedSearchParams.page as string || '1');

  return (
    <div className="min-h-screen bg-white">
      {/* Page Header */}
      <div className="bg-[#f9f9f9] py-12 px-4 md:px-8 mt-[70px]">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-[#111] mb-2">
            Search results for &quot;{searchQuery}&quot;
          </h1>
          <p className="text-gray-600 max-w-xl">
            {totalCount} {totalCount === 1 ? 'product' : 'products'} found.
          </p>
        </div>
      </div>

      <CollectionView 
        initialProducts={products} 
        totalCount={totalCount}
        availableFits={availableFits}
        availableWashes={availableWashes}
        currentPage={currentPage}
        currentSort={resolvedSearchParams.sort as string || 'recommended'}
        currentFits={resolvedSearchParams.fit ? (resolvedSearchParams.fit as string).split(',') : []}
        currentWashes={resolvedSearchParams.wash ? (resolvedSearchParams.wash as string).split(',') : []}
      />
    </div>
  );
}
