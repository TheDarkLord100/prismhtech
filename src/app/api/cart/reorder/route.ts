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

    try {
        const body = await request.json();
        const { order_id } = body;

        if (!order_id) {
            return NextResponse.json({ error: "Order ID required" }, { status: 400 });
        }

        // 1. Verify ownership
        const { data: order, error: orderError } = await supabase
            .from("Orders")
            .select("id, user_id")
            .eq("id", order_id)
            .single();

        if (orderError || !order) {
            return NextResponse.json({ error: "Order not found" }, { status: 404 });
        }

        if (order.user_id !== user.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
        }

        // 2. Fetch order items (ONLY products)
        const { data: orderItems, error: itemsError } = await supabase
            .from("OrderItems")
            .select("*")
            .eq("ordr_id", order_id)
            .eq("item_type", "product");

        if (itemsError) throw itemsError;

        if (!orderItems || orderItems.length === 0) {
            return NextResponse.json({ error: "No valid product items" }, { status: 400 });
        }

        // 3. Validate products + variants exist
        const productIds = orderItems.map(i => i.product_id);
        const variantIds = orderItems.map(i => i.variant_id);

        const { data: products } = await supabase
            .from("products")
            .select("id")
            .in("id", productIds);

        const { data: variants } = await supabase
            .from("ProductVariants")
            .select("pvr_id, price")
            .in("pvr_id", variantIds);

        const validProductIds = new Set(products?.map(p => p.id));
        const variantMap = new Map(variants?.map(v => [v.pvr_id, v]));

        for (const item of orderItems) {
            if (
                !validProductIds.has(item.product_id) ||
                !variantMap.has(item.variant_id)
            ) {
                return NextResponse.json(
                    { error: "Some items are no longer available" },
                    { status: 400 }
                );
            }
        }

        // 4. Get or create cart
        const cart = await getUserCart(user.id);

        // 5. Fetch existing cart items
        const { data: existingItems, error: existingError } = await supabase
            .from("cartItems")
            .select("*")
            .eq("cart_id", cart.id)
            .eq("item_type", "product");

        if (existingError) throw existingError;

        const cartMap = new Map();
        existingItems?.forEach(item => {
            const key = `${item.product_id}_${item.variant_id}`;
            cartMap.set(key, item);
        });

        // 6. Prepare operations
        const inserts = [];
        const updates = [];

        for (const item of orderItems) {
            const key = `${item.product_id}_${item.variant_id}`;
            const existing = cartMap.get(key);

            const variant = variantMap.get(item.variant_id);
            const latestPrice = variant!.price;

            if (existing) {
                updates.push({
                    id: existing.id,
                    quantity: existing.quantity + item.quantity,
                });
            } else {
                inserts.push({
                    cart_id: cart.id,
                    product_id: item.product_id,
                    variant_id: item.variant_id,
                    quantity: item.quantity,
                    unit_price: latestPrice,
                    item_type: "product",
                });
            }
        }

        // 7. Execute inserts
        if (inserts.length > 0) {
            const { error } = await supabase.from("cartItems").insert(inserts);
            if (error) throw error;
        }

        // 8. Execute updates
        for (const update of updates) {
            const { error } = await supabase
                .from("cartItems")
                .update({ quantity: update.quantity })
                .eq("id", update.id)
                .eq("cart_id", cart.id);

            if (error) throw error;
        }

        // 9. Return updated cart (same pattern as your APIs)
        const { data: cartItems, error: finalError } = await supabase
            .from("cartItems")
            .select(`*,
                product:products(*, productImages(*)),
                variant:ProductVariants(*),
                metal:metals_live_prices(*)`)
            .eq("cart_id", cart.id);

        if (finalError) throw finalError;

        return NextResponse.json(
            { ...cart, items: cartItems || [] },
            { status: 200 }
        );

    } catch (error) {
        console.error("POST /cart/reorder error:", error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : String(error) },
            { status: 500 }
        );
    }
}