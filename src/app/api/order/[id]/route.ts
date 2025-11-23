import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createClient } from "../../../../utils/supabase/server";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const supabase = createClient(cookies());
        const { id } = await params;
        if (!id) {
            return NextResponse.json(
                { error: "order_id query parameter is required" },
                { status: 400 }
            );
        }

        const { data: user, error: authError } = await supabase.auth.getUser();
        if (authError || !user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { data: orderData, error } = await supabase
            .from("Orders")
            .select(`
        *,
        shipping_address:Addresses!Orders_shipping_address_id_fkey (*),
        billing_address:Addresses!Orders_billing_address_id_fkey (*)
        `)
            .eq("id", id)
            .single();

        if (error) throw error;

        if (orderData.user_id !== user.user.id) {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        const { data: items, error: itemsErr } = await supabase
            .from("OrderItems")
            .select(`
    *,
    product:products(
      *,
      productImages(*)
    ),
    variant:ProductVariants(*)
  `)
            .eq("ordr_id", id);

        if (itemsErr) throw itemsErr;

        return NextResponse.json(
            {
                order: orderData,
                items: items,
            },
            { status: 200 }
        );
    } catch (error: unknown) {
        console.error("GET /order error:", error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : JSON.stringify(error) },
            { status: 500 }
        );
    }
}