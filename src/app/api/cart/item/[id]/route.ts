import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import { getUserCart } from "../../utils/getUserCart";

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
    const supabase = createClient(cookies());
    const { id } = params;

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    try {
        const cart = await getUserCart(user.id);

        const { error: deleteError } = await supabase
            .from("cartItems")
            .delete()
            .eq("cart_id", cart.id)
            .eq("id", id);

        if (deleteError) throw deleteError;

        const { data: cartItems, error: itemsError } = await supabase
            .from("cartItems")
            .select(`*,
                product:products(*),
                variant:ProductVariants(*)`)
            .eq("cart_id", cart.id);

        if (itemsError) throw itemsError;
        return NextResponse.json({ ...cart, items: cartItems || [] }, { status: 200 });
    } catch (error) {
        console.error("DELETE /cart/item/[id] error:", error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : String(error) },
            { status: 500 }
        );
    }
}

export async function PUT(
    request: Request,
    { params }: { params: { id: string } }
) {
    const supabase = createClient(cookies());
    const { id } = params;

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { quantity } = body;
    if (!quantity || quantity <= 0) {
        return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }
    try {
        const cart = await getUserCart(user.id);

        const { error: updateError } = await supabase
            .from("cartItems")
            .update({ quantity })
            .eq("cart_id", cart.id)
            .eq("id", id);
        if (updateError) throw updateError;

        const { data: cartItems, error: itemsError } = await supabase
            .from("cartItems")
            .select(`*,
                product:products(*),
                variant:ProductVariants(*)`)
            .eq("cart_id", cart.id);
        
        if (itemsError) throw itemsError;
        return NextResponse.json({ ...cart, items: cartItems || [] }, { status: 200 });
    } catch (error) {
        console.error("PUT /cart/item/[id] error:", error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : String(error) },
            { status: 500 }
        );
    }
}