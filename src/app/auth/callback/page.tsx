"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { notify, Notification } from "@/utils/notify";
import { useUserStore } from "@/utils/store/userStore";
import { useCartStore } from "@/utils/store/useCartStore";

export default function AuthCallbackPage() {
  const supabase = createClient();
  const router = useRouter();
  const params = useSearchParams();
  const redirectTo = params.get("redirectedFrom") || "/";

  useEffect(() => {
    const run = async () => {
      // 1️⃣ Check if Supabase returned an error
      const error = params.get("error");
      const errorDescription = params.get("error_description");

      if (error) {
        if (error === "access_denied") {
          notify(
            Notification.FAILURE,
            errorDescription?.includes("expired")
              ? "Your verification link has expired. Please request a new one."
              : "Authentication failed. Please try again."
          );
        }

        router.replace("/verify-email");
        return;
      }

      // 2️⃣ Exchange code for session (email verify, magic links, OAuth)
      await supabase.auth.exchangeCodeForSession(window.location.href);

      // 3️⃣ Get user
      const { data } = await supabase.auth.getUser();

      if (!data.user) {
        router.replace("/login?reason=auth");
        return;
      }

      // 4️⃣ Email not verified
      if (!data.user.email_confirmed_at) {
        router.replace("/verify-email");
        return;
      }

      // 5️⃣ Load profile
      await useUserStore.getState().fetchUser();
      const user = useUserStore.getState().user;

      if (!user?.phone || !user?.gstin) {
        router.replace("/onboarding");
        return;
      }

      await useCartStore.getState().mergeGuestCart();
      router.replace(redirectTo);
    };

    run();
  }, []);

  return <p className="mt-10 text-center">Signing you in…</p>;
}
