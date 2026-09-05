'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import type { CartContextType, CartItem, Product, ProductVariant } from '@/types';
import { getCart, addToCart as serverAddToCart, updateCartItem as serverUpdateCartItem, removeFromCart as serverRemoveFromCart, clearCart as serverClearCart } from '@/app/actions/cart';

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  // Load cart from Server on mount
  useEffect(() => {
    setIsMounted(true);
    async function loadCart() {
      try {
        const cartItems = await getCart();
        setItems(cartItems);
      } catch (e) {
        console.error('Failed to load cart', e);
      } finally {
        // loading state can be managed here if added back
      }
    }
    loadCart();

    try {
      const storedCoupon = localStorage.getItem('varietyvista_coupon');
      if (storedCoupon) {
        setAppliedCoupon(storedCoupon);
      }
    } catch {
      // ignore
    }
  }, []);

  // Persist coupon to localStorage on change
  useEffect(() => {
    if (isMounted) {
      if (appliedCoupon) {
        localStorage.setItem('varietyvista_coupon', appliedCoupon);
      } else {
        localStorage.removeItem('varietyvista_coupon');
      }
    }
  }, [appliedCoupon, isMounted]);

  const addItem = useCallback(async (product: Product, variant: ProductVariant, quantity: number) => {
    // Optimistic UI updates
    setItems((prevItems) => {
      const existingIndex = prevItems.findIndex((item) => item.variantId === variant.id);
      if (existingIndex >= 0) {
        const updated = [...prevItems];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + quantity,
        };
        return updated;
      }

      const primaryImage = product.images?.sort((a, b) => a.sort_order - b.sort_order)?.[0];
      const newItem: CartItem = {
        id: `optimistic-${Date.now()}`,
        productId: product.id,
        variantId: variant.id,
        slug: product.slug,
        title: product.title,
        image: primaryImage?.image_url || null,
        price: variant.price ?? (product.sale_price ?? product.price),
        wash: product.wash || null,
        waistSize: variant.waist_size,
        inseamLength: variant.inseam_length || null,
        quantity,
      };
      return [...prevItems, newItem];
    });

    setIsOpen(true);
    
    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('cart:added', { detail: { productId: product.id, variantId: variant.id } })
      );
    }

    // Call server action
    try {
      const res = await serverAddToCart(product.id, variant.id, quantity) as { success: boolean; cart?: CartItem[]; error?: string };
      if (res.error) {
        alert(res.error);
        // Revert optimistically
        const realCart = await getCart();
        setItems(realCart);
      } else if (res.cart) {
        setItems(res.cart);
      }
    } catch (e) {
      console.error(e);
      const realCart = await getCart();
      setItems(realCart);
    }
  }, []);

  const removeItem = useCallback(async (variantId: string) => {
    const itemToRemove = items.find(i => i.variantId === variantId);
    if (!itemToRemove) return;

    // Optimistically remove
    setItems((prev) => prev.filter((item) => item.variantId !== variantId));

    try {
      // Note: cart item ID is stored in item.id
      const res = await serverRemoveFromCart(itemToRemove.id) as { success: boolean; cart?: CartItem[]; error?: string };
      if (res.error) {
        alert(res.error);
        const realCart = await getCart();
        setItems(realCart);
      } else if (res.cart) {
        setItems(res.cart);
      }
    } catch (e) {
      console.error(e);
      const realCart = await getCart();
      setItems(realCart);
    }
  }, [items]);

  const updateQuantity = useCallback(async (variantId: string, quantity: number) => {
    const itemToUpdate = items.find(i => i.variantId === variantId);
    if (!itemToUpdate) return;

    if (quantity <= 0) {
      removeItem(variantId);
      return;
    }

    // Optimistically update
    setItems((prev) => prev.map((item) => item.variantId === variantId ? { ...item, quantity } : item));

    try {
      const res = await serverUpdateCartItem(itemToUpdate.id, variantId, quantity) as { success: boolean; cart?: CartItem[]; error?: string };
      if (res.error) {
        alert(res.error);
        const realCart = await getCart();
        setItems(realCart);
      } else if (res.cart) {
        setItems(res.cart);
      }
    } catch (e) {
      console.error(e);
      const realCart = await getCart();
      setItems(realCart);
    }
  }, [items, removeItem]);

  const clearCart = useCallback(async () => {
    setItems([]);
    setAppliedCoupon(null);
    try {
      await serverClearCart();
    } catch(e) {
      console.error(e);
    }
  }, []);

  const applyCoupon = useCallback((code: string) => {
    setAppliedCoupon(code);
  }, []);

  const removeCoupon = useCallback(() => {
    setAppliedCoupon(null);
  }, []);

  const openCart = useCallback(() => setIsOpen(true), []);
  const closeCart = useCallback(() => setIsOpen(false), []);

  const subtotal = useMemo(
    () => items.reduce((total, item) => total + item.price * item.quantity, 0),
    [items]
  );

  const itemCount = useMemo(
    () => items.reduce((count, item) => count + item.quantity, 0),
    [items]
  );

  const contextValue = useMemo<CartContextType>(
    () => ({
      items,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      subtotal,
      itemCount,
      isOpen,
      openCart,
      closeCart,
      appliedCoupon,
      applyCoupon,
      removeCoupon,
    }),
    [items, addItem, removeItem, updateQuantity, clearCart, subtotal, itemCount, isOpen, openCart, closeCart, appliedCoupon, applyCoupon, removeCoupon]
  );

  return (
    <CartContext.Provider value={contextValue}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextType {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
