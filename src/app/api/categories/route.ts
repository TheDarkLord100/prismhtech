import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/client"; 

export async function GET() {
  try {
    // create supabase instance
    const supabase = createClient();

    const { data, error } = await supabase
      .from("ProductCategories")
      .select("id, name, description, image_url");

    if (error) throw error;

    return NextResponse.json(data, { status: 200 });
  } catch (err) {
    const error = err as Error;
    console.error("GET /api/categories error:", error.message);

    return NextResponse.json(
      { error: error.message || "Failed to fetch categories" },
      { status: 500 }
    );
  }
}
