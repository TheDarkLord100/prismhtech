"use client";

import { useEffect } from "react";
import { useUserStore } from "@/utils/store/userStore";
import { useCartStore } from "@/utils/store/useCartStore";
import { syncCartWithServer } from "@/utils/cartUtils/CartSync";
import { useAppStore } from "@/utils/store/useAppStore";

export default function GlobalProvider({ children }: { children: React.ReactNode }) {
  const fetchUser = useUserStore((s) => s.fetchUser);
  const { fetchCart, clearCart, cart } = useCartStore();
  const { fetchAppData } = useAppStore();

  useEffect(() => {
    const init = async () => {
      await Promise.all([                    // run in parallel with user init
        fetchAppData(),
        (async () => {
          await fetchUser();
          const currentUser = useUserStore.getState().user;
          if (currentUser) {
            if (cart && cart.items.length > 0 && cart.id === "local-cart") {
              await syncCartWithServer(cart);
            }
            await fetchCart();
          }
        })(),
      ]);
    };

    init();
  }, []);

  return <>{children}</>;
}
