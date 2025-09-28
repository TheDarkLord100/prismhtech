import { create } from "zustand";
import { persist } from "zustand/middleware";
import { createClient } from "@/utils/supabase/client";
import { User } from "@/types/entities";

interface UserStore {
    user: User | null;
    setUser: (user: User | null) => void;
    fetchUser: () => Promise<void>;
    logout: () => Promise<void>;
}

export const useUserStore = create<UserStore>()(
    persist(
        (set) => ({
            user: null,

            setUser: (user) => set({ user }),

            fetchUser: async () => {
                const supabase = createClient();
                const { data: { user }, error } = await supabase.auth.getUser();
                if (error || !user) {
                    console.error("Error fetching user:", error?.message);
                    set({ user: null });
                    return;
                }

                const { data: userData, error: dbError } = await supabase
                    .from("users")
                    .select("*")
                    .eq("id", user.id)
                    .single();

                if (dbError) {
                    console.error("Error fetching user details:", dbError.message);
                    set({ user: { id: user.id, email: user.email! } }); // fallback
                } else {
                    set({ user: userData as User });
                }
            },

            logout: async () => {
                const supabase = createClient();
                await supabase.auth.signOut();
                set({ user: null });
            },
        }),
        {
            name: "user-storage", // persist in localStorage
        }
    )
);
