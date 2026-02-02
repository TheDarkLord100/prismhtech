import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createClient } from "../../../../utils/supabase/server";
import type { Product, Variant, ProductImage } from "@/types/product";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = createClient(cookies());
    const { id } = await params;

    const { data, error } = await supabase
      .from("products")
      .select(`
        *, 
        productImages (id, image_url, alt_text, priority),
        ProductVariants (pvr_id, name, price)`)
      .eq("id", id)
      .single<Product & { productImages: ProductImage[], ProductVariants: Variant[] }>();

    if (error) throw error;
    return NextResponse.json({ ...data }, { status: 200 });
  } catch (error: unknown) {
    console.error(`GET /products/[id] error:`, error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}