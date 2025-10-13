import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import type { Address } from "@/types/entities";

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const supabase = createClient(cookies());
    const id = (await params).id;
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    try {
        const body: Address = await request.json();
        const { data: updatedAddress, error: updateError } = await supabase
            .from("Addresses")
            .update(body)
            .eq("adr_id", id)
            .select()
            .single();

        if (updateError) {
            throw updateError;
        }

        return NextResponse.json(updatedAddress, { status: 200 });
    } catch (error) {
        console.error("Error updating address:", error);
        return NextResponse.json({ error: "Failed to update address" }, { status: 500 });
    }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const id = (await params).id;
    const supabase = createClient(cookies());
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    try {
        const { data: deletedAddress, error: deleteError } = await supabase
            .from("Addresses")
            .delete()
            .eq("adr_id", id)
            .select()
            .single();
        if (deleteError) {
            throw deleteError;
        }

        return NextResponse.json({ address: deletedAddress, message: "Address deleted successfully" }, { status: 200 });
    } catch (error) {
        console.error("Error deleting address:", error);
        return NextResponse.json({ error: "Failed to delete address" }, { status: 500 });
    }
}

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const id = (await params).id;   
    const { searchParams } = new URL(request.url);
    const setDefault = searchParams.get("setDefault") === "true";
    const supabase = createClient(cookies());
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!setDefault) {
        return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    try {
        await supabase
            .from("Addresses")
            .update({ default: false })
            .eq("user_id", user.id);

        const { data: address, error: updateError } = await supabase
            .from("Addresses")
            .update({ default: true })
            .eq("adr_id", id)
            .eq("user_id", user.id)
            .select()
            .single();

        if (updateError) {
            throw updateError;
        }

        const { data: addressList, error: fetchError } = await supabase
            .from("Addresses")
            .select("*")
            .eq("user_id", user.id)
            .order("default", { ascending: false });

        if (fetchError) {
            throw fetchError;
        }

        return NextResponse.json(addressList, { status: 200 });
    } catch (error) {
        console.error("Error fetching address:", error);
        return NextResponse.json({ error: "Failed to fetch address" }, { status: 500 });
    }
}