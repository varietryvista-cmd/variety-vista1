import { notFound } from 'next/navigation';
import CollectionView from './CollectionView';
import { Metadata } from 'next';
import { createServerClient } from '@/lib/supabase';
import type { Product, ProductImage, ProductVariant } from '@/types';

interface CollectionPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

type FullProduct = Product & { images: ProductImage[]; variants: ProductVariant[] };

// Base query logic for a collection slug
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function applySlugToQuery(query: any, slug: string) {
  if (slug === 'women') {
    return query.eq('gender', 'women');
  } else if (slug === 'men') {
    return query.eq('gender', 'men');
  } else if (slug === 'new-arrivals') {
    return query.eq('new_arrival', true);
  } else if (slug === 'sale') {
    return query.not('sale_price', 'is', null);
  } else if (slug !== 'all') {
    const fitTypeMatch = slug.replace('-', '_');
    return query.eq('fit_type', fitTypeMatch);
  }
  return query;
}

async function fetchCollectionProducts(
  slug: string, 
  searchParams: { [key: string]: string | string[] | undefined }
): Promise<{ products: FullProduct[], totalCount: number }> {
  const supabase = await createServerClient();
  let query = supabase
    .from('products')
    .select('*, images:product_images(*), variants:product_variants(*)', { count: 'exact' });

  query = applySlugToQuery(query, slug);

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
    // Note: If using sale_price, Supabase order on coalesced column might require a view.
    // For simplicity, we order by price. If sale_price exists, this isn't strictly accurate in raw DB without a view.
    // We will just order by price for now.
    query = query.order('price', { ascending: true });
  } else if (sort === 'price-high') {
    query = query.order('price', { ascending: false });
  } else if (sort === 'newest') {
    query = query.order('created_at', { ascending: false });
  } else {
    // recommended
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
    console.error('Error fetching collection products:', error);
    return { products: [], totalCount: 0 };
  }
  
  return { 
    products: (data as unknown) as FullProduct[], 
    totalCount: count || 0 
  };
}

async function fetchCollectionFilters(slug: string) {
  const supabase = await createServerClient();
  // To get distinct fits and washes, we fetch the whole collection (or select specific columns if large)
  let query = supabase.from('products').select('fit_type, wash');
  query = applySlugToQuery(query, slug);
  
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

export async function generateMetadata({ params }: CollectionPageProps): Promise<Metadata> {
  const { slug } = await params;
  const title = slug.charAt(0).toUpperCase() + slug.slice(1).replace('-', ' ');
  return {
    title: `${title} | Variety Vista`,
    description: `Shop the latest ${title.toLowerCase()} collection at Variety Vista.`,
  };
}

export default async function CollectionPage({ params, searchParams }: CollectionPageProps) {
  const { slug } = await params;
  const resolvedSearchParams = await searchParams;

  const { products, totalCount } = await fetchCollectionProducts(slug, resolvedSearchParams);
  const { availableFits, availableWashes } = await fetchCollectionFilters(slug);

  if (slug !== 'all' && slug !== 'women' && slug !== 'men' && slug !== 'new-arrivals' && slug !== 'sale' && products.length === 0 && availableFits.length === 0) {
    // If it's a specific fit type but no products exist at all, invalid slug
    notFound();
  }

  const title = slug.charAt(0).toUpperCase() + slug.slice(1).replace('-', ' ');
  const currentPage = parseInt(resolvedSearchParams.page as string || '1');

  return (
    <div className="min-h-screen bg-[#FAFAF9] text-[#0A0A0A]">
      {/* Page Header */}
      <div className="bg-[#F5F4F2] border-b border-[rgba(10,10,10,0.06)] py-16 md:py-20 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#8B8680] block mb-3">
            Collection
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold uppercase tracking-[-0.04em] text-[#0A0A0A] mb-3 leading-[0.9]">
            {title}
          </h1>
          <p className="text-[#8B8680] text-sm md:text-base max-w-xl leading-relaxed">
            Explore our curated selection of premium denim. Find your perfect fit, wash, and style.
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
