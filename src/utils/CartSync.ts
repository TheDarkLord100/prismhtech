import { createClient } from "./supabase/client";
import type { CartWithItems } from "@/types/entities";
import { useUserStore } from "./store/userStore";

export const syncCartWithServer = async (cart: CartWithItems) => {
    if (!cart || cart.items.length === 0) return;

    const supabase = createClient();
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
        console.error("User not authenticated:", userError);
        return;
    }
    const { data: existingCart, error: fetchError } = await supabase
        .from("carts")
        .select("*")
        .eq("user_id", user.id)
        .single();

    if (fetchError && fetchError.code === "PGRST116") {
        const { data: newCart, error: createError } = await supabase
            .from("carts")
            .insert({ user_id: user.id })
            .select()
            .single();

        cart = newCart as CartWithItems;
    }

    for (const item of cart.items) {
        await supabase.from("cart_items").upsert({
            cart_id: cart.id,
            product_id: item.product.id,
            variant_id: item.variant.pvr_id,
            quantity: item.quantity,
        }, { onConflict: "cart_id,product_id,variant_id" });
    }
};