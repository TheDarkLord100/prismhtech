import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";

export async function POST(request: Request) {
    const supabase = createClient(cookies());

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const body = await request.json();
        const { product_id, variant_id, rating, review } = body;

        if (!product_id || !rating) {
            return NextResponse.json({ error: "Missing fields" }, { status: 400 });
        }

        if (rating < 1 || rating > 5) {
            return NextResponse.json({ error: "Invalid rating" }, { status: 400 });
        }

        // 1. Check if user has purchased this product
        const { data: orders } = await supabase
            .from("OrderItems")
            .select("ordr_id")
            .eq("product_id", product_id)
            .eq("variant_id", variant_id);

        const orderIds = orders?.map(o => o.ordr_id) || [];

        if (orderIds.length === 0) {
            return NextResponse.json(
                { error: "You can only review purchased products" },
                { status: 403 }
            );
        }

        // 2. Check if already reviewed
        const { data: existing } = await supabase
            .from("productReviews")
            .select("id")
            .eq("user_id", user.id)
            .eq("product_id", product_id)
            .eq("variant_id", variant_id)
            .maybeSingle();

        if (existing) {
            return NextResponse.json(
                { error: "You have already reviewed this product" },
                { status: 400 }
            );
        }

        // 3. Insert review
        const { data, error } = await supabase
            .from("productReviews")
            .insert({
                user_id: user.id,
                product_id,
                variant_id,
                rating,
                review,
                order_id: orderIds[0], // attach one order
            })
            .select()
            .single();

        if (error) throw error;

        return NextResponse.json(data, { status: 200 });

    } catch (error) {
        console.error("POST /product/review error:", error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : String(error) },
            { status: 500 }
        );
    }
}

export async function GET(request: Request) {
    const supabase = createClient(cookies());

    try {
        const { searchParams } = new URL(request.url);
        const product_id = searchParams.get("product_id");

        if (!product_id) {
            return NextResponse.json({ error: "product_id required" }, { status: 400 });
        }

        const { data: reviews, error } = await supabase
            .from("productReviews")
            .select(`
        id,
        rating,
        review,
        created_at,
        variant:ProductVariants(name),
        user:users(name)
      `)
            .eq("product_id", product_id)
            .order("created_at", { ascending: false });

        if (error) throw error;

        const avg =
            reviews.length > 0
                ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
                : 0;

        console.log(`Fetched ${reviews.length} reviews for product ${product_id}, avg rating: ${avg}`);
        return NextResponse.json({
            reviews,
            avg_rating: avg,
            total: reviews.length,
        });

    } catch (error) {
        console.error("GET /product/review error:", error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : String(error) },
            { status: 500 }
        );
    }
}