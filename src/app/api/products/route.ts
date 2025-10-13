import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createClient } from "../../../utils/supabase/server";

export async function GET(req: Request) {
  try {
    const supabase = createClient(cookies());
    const { searchParams } = new URL(req.url);

    const category = searchParams.get("category");
    const brand = searchParams.get("brand");

    let query = supabase
      .from("products")
      .select(`
        *,
        productImages (id, image_url, alt_text, priority),
        ProductVariants (pvr_id, name, price, quantity)
      `);

    if (category) {
      query = query.eq("product_category_id", category);
    }

    if (brand) {
      query = query.eq("brand_id", brand);
    }

    const { data, error } = await query;
    if (error) throw error;

    return NextResponse.json(data, { status: 200 });
  } catch (error: unknown) {
    console.error("GET /products error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : JSON.stringify(error) },
      { status: 500 }
    );
  }
}