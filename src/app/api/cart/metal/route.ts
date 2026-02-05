import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import { getUserCart } from "../utils/getUserCart";

export async function POST(request: Request) {
  const supabase = createClient(cookies());

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { metal_id, quantity } = await request.json();

    if (!metal_id || !quantity || quantity <= 0) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    const cart = await getUserCart(user.id);

    // 1️⃣ Fetch metal
    const { data: metal, error: metalError } = await supabase
      .from("metals_live_prices")
      .select("*")
      .eq("id", metal_id)
      .single();

    if (metalError || !metal) {
      return NextResponse.json({ error: "Metal not found" }, { status: 404 });
    }

    // 2️⃣ Validate visibility & date
    const today = new Date().toISOString().slice(0, 10);
    if (!metal.is_visible || !metal.last_updated_at.startsWith(today)) {
      return NextResponse.json(
        { error: "Metal price not available" },
        { status: 400 }
      );
    }

    // 3️⃣ Validate lots
    if (quantity < metal.minimum_quantity) {
      return NextResponse.json(
        { error: "Below minimum lots" },
        { status: 400 }
      );
    }

    if (quantity % metal.lot_size !== 0) {
      return NextResponse.json(
        { error: "Quantity must be multiple of lot size" },
        { status: 400 }
      );
    }

    // 4️⃣ Check existing metal cart item
    const { data: existingItem } = await supabase
      .from("cartItems")
      .select("*")
      .eq("cart_id", cart.id)
      .eq("item_type", "metal")
      .eq("metal_id", metal_id)
      .maybeSingle();

    if (existingItem) {
      await supabase
        .from("cartItems")
        .update({
          quantity: existingItem.quantity + quantity,
        })
        .eq("id", existingItem.id);
    } else {
      await supabase.from("cartItems").insert({
        cart_id: cart.id,
        item_type: "metal",
        metal_id,
        quantity,
        unit_price: metal.live_price, // 🔒 snapshot per lot
      });
    }

    // 5️⃣ Return full cart
    const { data: cartItems } = await supabase
      .from("cartItems")
      .select(
        `*,
         product:products(*, productImages(*)),
         variant:ProductVariants(*),
         metal:metals_live_prices(*)`
      )
      .eq("cart_id", cart.id);

    return NextResponse.json(
      { ...cart, items: cartItems || [] },
      { status: 200 }
    );
  } catch (error) {
    console.error("POST /cart/metal error:", error);
    return NextResponse.json(
      { error: "Failed to add metal to cart" },
      { status: 500 }
    );
  }
}
