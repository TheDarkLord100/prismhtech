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
import { useUserStore } from "./userStore";

interface CartStore {
  cart: CartWithItems | null;
  loading: boolean;
  error: string | null;
  message?: string | null;

  addToCart: (product: Product, variant: Variant, quantity: number) => Promise<void>;
  updateCartItem: (cartItemId: string, quantity: number) => Promise<void>;
  removeFromCart: (id: string) => Promise<void>;
  clearCart: ({ invisible }: { invisible: boolean }) => Promise<void>;
  fetchCart: () => Promise<void>;
  mergeGuestCart: () => Promise<void>;

  getTotalItems: () => number;
  getTotalPrice: () => number;
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
        console.log("Adding to cart:", { product, variant, quantity });
        console.log("Current cart state:", get().cart);
        const { user } = useUserStore.getState();
        const cart = get().cart || { id: "local-cart", items: [] as CartItemDetails[] };
        if (!user) {
          const localCart = cart;
          localCart?.items.push({
            id: `local-${Date.now()}`,
            product,
            variant,
            quantity,
          });
          set({ cart: localCart, loading: false, message: "Item added to cart" });
          return;
        }
        try {
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
          console.log("Updated local cart:", cart);
          set({ cart, loading: false, message: "Item added to cart" });
        } catch (error: any) {
          set({ loading: false, error: error.message });
        }
      },

      updateCartItem: async (CartItemId, quantity) => {
        const { removeFromCart } = get();
        const cart = get().cart || { id: "local-cart", items: [] as CartItemDetails[] };
        const { user } = useUserStore.getState();

        if (quantity === 0) {
          return await removeFromCart(CartItemId);
        }

        if (!user) {
          const localCart = cart;
          const itemIndex = localCart?.items.findIndex(item => item.id === CartItemId);
          if (itemIndex !== undefined && itemIndex > -1 && localCart) {
            localCart.items[itemIndex].quantity = quantity;
            set({ cart: localCart, loading: false, message: "Cart updated successfully" });
          }
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

        } catch (error: any) {
          set({ loading: false, error: error.message });
        }
      },

      removeFromCart: async (CartItemId) => {
        const { user } = useUserStore.getState();
        const { cart } = get();
        if (!user) {
          const localCart = cart;
          const updatedItems = localCart?.items.filter(item => item.id !== CartItemId) || [];
          localCart!.items = updatedItems;
          set({ cart: localCart, loading: false, message: "Item removed from cart" });
          return;
        }
        try {
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
        } catch (error: any) {
          set({ loading: false, error: error.message });
        }
      },

      clearCart: async ({ invisible = false }) => {
        const { user } = useUserStore.getState();
        const cart = get().cart || { id: "local-cart", items: [] as CartItemDetails[] };

        if (!user) {
          cart.items = [];
          set({ cart, loading: false, message: invisible ? null : "Cart cleared successfully" });
          return;
        }

        set({ loading: true, error: null });
        try {
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
        } catch (error: any) {
          set({ loading: false, error: error.message });
        }
      },

      fetchCart: async () => {
        set({ loading: true, error: null, cart: null });
        try {
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
        } catch (error: any) {
          set({ loading: false, error: error.message });
        }

      },
      mergeGuestCart: async () => {
        const { user } = useUserStore.getState();
        const cart = get().cart;

        if (!user) return;
        if (!cart || cart.id !== "local-cart") return;
        if (!cart.items || cart.items.length === 0) return;

        const payload = cart.items.map(item => ({
          product_id: item.product.id,
          variant_id: item.variant.pvr_id,
          quantity: item.quantity,
        }));

        set({ loading: true, error: null });

        try {
          const res = await fetch("/api/cart/merge", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ items: payload }),
          });

          if (!res.ok) throw new Error("Cart merge failed");

          const mergedCart = await res.json();

          // 🔥 DB cart becomes source of truth
          set({
            cart: mergedCart,
            loading: false,
          });
        } catch (error: any) {
          set({ loading: false, error: error.message });
        }
      },
      
      getTotalItems: () => {
        const cart = get().cart;
        if (!cart || !cart.items) return 0;
        return cart.items.reduce((sum, item) => sum + item.quantity, 0);
      },

      getTotalPrice: () => {
        const cart = get().cart;
        if (!cart || !cart.items) return 0;
        return cart.items.reduce((sum, item) => {
          const price = item.variant?.price ?? item.product?.price ?? 0;
          return sum + price * item.quantity;
        }, 0);
      },
    }),

    {
      name: "cart-storage", // persist in localStorage
    }
  )
);


