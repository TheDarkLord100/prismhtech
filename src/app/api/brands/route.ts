import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server"; // adjust if needed

export async function GET() {
  try {
    const supabase = createClient(cookies());

    const { data, error } = await supabase
      .from("Brands")
      .select("id, name, logo_url");

    if (error) throw error;

    const formatted = (data ?? []).map((brand) => ({
      ...brand,
      logo_url: brand.logo_url
    }));

    return NextResponse.json(formatted, { status: 200 });
  } catch (error: unknown) {
    const message =
      error instanceof Error
        ? error.message
        : typeof error === "string"
          ? error
          : "Unknown error";

    console.error("GET /api/brands error:", error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
