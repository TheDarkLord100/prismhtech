import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { getUserCart } from "./utils/getUserCart";
import { cookies } from "next/headers";

export async function GET(request: Request) {
    const supabase = createClient(cookies());

    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const cart = await getUserCart(user.id);

        const { data: cartItems, error: itemsError } = await supabase
            .from("cartItems")
            .select(`*,
                product:products(*, productImages(*)),
                variant:ProductVariants(*)`)
            .eq("cart_id", cart.id);

        if (itemsError) throw itemsError;
    

        return NextResponse.json({...cart, items: cartItems || []}, { status: 200 });
    } catch (error) {
        console.error("GET /cart error:", error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : String(error) },
            { status: 500 }
        );
    }
}