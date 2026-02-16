"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

interface CartItem {
  id: string;
  name: string;
  price: number;
  image_url: string;
  quantity: number;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: any) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, delta: number) => void; // මේකත් එක්කහු කරා (Quantity +/- කරන්න)
  clearCart: () => void;
  cartCount: number;
  cartTotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  // 1. LocalStorage එකෙන් පරණ Cart එක ලෝඩ් කිරීම (මුලින්ම වතාවක් පමණක්)
  useEffect(() => {
    const savedCart = localStorage.getItem("reina_cart");
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (error) {
        console.error("Failed to parse cart data", error);
      }
    }
    setIsInitialized(true); // දත්ත කියවා අවසන් බව සලකුණු කරයි
  }, []);

  // 2. Cart එක වෙනස් වන හැම වෙලාවකම Save කිරීම
  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem("reina_cart", JSON.stringify(cart));
    }
  }, [cart, isInitialized]);

  const addToCart = (product: any) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === product.id);
      if (existingItem) {
        return prevCart.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevCart, { 
        id: product.id, 
        name: product.name, 
        price: product.price, 
        image_url: product.image_url, 
        quantity: 1 
      }];
    });
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart((prevCart) =>
      prevCart.map((item) => {
        if (item.id === id) {
          const newQuantity = item.quantity + delta;
          return { ...item, quantity: newQuantity > 0 ? newQuantity : 1 };
        }
        return item;
      })
    );
  };

  const removeFromCart = (id: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== id));
  };

  const clearCart = () => setCart([]);

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
  const cartTotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);

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