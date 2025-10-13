import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import type { Address } from "@/types/entities";

export async function POST(request: Request) {
    const supabase = createClient(cookies());
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const body: Address = await request.json();
        const { data: newAddress, error: insertError } = await supabase
            .from("Addresses")
            .upsert({ ...body, user_id: user.id })
            .select()
            .single();

        if (insertError) {
            throw insertError;
        }

        return NextResponse.json(newAddress, { status: 200 });
    } catch (error) {
        console.error("Error saving address:", error);
        return NextResponse.json({ error: "Failed to save address" }, { status: 500 });
    }
}

export async function GET(request: Request) {
    try {
        const supabase = createClient(cookies());
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError || !user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { data: addresses, error: fetchError } = await supabase
            .from("Addresses")
            .select("*")
            .eq("user_id", user.id)
            .order("created_at", { ascending: false });

        if (fetchError) {
            throw fetchError;
        }

        return NextResponse.json( addresses , { status: 200 });
    } catch (error) {
        console.error("Error fetching addresses:", error);
        return NextResponse.json({ error: "Failed to fetch addresses" }, { status: 500 });
    }
}