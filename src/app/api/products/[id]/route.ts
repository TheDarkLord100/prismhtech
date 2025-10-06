import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createClient } from "../../../../utils/supabase/server";
import type { Product } from "@/types/entities";

// GET Single Product by ID
export async function GET(
  request: Request,
  context: any
) {
  try {
    const supabase = createClient(cookies());
    const { id } = context.params;

    const { data, error } = await supabase
      .from("products")
      .select(`*, productImages (id, image_url, alt_text, priority)`)
      .eq("id", id)
      .single<Product>();

    if (error) throw error;

    const {data: relatedProducts, error: relatedError} = await supabase
      .from("RelatedProducts")
      .select(`id, related_product:related_product_id (
        *, 
        productImages (id, image_url, alt_text, priority)
        )`)
      .eq("product_id", id);

    if (relatedError) throw relatedError;

    const relatedProductList = relatedProducts?.map((rp) => rp.related_product) || [];

    return NextResponse.json({ ...data, relatedProducts: relatedProductList }, { status: 200 });
  } catch (error: unknown) {
    console.error(`GET /products/[id] error:`, error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}