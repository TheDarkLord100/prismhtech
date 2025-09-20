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
      .select("*")
      .eq("id", id)
      .single<Product>();

    if (error) throw error;

    return NextResponse.json(data, { status: 200 });
  } catch (error: unknown) {
    console.error(`GET /products/[id] error:`, error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}