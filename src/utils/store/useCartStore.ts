"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  Cart,
  CartItem,
  Product,
  Variant,
  CartItemDetails,
  CartWithItems
} from "@/types/entities";

interface CartStore {
  cart : CartWithItems | null;
  loading: boolean;
  error: string | null;
  message?: string | null;

  addToCart: (product: Product, variant: Variant, quantity: number) => Promise<void>;
  updateCartItem: (cartItemId: string, quantity: number) => Promise<void>;
  removeFromCart: (id: string) => Promise<void>;
  clearCart: () => Promise<void>;
  fetchCart: () => Promise<void>;

  totalItems: number;
  totalPrice: number;

}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      cart: null,
      loading: false,
      error: null,
      message: null,

      addToCart: async (product, variant, quantity) => {
          set({ loading: true, error: null });
          try{
            const response = await fetch(`/api/cart/item`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json"
              },
              credentials: "include",
              body: JSON.stringify({ product_id: product.id, variant_id: variant.pvr_id, quantity })
            });

            if (!response.ok) throw new Error("Failed to add item to cart");

            const cart = await response.json();
            set({ cart, loading: false, message: "Item added to cart" });
          } catch(error: any){
            set({ loading: false, error: error.message });
          }
      },

      updateCartItem: async (CartItemId, quantity) => {
        const { removeFromCart } = get();
        console.log("Update cart item:", CartItemId, quantity);
            if(quantity === 0) {
              return await removeFromCart(CartItemId);
            }
        try {
            set({ loading: true, error: null });

            const response = await fetch(`/api/cart/item/${CartItemId}`, {
              method: "PUT",
              headers: {
                "Content-Type": "application/json"
              },
              credentials: "include",
              body: JSON.stringify({ quantity })
            });
            if (!response.ok) throw new Error("Failed to update cart item");

            const cart = await response.json();
            set({ cart, loading: false, message: "Cart updated successfully" });

        } catch(error: any){
            set({ loading: false, error: error.message });
          }
      },

      removeFromCart: async (CartItemId) => {
        try{
            set({ loading: true, error: null });
            const response = await fetch(`/api/cart/item/${CartItemId}`, {
              method: "DELETE",
              headers: {
                "Content-Type": "application/json"
              },
              credentials: "include",
            });
            if (!response.ok) throw new Error("Failed to remove item from cart");

            const cart = await response.json();
            set({ cart, loading: false, message: "Item removed from cart" });
        } catch(error: any){
            set({ loading: false, error: error.message });
          }
      },

      clearCart: async () => {
        set({ loading: true, error: null });
          try{
            const response = await fetch(`/api/cart/item`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json"
              },
              credentials: "include",
              body: JSON.stringify({ clear: true })
            });

            if (!response.ok) throw new Error("Failed to clear cart");

            const cart = await response.json();
            set({ cart, loading: false, message: "Cart cleared successfully" });
          } catch(error: any){
            set({ loading: false, error: error.message });
          }
      },

      fetchCart: async () => {
        set({ loading: true, error: null });
          try{
            const response = await fetch(`/api/cart`, {
              method: "GET",
              headers: {
                "Content-Type": "application/json"
              },
              credentials: "include",
            });

            if (!response.ok) throw new Error("Failed to add item to cart");

            const cart = await response.json();
            set({ cart, loading: false });
          } catch(error: any){
            set({ loading: false, error: error.message });
          }

      },

      get totalItems() {
        const cart = get().cart;
        if (!cart || !cart.items) return 0;
        return cart.items.reduce((sum, item) => sum + item.quantity, 0);
      },

      get totalPrice() {
        const cart = get().cart;
        if (!cart || !cart.items) return 0;
        return cart.items.reduce((sum, item) => {
          const price = item.variant?.price ?? item.product.price ?? 0;
          return sum + price * item.quantity;
        }
        , 0);
      }
    }),
    {
      name: "cart-storage", // persist in localStorage
    }
  )
);


