'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Loader2, Search, History, TrendingUp } from 'lucide-react';
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator
} from '@/components/ui/command';
import { searchProducts } from '@/app/actions/search';
import type { Product, ProductImage, ProductVariant } from '@/types';

type FullProduct = Product & { images: ProductImage[]; variants: ProductVariant[] };

const POPULAR_SEARCHES = ['Wide Leg Jeans', 'Light Wash', 'Cargo', 'Straight Fit'];

export function SearchOverlay({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<FullProduct[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  useEffect(() => {
    // Load recent searches
    const stored = localStorage.getItem('recentSearches');
    if (stored) {
      try {
        setRecentSearches(JSON.parse(stored));
      } catch {
        // ignore
      }
    }
  }, []);

  const saveRecentSearch = (term: string) => {
    if (!term.trim()) return;
    const newRecent = [term, ...recentSearches.filter(t => t !== term)].slice(0, 5);
    setRecentSearches(newRecent);
    localStorage.setItem('recentSearches', JSON.stringify(newRecent));
  };

  const handleSearch = (term: string) => {
    saveRecentSearch(term);
    onOpenChange(false);
    router.push(`/search?q=${encodeURIComponent(term)}`);
  };

  useEffect(() => {
    // Keyboard shortcut to open Cmd+K or Ctrl+K
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        onOpenChange(!open);
      }
    };
    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, [open, onOpenChange]);

  useEffect(() => {
    let active = true;
    
    if (!query.trim()) {
      setResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    
    const delay = setTimeout(async () => {
      try {
        const data = await searchProducts(query);
        if (active) {
          setResults(data);
        }
      } catch (error) {
        console.error('Search error:', error);
      } finally {
        if (active) {
          setIsSearching(false);
        }
      }
    }, 300);

    return () => {
      active = false;
      clearTimeout(delay);
    };
  }, [query]);

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput 
        placeholder="Search for fits, washes, or styles..." 
        value={query}
        onValueChange={setQuery}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && query.trim()) {
            handleSearch(query);
          }
        }}
      />
      <CommandList>
        <CommandEmpty>
          {isSearching ? (
            <div className="flex items-center justify-center p-6 text-sm text-secondary-text">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Searching...
            </div>
          ) : (
            "No results found."
          )}
        </CommandEmpty>
        
        {!query.trim() && !isSearching && (
          <>
            {recentSearches.length > 0 && (
              <CommandGroup heading="Recent Searches">
                {recentSearches.map((term) => (
                  <CommandItem
                    key={`recent-${term}`}
                    value={term}
                    onSelect={() => handleSearch(term)}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <History className="h-4 w-4 text-secondary-text" />
                    <span>{term}</span>
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
            
            {recentSearches.length > 0 && <CommandSeparator />}
            
            <CommandGroup heading="Popular Searches">
              {POPULAR_SEARCHES.map((term) => (
                <CommandItem
                  key={`popular-${term}`}
                  value={term}
                  onSelect={() => handleSearch(term)}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <TrendingUp className="h-4 w-4 text-secondary-text" />
                  <span>{term}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          </>
        )}

        {query.trim() && !isSearching && results.length > 0 && (
          <>
            <CommandGroup heading="Products">
              {results.map((product) => (
                <CommandItem
                  key={product.id}
                  value={product.title}
                  onSelect={() => {
                    saveRecentSearch(query);
                    onOpenChange(false);
                    router.push(`/products/${product.slug}`);
                  }}
                  className="flex items-center gap-4 p-3 cursor-pointer"
                >
                  <div className="w-12 h-16 bg-secondary-bg overflow-hidden rounded flex-shrink-0">
                    <Image 
                      src={product.images?.[0]?.image_url || '/placeholder.png'} 
                      alt={product.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">{product.title}</span>
                    <span className="text-sm text-secondary-text">
                      ₹{product.price}
                    </span>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
            
            <CommandSeparator />
            
            <CommandGroup>
              <CommandItem 
                onSelect={() => handleSearch(query)}
                className="flex items-center justify-center p-3 cursor-pointer font-medium text-primary-text"
              >
                <Search className="mr-2 h-4 w-4" />
                View all results for &quot;{query}&quot;
              </CommandItem>
            </CommandGroup>
          </>
        )}
      </CommandList>
    </CommandDialog>
  );
}
