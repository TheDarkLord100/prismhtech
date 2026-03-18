"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  CartItemDetails,
  CartWithItems
} from "@/types/cart";
import type {
  Product,
  Variant
} from "@/types/product"
import { useUserStore } from "./userStore";
import { Metal } from "@/types/entities";

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
  reorderCart: (orderId: string) => Promise<void>;

  getTotalItems: () => number;
  getTotalPrice: () => number;

  addMetalToCart: (metal: Metal, quantity: number) => Promise<void>;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      cart: null,
      loading: false,
      error: null,
      message: null,

      addToCart: async (product, variant, quantity) => {
        set({ loading: true, error: null, message: null });

        const { user } = useUserStore.getState();
        const cart = get().cart || { id: "local-cart", items: [] as CartItemDetails[] };

        if (!user) {
          const existingIndex = cart.items.findIndex(
            (item) =>
              item.item_type === "product" &&
              item.product?.id === product.id &&
              item.variant?.pvr_id === variant.pvr_id
          );

          let updatedItems;

          if (existingIndex > -1) {
            updatedItems = cart.items.map((item, i) =>
              i === existingIndex
                ? { ...item, quantity: item.quantity + quantity }
                : item
            );
          } else {
            updatedItems = [
              ...cart.items,
              {
                id: `local-${Date.now()}`,
                product,
                variant,
                quantity,
                item_type: "product" as const,
              },
            ];
          }

          set({
            cart: { ...cart, items: updatedItems },
            loading: false,
            message: "Item added to cart",
          });
          return;
        }

        try {
          const response = await fetch(`/api/cart/item`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({
              product_id: product.id,
              variant_id: variant.pvr_id,
              quantity,
            }),
          });

          if (!response.ok) throw new Error("Failed to add item to cart");

          const cartData = await response.json();

          set({ cart: cartData, loading: false, message: "Item added to cart" });
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
          const updatedItems = cart.items.map((item) =>
            item.id === CartItemId ? { ...item, quantity } : item
          );

          set({
            cart: { ...cart, items: updatedItems },
            loading: false,
            message: "Cart updated successfully",
          });

          return;
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
          const updatedItems = (cart?.items || []).filter(
            (item) => item.id !== CartItemId
          );

          set({
            cart: { ...cart!, items: updatedItems },
            loading: false,
            message: "Item removed from cart",
          });

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
          set({
            cart: { ...cart, items: [] },
            loading: false,
            message: invisible ? null : "Cart cleared successfully",
          });
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

        const payload = cart.items.map(item => {
          if (item.item_type === "metal") {
            return {
              item_type: "metal",
              metal_id: item.metal!.id,
              quantity: item.quantity,
              unit_price: item.unit_price!, // snapshot price
            };
          }

          // product item
          return {
            item_type: "product",
            product_id: item.product!.id,
            variant_id: item.variant!.pvr_id,
            quantity: item.quantity,
          };
        });

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
          if (item.item_type === "metal") {
            return sum + (item.unit_price ?? 0) * item.quantity;
          }

          const price = item.variant?.price ?? 0;
          return sum + price * item.quantity;
        }, 0);
      },

      reorderCart: async (orderId) => {
        const { user } = useUserStore.getState();

        if (!user) {
          set({ error: "Please login to reorder items" });
          return;
        }

        set({ loading: true, error: null, message: null });

        try {
          const res = await fetch("/api/cart/reorder", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify({ order_id: orderId }),
          });

          const data = await res.json();

          if (!res.ok) {
            throw new Error(data.error || "Failed to reorder");
          }

          set({
            cart: data,
            loading: false,
            message: "Items added to cart successfully",
          });

        } catch (error: any) {
          set({
            loading: false,
            error: error.message,
          });
        }
      },

      addMetalToCart: async (metal, quantity) => {
        set({ loading: true, error: null });
        const { user } = useUserStore.getState();
        const cart = get().cart || { id: "local-cart", items: [] as CartItemDetails[] };

        if (quantity < metal.minimum_quantity) {
          set({ loading: false, error: `Minimum quantity for ${metal.name} is ${metal.minimum_quantity}` });
          return;
        }

        if (quantity % metal.lot_size !== 0) {
          set({ loading: false, error: `Quantity for ${metal.name} must be in multiples of ${metal.lot_size}` });
          return;
        }

        if (!user) {
          const existingIndex = cart.items.findIndex(
            (item) =>
              item.item_type === "metal" &&
              item.metal?.id === metal.id
          );

          let updatedItems;

          if (existingIndex > -1) {
            updatedItems = cart.items.map((item, i) =>
              i === existingIndex
                ? { ...item, quantity: item.quantity + quantity }
                : item
            );
          } else {
            updatedItems = [
              ...cart.items,
              {
                id: `local-${Date.now()}`,
                metal,
                quantity,
                item_type: "metal" as const,
                unit_price: metal.live_price,
              },
            ];
          }

          set({
            cart: { ...cart, items: updatedItems },
            loading: false,
            message: "Item added to cart",
          });

          return;
        }

        try {
          const res = await fetch('/api/cart/metal', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ metal_id: metal.id, quantity })
          });

          if (!res.ok) throw new Error("Failed to add metal to cart");

          const cart = await res.json();
          set({ cart, loading: false, message: "Item added to cart" });
        } catch (error: any) {
          set({ loading: false, error: error.message });
        }
      }
    }),

    {
      name: "cart-storage", // persist in localStorage
    }
  )
);


