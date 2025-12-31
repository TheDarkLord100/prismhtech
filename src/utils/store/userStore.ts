import { create } from "zustand";
import { persist } from "zustand/middleware";
import { createClient } from "@/utils/supabase/client";
import { User } from "@/types/entities";

type EditableField = "name" | "phone" | "dob" | "location";

interface UserStore {
    user: User | null;
    setUser: (user: User | null) => void;
    fetchUser: () => Promise<void>;
    updateUserField: (
        field: EditableField,
        value: string
    ) => Promise<void>;
    logout: () => Promise<void>;
}

export const useUserStore = create<UserStore>()(
    persist(
        (set, get) => ({
            user: null,

            setUser: (user) => set({ user }),

            fetchUser: async () => {
                try {
                    const res = await fetch("/api/user/me");

                    if (!res.ok) {
                        set({ user: null });
                        return;
                    }

                    const data = await res.json();
                    set({ user: data as User });
                } catch {
                    set({ user: null });
                }
            },

            updateUserField: async (field, value) => {
                const currentUser = get().user;
                if (!currentUser) return;

                // optimistic update
                set({
                    user: {
                        ...currentUser,
                        [field]: value,
                    },
                });

                const res = await fetch("/api/user/update", {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ field, value }),
                });

                if (!res.ok) {
                    set({ user: currentUser });
                    const data = await res.json();
                    throw new Error(data.error || "Update failed");
                }

                const updatedUser = await res.json();
                set({ user: updatedUser });
            },

            logout: async () => {
                const supabase = createClient();
                await supabase.auth.signOut();
                set({ user: null });
            },
        }),
        {
            name: "user-storage",
        }
    )
);
