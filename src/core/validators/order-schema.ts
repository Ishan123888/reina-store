import type { CartItem } from "@/context/CartContext";

export function calculateSubtotal(items: CartItem[]) {
  return items.reduce((sum, i) => sum + i.price * i.quantity, 0);
}

export function calculateTotal(items: CartItem[], deliveryFee: number) {
  return calculateSubtotal(items) + deliveryFee;
}

