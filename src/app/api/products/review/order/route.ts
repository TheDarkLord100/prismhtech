import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";

export async function GET(request: Request) {
  const supabase = createClient(cookies());

  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const order_id = searchParams.get("order_id");

    if (!order_id) {
      return NextResponse.json({ error: "order_id required" }, { status: 400 });
    }

    // 1. Verify ownership
    const { data: order } = await supabase
      .from("Orders")
      .select("id, user_id")
      .eq("id", order_id)
      .single();

    if (!order || order.user_id !== user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    // 2. Fetch order items (products only)
    const { data: orderItems, error: itemsError } = await supabase
      .from("OrderItems")
      .select(`
        id,
        product_id,
        variant_id,
        product:products(*, productImages(*)),
        variant:ProductVariants(*)
      `)
      .eq("ordr_id", order_id)
      .eq("item_type", "product");

    if (itemsError) throw itemsError;

    if (!orderItems || orderItems.length === 0) {
      return NextResponse.json([], { status: 200 });
    }

    // 3. Fetch existing reviews by user
    const productIds = orderItems.map(i => i.product_id);
    const variantIds = orderItems.map(i => i.variant_id);

    const { data: reviews } = await supabase
      .from("productReviews")
      .select("product_id, variant_id")
      .eq("user_id", user.id)
      .in("product_id", productIds)
      .in("variant_id", variantIds);

    const reviewedSet = new Set(
      (reviews || []).map(r => `${r.product_id}_${r.variant_id}`)
    );

    // 4. Filter reviewable items
    const reviewableItems = orderItems.filter(
      (item) =>
        !reviewedSet.has(`${item.product_id}_${item.variant_id}`)
    );

    return NextResponse.json(reviewableItems, { status: 200 });

  } catch (error) {
    console.error("GET /product/reviewable error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}