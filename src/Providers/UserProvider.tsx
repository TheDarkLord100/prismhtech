"use client";

import { useEffect } from "react";
import { useUserStore } from "@/utils/store/userStore";

export default function UserProvider({ children }: { children: React.ReactNode }) {
  const fetchUser = useUserStore((s) => s.fetchUser);

  useEffect(() => {
    fetchUser(); // runs once on app load
  }, [fetchUser]);

  return <>{children}</>;
}
