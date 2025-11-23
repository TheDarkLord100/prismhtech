import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createClient } from "../../../utils/supabase/server";

export async function GET(request: Request) {
    try {

        const supabase = createClient(cookies());

        const { data: userData, error: authError } = await supabase.auth.getUser();
        const user = userData?.user;

        if (authError || !user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }


        const { data: orders, error: ordersErr } = await supabase
            .from("Orders")
            .select(
                `
        *,
        shipping_address:Addresses!Orders_shipping_address_id_fkey(*),
        billing_address:Addresses!Orders_billing_address_id_fkey(*)
        `
            )
            .eq("user_id", user.id)
            .order("created_at", { ascending: false });

        if (ordersErr) throw ordersErr;

        const orderIds = orders.map((o) => o.id);

        const { data: items, error: itemsErr } = await supabase
            .from("OrderItems")
            .select(
                `
        *,
        product:products(
          *,
          productImages(*)
        ),
        variant:ProductVariants(*)
        `
            )
            .in("ordr_id", orderIds);

        if (itemsErr) throw itemsErr;

        const ordersWithItems = orders.map((order) => ({
            ...order,
            items: items.filter((item) => item.ordr_id === order.id),
        }));

        return NextResponse.json(
            { orders: ordersWithItems },
            { status: 200 }
        );

    } catch (error: any) {
        console.error("GET /order error:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}