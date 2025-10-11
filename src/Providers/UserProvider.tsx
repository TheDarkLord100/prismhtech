"use client";

import { useEffect } from "react";
import { useUserStore } from "@/utils/store/userStore";
import { useCartStore } from "@/utils/store/useCartStore";

export default function GlobalProvider({ children }: { children: React.ReactNode }) {
  const fetchUser = useUserStore((s) => s.fetchUser);
  const { fetchCart, clearCart } = useCartStore();

  useEffect(() => { 
    const init = async () => {
      await fetchUser();
      const currentUser = useUserStore.getState().user;
      if (currentUser) {
        await fetchCart();
      } else {
        clearCart();
      }
    };

    init();
  }, []);

  return <>{children}</>;
}
