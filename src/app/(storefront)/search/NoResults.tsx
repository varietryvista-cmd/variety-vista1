import { fetchFeaturedProducts } from '@/app/actions/search';
import ProductCard from '@/components/storefront/ProductCard';
import { SearchX } from 'lucide-react';
import Link from 'next/link';
import Button from '@/components/ui/CustomButton';

export default async function NoResults({ query }: { query: string }) {
  const featuredProducts = await fetchFeaturedProducts();

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="bg-secondary-bg p-6 rounded-full mb-6">
        <SearchX className="h-12 w-12 text-secondary-text" />
      </div>
      
      <h1 className="text-3xl font-bold mb-3 text-center">No results found</h1>
      <p className="text-secondary-text text-center max-w-md mb-8">
        We couldn&apos;t find anything matching &quot;{query}&quot;. Try checking for typos or using more general terms.
      </p>

      <div className="flex gap-4 mb-16">
        <Link href="/collections/all">
          <Button variant="outline">Shop Denim</Button>
        </Link>
        <Link href="/">
          <Button>Back to Home</Button>
        </Link>
      </div>

      {featuredProducts.length > 0 && (
        <div className="w-full">
          <h2 className="text-2xl font-bold mb-6 text-center">You might also like</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
