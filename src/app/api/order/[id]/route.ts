import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createClient } from "../../../../utils/supabase/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = createClient(cookies());
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { error: "order_id is required" },
        { status: 400 }
      );
    }

    /* ---------------- AUTH ---------------- */
    const { data: userData, error: authError } = await supabase.auth.getUser();
    const user = userData?.user;

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    /* ---------------- ORDER ---------------- */
    const { data: order, error: orderError } = await supabase
      .from("Orders")
      .select(`
        *,
        shipping_address:Addresses!Orders_shipping_address_id_fkey (*),
        billing_address:Addresses!Orders_billing_address_id_fkey (*)
      `)
      .eq("id", id)
      .single();

    if (orderError || !order) {
      return NextResponse.json(
        { error: "Order not found" },
        { status: 404 }
      );
    }

    if (order.user_id !== user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    /* ---------------- ITEMS ---------------- */
    const { data: items, error: itemsError } = await supabase
      .from("OrderItems")
      .select(`
        *,
        product:products (
          *,
          productImages (*)
        ),
        variant:ProductVariants (*)
      `)
      .eq("ordr_id", id);

    if (itemsError) throw itemsError;

    /* ---------------- STATUS HISTORY ---------------- */
    const { data: history, error: historyError } = await supabase
      .from("OrderStatusHistory")
      .select(`
        id,
        old_status,
        new_status,
        changed_at,
        note
      `)
      .eq("order_id", id)
      .order("changed_at", { ascending: true });

    if (historyError) throw historyError;

    /* ---------------- RESPONSE ---------------- */
    return NextResponse.json(
      {
        order: {
          ...order,
          items: items ?? [],
          history: history ?? [],
        },
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error("GET /order/:id error:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Internal Server Error",
      },
      { status: 500 }
    );
  }
}
