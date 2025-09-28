// context/CartContext.tsx
"use client";
import { createContext, useContext, useState, ReactNode } from "react";

export type CartItem = {
  id: number | string;
  name: string;
  price: number;
  unit?: string;
  qty: number;
  img: string;
  delivery?: string;
  checked?: boolean;
};

export type SavedItem = {
  id: number | string;
  name: string;
  price: number;
  unit?: string;
  img: string;
};

type CartContextType = {
  items: CartItem[];
  addToCart: (item: Omit<CartItem, "qty"> & { qty?: number }) => void;
  updateQty: (id: number | string, qty: number) => void;
  toggleCheck: (id: number | string) => void;
  removeFromCart: (id: number | string) => void;

  savedItems: SavedItem[];
  addSavedItem: (item: SavedItem) => void;
  removeSavedItem: (id: number | string) => void;
  moveSavedToCart: (id: number | string) => void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [savedItems, setSavedItems] = useState<SavedItem[]>([
    { id: 101, name: "Copper Scrap", price: 19.5, unit: "per Kg", img: "/partners/partner.png" },
    { id: 102, name: "Iron Scrap", price: 15.0, unit: "per Kg", img: "/partners/partner.png" },
    { id: 103, name: "Brass Scrap", price: 30.2, unit: "per Kg", img: "/partners/partner.png" },
  ]);

  const addToCart = (newItem: Omit<CartItem, "qty"> & { qty?: number }) => {
    setItems((prev) => {
      const exists = prev.find((it) => it.id === newItem.id);
      if (exists) {
        return prev.map((it) =>
          it.id === newItem.id ? { ...it, qty: it.qty + (newItem.qty || 1) } : it
        );
      }
      return [
        ...prev,
        {
          id: newItem.id,
          name: newItem.name,
          price: newItem.price,
          unit: newItem.unit,
          img: newItem.img,
          qty: newItem.qty || 1,
          delivery: newItem.delivery || "Tomorrow, 28 Aug",
          checked: newItem.checked !== undefined ? newItem.checked : true,
        },
      ];
    });
  };

  const updateQty = (id: number | string, qty: number) => {
    setItems((prev) => prev.map((it) => (it.id === id ? { ...it, qty } : it)));
  };

  const toggleCheck = (id: number | string) => {
    setItems((prev) => prev.map((it) => (it.id === id ? { ...it, checked: !it.checked } : it)));
  };

  const removeFromCart = (id: number | string) => {
    setItems((prev) => prev.filter((it) => it.id !== id));
  };

  // Saved items (Your Items)
  const addSavedItem = (item: SavedItem) => {
    setSavedItems((prev) => {
      const exists = prev.find((it) => it.id === item.id);
      if (exists) return prev; // avoid duplicates
      return [...prev, item];
    });
  };

  const removeSavedItem = (id: number | string) => {
    setSavedItems((prev) => prev.filter((it) => it.id !== id));
  };

  const moveSavedToCart = (id: number | string) => {
    const item = savedItems.find((it) => it.id === id);
    if (!item) return;
    addToCart({ id: item.id, name: item.name, price: item.price, unit: item.unit, img: item.img, qty: 1 });
    removeSavedItem(id);
  };

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        updateQty,
        toggleCheck,
        removeFromCart,
        savedItems,
        addSavedItem,
        removeSavedItem,
        moveSavedToCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider");
  return context;
}
