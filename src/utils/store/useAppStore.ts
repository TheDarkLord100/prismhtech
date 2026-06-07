// store/useAppStore.ts
import { create } from "zustand";
import type { Category, Brand, Metal } from "@/types/entities";

interface AppStore {
  categories: Category[];
  brands: Brand[];
  loading: boolean;
  hydrated: boolean;
  fetchAppData: () => Promise<void>;
}

export const useAppStore = create<AppStore>((set, get) => ({
  categories: [],
  brands: [],
  loading: false,
  hydrated: false,

  fetchAppData: async () => {
    if (get().hydrated || get().loading) return; // Skip if already fetched or in-flight

    set({ loading: true });
    try {
      const [catRes, brandRes] = await Promise.all([
        fetch("/api/categories"),
        fetch("/api/brands"),
      ]);

      const [categories, brands] = await Promise.all([
        catRes.json(),
        brandRes.json(),
      ]);


      set({ categories, brands, hydrated: true });
    } catch (err) {
      console.error("Error loading app data:", err);
    } finally {
      set({ loading: false });
    }
  },
}));