import { create } from "zustand";

type CartItem = {
  id: string;
  name: string;
  price: number;
  img: string;
  qty: number;
  unit?: string;
};

type CartStore = {
  cart: CartItem[];
  addToCart: (item: Omit<CartItem, "qty">) => void;
  increment: (id: string) => void;
  decrement: (id: string) => void;
  removeFromCart: (id: string) => void;
};

export const useCartStore = create<CartStore>((set) => ({
  cart: [],
  addToCart: (item) =>
    set((state) => {
      const exists = state.cart.find((p) => p.id === item.id);
      if (exists) {
        return {
          cart: state.cart.map((p) =>
            p.id === item.id ? { ...p, qty: p.qty + 1 } : p
          ),
        };
      }
      return { cart: [...state.cart, { ...item, qty: 1 }] };
    }),
  increment: (id) =>
    set((state) => ({
      cart: state.cart.map((p) =>
        p.id === id ? { ...p, qty: p.qty + 1 } : p
      ),
    })),
  decrement: (id) =>
    set((state) => ({
      cart: state.cart
        .map((p) =>
          p.id === id ? { ...p, qty: Math.max(p.qty - 1, 0) } : p
        )
        .filter((p) => p.qty > 0),
    })),
  removeFromCart: (id) =>
    set((state) => ({
      cart: state.cart.filter((p) => p.id !== id),
    })),
}));
