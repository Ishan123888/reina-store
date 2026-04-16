"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { getSupabaseBrowserClient } from "@/core/configs/supabase-browser";

export interface CartItem {
  line_id: string;
  id: string;
  name: string;
  price: number;
  image_url: string;
  quantity: number;
  color?: string;
  size?: string;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: any, options?: { color?: string; size?: string }) => void;
  removeFromCart: (lineId: string) => void;
  updateQuantity: (lineId: string, delta: number) => void;
  clearCart: () => void;
  cartCount: number;
  cartTotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [storageKey, setStorageKey] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const supabase = getSupabaseBrowserClient();

    const applyUserKey = (userId?: string) => {
      setStorageKey(userId ? `reina_cart_${userId}` : "reina_cart_guest");
    };

    supabase.auth.getUser().then(({ data }) => applyUserKey(data.user?.id));

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      applyUserKey(session?.user?.id);
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!storageKey) return;

    setIsInitialized(false);
    const savedCart = localStorage.getItem(storageKey);
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch {
        setCart([]);
      }
    } else {
      setCart([]);
    }
    setIsInitialized(true);
  }, [storageKey]);

  useEffect(() => {
    if (isInitialized && storageKey) {
      localStorage.setItem(storageKey, JSON.stringify(cart));
    }
  }, [cart, isInitialized, storageKey]);

  const addToCart = (product: any, options?: { color?: string; size?: string }) => {
    const color = options?.color ?? product.selectedColor ?? product.color ?? undefined;
    const size = options?.size ?? product.selectedSize ?? product.size ?? undefined;
    const lineId = `${product.id}:${color ?? ""}:${size ?? ""}`;

    setCart((prevCart) => {
      const existing = prevCart.find((i) => i.line_id === lineId);
      if (existing) {
        return prevCart.map((i) => (i.line_id === lineId ? { ...i, quantity: i.quantity + 1 } : i));
      }
      return [
        ...prevCart,
        {
          line_id: lineId,
          id: product.id,
          name: product.name,
          price: product.price,
          image_url: product.image_url,
          quantity: 1,
          color,
          size,
        },
      ];
    });
  };

  const updateQuantity = (lineId: string, delta: number) => {
    setCart((prevCart) =>
      prevCart.map((i) => {
        if (i.line_id !== lineId) return i;
        const nextQty = i.quantity + delta;
        return { ...i, quantity: nextQty > 0 ? nextQty : 1 };
      })
    );
  };

  const removeFromCart = (lineId: string) => {
    setCart((prevCart) => prevCart.filter((i) => i.line_id !== lineId));
  };

  const clearCart = () => setCart([]);

  const cartCount = cart.reduce((total, i) => total + i.quantity, 0);
  const cartTotal = cart.reduce((total, i) => total + i.price * i.quantity, 0);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart, cartCount, cartTotal }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within a CartProvider");
  return context;
};

