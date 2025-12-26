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
    const body = await request.json();
    const items = body.items;

    if (!Array.isArray(items) || items.length === 0) {
      // nothing to merge → just return cart
      const cart = await getUserCart(user.id);

      const { data: cartItems } = await supabase
        .from("cartItems")
        .select(
          `*,
           product:products(*, productImages(*)),
           variant:ProductVariants(*)`
        )
        .eq("cart_id", cart.id);

      return NextResponse.json(
        { ...cart, items: cartItems || [] },
        { status: 200 }
      );
    }

    const cart = await getUserCart(user.id);

    // 🔁 merge each item
    for (const item of items) {
      const { product_id, variant_id, quantity } = item;

      if (!product_id || !variant_id || quantity <= 0) continue;

      const { data: existingItem } = await supabase
        .from("cartItems")
        .select("*")
        .eq("cart_id", cart.id)
        .eq("variant_id", variant_id)
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
          product_id,
          variant_id,
          quantity,
        });
      }
    }

    // ✅ return FULL cart
    const { data: mergedItems, error } = await supabase
      .from("cartItems")
      .select(
        `*,
         product:products(*, productImages(*)),
         variant:ProductVariants(*)`
      )
      .eq("cart_id", cart.id);

    if (error) throw error;

    return NextResponse.json(
      { ...cart, items: mergedItems || [] },
      { status: 200 }
    );
  } catch (error) {
    console.error("POST /cart/merge error:", error);
    return NextResponse.json(
      { error: "Failed to merge cart" },
      { status: 500 }
    );
  }
}
