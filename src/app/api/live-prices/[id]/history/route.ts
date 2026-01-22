import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/client";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = createClient();
    const { id } = await params;
    const { data, error } = await supabase
      .from("metal_price_history")
      .select("price_date, price")
      .eq("metal_id", id)
      .order("price_date", { ascending: true });

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ history: data }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json(
      { error: "Failed to load price history" },
      { status: 500 }
    );
  }
}
