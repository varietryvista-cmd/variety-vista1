'use client';

import * as React from 'react';
import { Filter, SlidersHorizontal, ChevronDown, X } from 'lucide-react';
import ProductCard from '@/components/storefront/ProductCard';
import Drawer from '@/components/ui/Drawer';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import type { Product, ProductImage, ProductVariant } from '@/types';

type FullProduct = Product & { images: ProductImage[]; variants: ProductVariant[] };

interface CollectionViewProps {
  initialProducts: FullProduct[];
  totalCount: number;
  availableFits: string[];
  availableWashes: string[];
  currentPage: number;
  currentSort: string;
  currentFits: string[];
  currentWashes: string[];
}

export default function CollectionView({ 
  initialProducts, 
  totalCount,
  availableFits,
  availableWashes,
  currentPage,
  currentSort,
  currentFits,
  currentWashes
}: CollectionViewProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [products, setProducts] = React.useState(initialProducts);
  const [showFilters, setShowFilters] = React.useState(false);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = React.useState(false);
  const [isLoadingMore, setIsLoadingMore] = React.useState(false);

  // Update products when initialProducts changes
  React.useEffect(() => {
    if (currentPage === 1) {
      setProducts(initialProducts);
    } else {
      setProducts(prev => {
        const newProducts = [...prev];
        initialProducts.forEach(p => {
          if (!newProducts.find(ext => ext.id === p.id)) {
            newProducts.push(p);
          }
        });
        return newProducts;
      });
    }
    setIsLoadingMore(false);
  }, [initialProducts, currentPage]);

  const updateFilters = (key: string, values: string[]) => {
    const params = new URLSearchParams(searchParams.toString());
    if (values.length > 0) {
      params.set(key, values.join(','));
    } else {
      params.delete(key);
    }
    params.delete('page');
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const toggleFilter = (value: string, current: string[], key: 'fit' | 'wash') => {
    const newValues = current.includes(value) 
      ? current.filter(v => v !== value)
      : [...current, value];
    updateFilters(key, newValues);
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('sort', e.target.value);
    params.delete('page');
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const clearAllFilters = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete('fit');
    params.delete('wash');
    params.delete('page');
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const loadMore = () => {
    setIsLoadingMore(true);
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', (currentPage + 1).toString());
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const activeFilterCount = currentFits.length + currentWashes.length;
  const hasMore = products.length < totalCount;

  const FilterContent = () => (
    <div className="space-y-8 text-[#0A0A0A]">
      {/* Fit Filter */}
      {availableFits.length > 0 && (
        <div>
          <h3 className="font-bold text-xs uppercase tracking-[0.2em] text-[#0A0A0A] mb-4">Fit</h3>
          <div className="space-y-2.5">
            {availableFits.map(fit => (
              <label key={fit} className="flex items-center gap-3 cursor-pointer group">
                <div className={`w-4 h-4 border flex items-center justify-center transition-colors
                  ${currentFits.includes(fit) ? 'bg-[#0A0A0A] border-[#0A0A0A]' : 'border-[rgba(10,10,10,0.2)] group-hover:border-[#0A0A0A]'}`}
                >
                  {currentFits.includes(fit) && <div className="w-1.5 h-1.5 bg-[#FAFAF9]" />}
                </div>
                <span className="text-xs font-medium text-[#8B8680] group-hover:text-[#0A0A0A] capitalize tracking-wide">
                  {fit.replace('_', ' ')}
                </span>
                <input 
                  type="checkbox" 
                  className="hidden" 
                  checked={currentFits.includes(fit)}
                  onChange={() => toggleFilter(fit, currentFits, 'fit')}
                />
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Wash Filter */}
      {availableWashes.length > 0 && (
        <div>
          <h3 className="font-bold text-xs uppercase tracking-[0.2em] text-[#0A0A0A] mb-4">Wash</h3>
          <div className="space-y-2.5">
            {availableWashes.map(wash => (
              <label key={wash} className="flex items-center gap-3 cursor-pointer group">
                <div className={`w-4 h-4 border flex items-center justify-center transition-colors
                  ${currentWashes.includes(wash) ? 'bg-[#0A0A0A] border-[#0A0A0A]' : 'border-[rgba(10,10,10,0.2)] group-hover:border-[#0A0A0A]'}`}
                >
                  {currentFits.includes(wash) && <div className="w-1.5 h-1.5 bg-[#FAFAF9]" />}
                </div>
                <span className="text-xs font-medium text-[#8B8680] group-hover:text-[#0A0A0A] tracking-wide">
                  {wash}
                </span>
                <input 
                  type="checkbox" 
                  className="hidden" 
                  checked={currentWashes.includes(wash)}
                  onChange={() => toggleFilter(wash, currentWashes, 'wash')}
                />
              </label>
            ))}
          </div>
        </div>
      )}

      {activeFilterCount > 0 && (
        <button 
          onClick={clearAllFilters}
          className="w-full mt-4 py-3 border border-[#0A0A0A] text-xs font-bold uppercase tracking-[0.15em] hover:bg-[#0A0A0A] hover:text-[#FAFAF9] transition-colors"
        >
          Clear All Filters
        </button>
      )}
    </div>
  );

  return (
    <div className="page-container py-10">
      {/* Utility Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between py-4 border-b border-[rgba(10,10,10,0.06)] mb-8 sticky top-[80px] bg-[#FAFAF9]/95 backdrop-blur-md z-10 gap-4">
        <div className="flex items-center justify-between md:justify-start w-full md:w-auto gap-6">
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className="hidden md:flex items-center gap-2 text-xs font-bold uppercase tracking-[0.15em] text-[#0A0A0A] hover:text-[#B8913A] transition-colors"
          >
            <Filter className="w-3.5 h-3.5" />
            {showFilters ? 'Hide Filters' : 'Show Filters'}
            {activeFilterCount > 0 && (
              <span className="bg-[#B8913A] text-white text-[9px] w-4 h-4 flex items-center justify-center font-bold">
                {activeFilterCount}
              </span>
            )}
          </button>
          
          <button 
            onClick={() => setIsMobileFilterOpen(true)}
            className="flex md:hidden items-center gap-2 text-xs font-bold uppercase tracking-[0.15em] text-[#0A0A0A] hover:text-[#B8913A] transition-colors"
          >
            <Filter className="w-3.5 h-3.5" />
            Filters
            {activeFilterCount > 0 && (
              <span className="bg-[#B8913A] text-white text-[9px] w-4 h-4 flex items-center justify-center font-bold">
                {activeFilterCount}
              </span>
            )}
          </button>

          <span className="text-xs font-semibold uppercase tracking-[0.15em] text-[#8B8680]">
            {totalCount} {totalCount === 1 ? 'Product' : 'Products'}
          </span>
        </div>

        <div className="flex items-center justify-between md:justify-end gap-4 w-full md:w-auto">
          <div className="relative w-full md:w-auto">
            <select
              value={currentSort}
              onChange={handleSortChange}
              className="appearance-none bg-transparent pr-8 pl-3 py-1.5 text-xs font-bold uppercase tracking-[0.15em] text-[#0A0A0A] focus:outline-none cursor-pointer w-full md:w-auto border border-[rgba(10,10,10,0.12)] md:border-none"
            >
              <option value="recommended">Sort: Recommended</option>
              <option value="newest">Sort: Newest</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-[#8B8680]" />
          </div>
        </div>
      </div>

      {/* Active Filter Chips */}
      {activeFilterCount > 0 && (
        <div className="flex flex-wrap gap-2 mb-8">
          {currentFits.map(fit => (
            <button 
              key={fit}
              onClick={() => toggleFilter(fit, currentFits, 'fit')}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#F5F4F2] hover:bg-[rgba(10,10,10,0.08)] text-[10px] font-bold uppercase tracking-[0.15em] text-[#0A0A0A] transition-colors"
            >
              Fit: {fit.replace('_', ' ')}
              <X className="w-3 h-3 text-[#8B8680]" />
            </button>
          ))}
          {currentWashes.map(wash => (
            <button 
              key={wash}
              onClick={() => toggleFilter(wash, currentWashes, 'wash')}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#F5F4F2] hover:bg-[rgba(10,10,10,0.08)] text-[10px] font-bold uppercase tracking-[0.15em] text-[#0A0A0A] transition-colors"
            >
              Wash: {wash}
              <X className="w-3 h-3 text-[#8B8680]" />
            </button>
          ))}
          <button 
            onClick={clearAllFilters}
            className="text-xs font-bold uppercase tracking-[0.15em] text-[#8B8680] hover:text-[#0A0A0A] underline underline-offset-4 ml-2"
          >
            Clear all
          </button>
        </div>
      )}

      <div className="flex items-start gap-12">
        {/* Desktop Sidebar Filters */}
        {showFilters && (
          <div className="hidden md:block w-56 shrink-0 sticky top-[150px]">
            <FilterContent />
          </div>
        )}

        {/* Mobile Filter Drawer */}
        <Drawer 
          isOpen={isMobileFilterOpen} 
          onClose={() => setIsMobileFilterOpen(false)}
          title="Filters"
        >
          <div className="p-6 h-full overflow-y-auto bg-[#FAFAF9]">
            <FilterContent />
            <button 
              className="mt-8 w-full py-4 bg-[#0A0A0A] text-[#FAFAF9] text-xs font-bold uppercase tracking-[0.15em] hover:bg-[#B8913A] transition-colors"
              onClick={() => setIsMobileFilterOpen(false)}
            >
              View {totalCount} Products
            </button>
          </div>
        </Drawer>

        {/* Product Grid */}
        <div className="flex-1 w-full">
          {products.length > 0 ? (
            <>
              <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {products.map((product, index) => (
                  <ProductCard key={`${product.id}-${index}`} product={product as unknown as Product} index={index} />
                ))}
              </div>
              
              {hasMore && (
                <div className="mt-16 text-center">
                  <button 
                    onClick={loadMore}
                    disabled={isLoadingMore}
                    className="px-10 py-4 border border-[#0A0A0A] text-xs font-bold uppercase tracking-[0.15em] text-[#0A0A0A] hover:bg-[#0A0A0A] hover:text-[#FAFAF9] transition-colors disabled:opacity-50 min-w-[200px]"
                  >
                    {isLoadingMore ? 'Loading...' : 'Load More'}
                  </button>
                  <p className="text-xs font-medium text-[#8B8680] uppercase tracking-wider mt-4">
                    Showing {products.length} of {totalCount} products
                  </p>
                </div>
              )}
            </>
          ) : (
            <div className="py-24 text-center">
              <SlidersHorizontal className="w-10 h-10 text-[#8B8680] mx-auto mb-4" />
              <h3 className="text-xl font-bold uppercase tracking-tight text-[#0A0A0A] mb-2">No products found</h3>
              <p className="text-[#8B8680] text-sm mb-6">Try adjusting your filters to find what you&apos;re looking for.</p>
              <button 
                onClick={clearAllFilters}
                className="px-8 py-3.5 bg-[#0A0A0A] text-[#FAFAF9] text-xs font-bold uppercase tracking-[0.15em] hover:bg-[#B8913A] transition-colors"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
