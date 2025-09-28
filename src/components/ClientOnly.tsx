"use client";

import { useState, useEffect, ReactNode } from "react";

export default function ClientOnly({ children }: { children: ReactNode }) {
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  if (!hydrated) return null; // render nothing on server

  return <>{children}</>;
}
