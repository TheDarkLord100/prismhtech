import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import { getUserCart } from "../utils/getUserCart";

export async function POST(request: Request) {
    const supabase = createClient(cookies());

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    try {

        const cart = await getUserCart(user.id);

        if (body.clear) {
            await supabase.from("cartItems").delete().eq("cart_id", cart.id);
            return NextResponse.json({ message: "Cart cleared" }, { status: 200 });
        }

        const { product_id, variant_id, quantity } = body;
        if (!product_id || !variant_id || !quantity || quantity <= 0) {
            return NextResponse.json({ error: "Invalid input" }, { status: 400 });
        }

        const { data: existingItem, error: fetchError } = await supabase
            .from("cartItems")
            .select("*")
            .eq("cart_id", cart.id)
            .eq("variant_id", variant_id)
            .maybeSingle();

        if (fetchError) throw fetchError;
        if (existingItem) {
            const newQuantity = existingItem.quantity + quantity;
            const { error: updateError } = await supabase
                .from("cartItems")
                .update({ quantity: newQuantity })
                .eq("id", existingItem.id);
            if (updateError) throw updateError;
        } else {
            const { error: insertError } = await supabase
                .from("cartItems")
                .insert({ cart_id: cart.id, product_id, variant_id, quantity });
            if (insertError) throw insertError;
        }

        const { data: cartItems, error: itemsError } = await supabase
            .from("cartItems")
            .select(`*,
                product:products(*),
                variant:ProductVariants(*)`)
            .eq("cart_id", cart.id);

        if (itemsError) throw itemsError;
        return NextResponse.json({ ...cart, items: cartItems || [] }, { status: 200 });

    } catch (error) {
        console.error("POST /cart/item error:", error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : String(error) },
            { status: 500 }
        );
    }
}