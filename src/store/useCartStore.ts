import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// සෙරෙප්පුවක විස්තර
export interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  size: string;
  quantity: number;
}

interface CartStore {
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set) => ({
      cart: [],
      addToCart: (item) => set((state) => {
        const existing = state.cart.find((i) => i.id === item.id && i.size === item.size);
        if (existing) {
          return {
            cart: state.cart.map((i) =>
              i.id === item.id && i.size === item.size
                ? { ...i, quantity: i.quantity + 1 }
                : i
            ),
          };
        }
        return { cart: [...state.cart, { ...item, quantity: 1 }] };
      }),
      removeFromCart: (id) =>
        set((state) => ({ cart: state.cart.filter((i) => i.id !== id) })),
      clearCart: () => set({ cart: [] }),
    }),
    { name: 'reina-cart-storage' } // Browser එක close කළත් cart එක මැකෙන්නේ නැහැ
  )
);