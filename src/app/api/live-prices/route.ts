import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/client";

export async function GET() {
    try {
        const supabase = createClient();

        const { data, error } = await supabase
            .from("metals_live_prices")
            .select(`
            id,
            name,
            live_price,
            lot_size,
            minimum_quantity,
            last_updated_at
            `)
            .eq("is_visible", true)
            .not("live_price", "is", null);

        if (error) throw error;

        const today = new Date().toISOString().slice(0, 10);

        const metals = data.filter((m) =>
            m.last_updated_at.startsWith(today)
        );

        return NextResponse.json({ metals }, { status: 200 });
    } catch (err) {
        const error = err as Error;
        console.error("GET error:", error.message);

        return NextResponse.json(
            { error: error.message || "Failed to get Live prices" },
            { status: 500 }
        );
    }
}
