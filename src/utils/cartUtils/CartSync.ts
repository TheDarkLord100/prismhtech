import { createClient } from "@/utils/supabase/client";
import type { CartWithItems } from "@/types/cart";

export const syncCartWithServer = async (localCart: CartWithItems) => {
  if (!localCart || localCart.items.length === 0) return;

  const supabase = createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) return;

  // 1️⃣ Ensure cart exists
  const { data: dbCart, error: fetchError } = await supabase
    .from("carts")
    .select("*")
    .eq("user_id", user.id)
    .single();

  let cartId = dbCart?.id;

  if (!cartId) {
    const { data: newCart, error: createError } = await supabase
      .from("carts")
      .insert({ user_id: user.id })
      .select()
      .single();

    if (createError) throw createError;
    cartId = newCart.id;
  }

  // 2️⃣ Sync items
  for (const item of localCart.items) {
    if (item.item_type === "metal") {
      await supabase.from("cart_items").upsert(
        {
          cart_id: cartId,
          item_type: "metal",
          metal_id: item.metal!.id,
          quantity: item.quantity,
          unit_price: item.unit_price!,
        },
        {
          onConflict: "cart_id,metal_id",
        }
      );
    } else {
      await supabase.from("cart_items").upsert(
        {
          cart_id: cartId,
          item_type: "product",
          product_id: item.product!.id,
          variant_id: item.variant!.pvr_id,
          quantity: item.quantity,
        },
        {
          onConflict: "cart_id,product_id,variant_id",
        }
      );
    }
  }
};
