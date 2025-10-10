import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";

export const getUserCart = async (userId: string) => {

    const supabase = createClient(cookies());
    const { data: cart, error } = await supabase
        .from("carts")
        .select("*")
        .eq("user_id", userId)
        .single();

    if (error && error.code === 'PGRST116') {
        const { data: newCart, error: createError } = await supabase
            .from("carts")
            .insert({ user_id: userId })
            .select("*")
            .single();

        if (createError) {
            throw createError;
        }
        return newCart;
    } else if (error) {
        throw error;
    }
    return cart;
}