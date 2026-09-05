'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { createClient } from '@/lib/supabase-client';

interface WishlistContextType {
  items: string[];
  itemCount: number;
  toggleWishlist: (p: string) => Promise<void>;
  removeFromWishlist: (p: string) => Promise<void>;
  clearWishlist: () => Promise<void>;
  isWishlisted: (p: string) => boolean;
  isLoading: boolean;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

  const supabase = React.useMemo(() => createClient(), []);

  const syncAndFetchWishlist = useCallback(async (uid: string) => {
    setIsLoading(true);

    try {
      // 1. Check for guest items in localStorage to merge
      const guestStored = localStorage.getItem('varietyvista_wishlist');
      let guestItems: string[] = [];
      if (guestStored) {
        try {
          guestItems = JSON.parse(guestStored);
        } catch {
          guestItems = [];
        }
      }

      // 2. Fetch cloud items
      const { data: cloudData, error } = await supabase
        .from('wishlist')
        .select('product_id')
        .eq('user_id', uid);

      const cloudItems = !error && cloudData ? cloudData.map((item: any) => item.product_id) : [];

      // 3. Merge guest items into cloud if any
      const newToMerge = guestItems.filter((id) => !cloudItems.includes(id));
      if (newToMerge.length > 0) {
        const inserts = newToMerge.map((pid) => ({ user_id: uid, product_id: pid }));
        await supabase.from('wishlist').insert(inserts);
        // Clear local storage after successful merge
        localStorage.removeItem('varietyvista_wishlist');
        setItems(Array.from(new Set([...cloudItems, ...newToMerge])));
      } else {
        if (guestItems.length > 0) {
          localStorage.removeItem('varietyvista_wishlist');
        }
        setItems(cloudItems);
      }
    } catch (e) {
      console.error('Error syncing wishlist:', e);
    } finally {
      setIsLoading(false);
    }
  }, [supabase]);

  useEffect(() => {
    const fetchSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setUserId(session.user.id);
        syncAndFetchWishlist(session.user.id);
      } else {
        // Load from local storage for guests
        const stored = localStorage.getItem('varietyvista_wishlist');
        if (stored) {
          try {
            setItems(JSON.parse(stored));
          } catch (e) {
            console.error('Failed to parse wishlist', e);
          }
        }
        setIsLoading(false);
      }
    };

    fetchSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (session?.user) {
          setUserId(session.user.id);
          syncAndFetchWishlist(session.user.id);
        } else {
          setUserId(null);
          const stored = localStorage.getItem('varietyvista_wishlist');
          setItems(stored ? JSON.parse(stored) : []);
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase, syncAndFetchWishlist]);

  const toggleWishlist = useCallback(async (productId: string) => {
    const isCurrentlyWishlisted = items.includes(productId);

    if (userId) {
      if (isCurrentlyWishlisted) {
        setItems(prev => prev.filter(id => id !== productId));
        await supabase
          .from('wishlist')
          .delete()
          .eq('user_id', userId)
          .eq('product_id', productId);
      } else {
        setItems(prev => [...prev, productId]);
        await supabase
          .from('wishlist')
          .insert({ user_id: userId, product_id: productId });
      }
    } else {
      setItems(prev => {
        const newItems = prev.includes(productId)
          ? prev.filter(id => id !== productId)
          : [...prev, productId];
        localStorage.setItem('varietyvista_wishlist', JSON.stringify(newItems));
        return newItems;
      });
    }
  }, [items, userId, supabase]);

  const removeFromWishlist = useCallback(async (productId: string) => {
    if (userId) {
      setItems(prev => prev.filter(id => id !== productId));
      await supabase
        .from('wishlist')
        .delete()
        .eq('user_id', userId)
        .eq('product_id', productId);
    } else {
      setItems(prev => {
        const newItems = prev.filter(id => id !== productId);
        localStorage.setItem('varietyvista_wishlist', JSON.stringify(newItems));
        return newItems;
      });
    }
  }, [userId, supabase]);

  const clearWishlist = useCallback(async () => {
    setItems([]);
    if (userId) {
      await supabase
        .from('wishlist')
        .delete()
        .eq('user_id', userId);
    } else {
      localStorage.removeItem('varietyvista_wishlist');
    }
  }, [userId, supabase]);

  const isWishlisted = useCallback((productId: string) => {
    return items.includes(productId);
  }, [items]);

  return (
    <WishlistContext.Provider
      value={{
        items,
        itemCount: items.length,
        toggleWishlist,
        removeFromWishlist,
        clearWishlist,
        isWishlisted,
        isLoading,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
}
