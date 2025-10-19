"use client";

import { useEffect } from "react";
import { useUserStore } from "@/utils/store/userStore";
import { useCartStore } from "@/utils/store/useCartStore";
import { syncCartWithServer } from "@/utils/cartUtils/CartSync";

export default function GlobalProvider({ children }: { children: React.ReactNode }) {
  const fetchUser = useUserStore((s) => s.fetchUser);
  const { fetchCart, clearCart, cart } = useCartStore();

  useEffect(() => { 
    const init = async () => {
      await fetchUser();
      const currentUser = useUserStore.getState().user;
      if (currentUser) {
        if (cart && cart.items.length > 0 && cart.id === "local-cart") {
          await syncCartWithServer(cart);
        }
        await fetchCart();
        
      } 
    };

    init();
  }, []);

  return <>{children}</>;
}
