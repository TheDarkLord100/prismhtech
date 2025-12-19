import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q")?.trim();

    if (!query) {
      return NextResponse.json({ products: [] });
    }

    const supabase = createClient(cookies());

    const { data, error } = await supabase
      .from("products")
      .select("id, name")
      .ilike("name", `%${query}%`)
      .order("name", { ascending: true })
      .limit(10);

    if (error) throw error;

    return NextResponse.json({
      products: data || [],
    });
  } catch (err) {
    console.error("Product search error:", err);
    return NextResponse.json(
      { error: "Failed to search products" },
      { status: 500 }
    );
  }
}
