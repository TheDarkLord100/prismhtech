import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";

export const getUserCart = async (userId: string) => {

    const supabase = createClient(cookies());
    const { data: carts, error } = await supabase
        .from("carts")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: true })
        .limit(1);

    if (error) throw error;

    if (carts.length > 0) {
        return carts[0];
    }

    const { data: newCart, error: insertError } = await supabase
        .from("carts")
        .insert({ user_id: userId })
        .select("*")
        .single();

    if (insertError) throw insertError;

    return newCart;
}