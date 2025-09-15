import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { cookies } from "next/headers";
import { createClient } from "../../../utils/supabase/server"; 

// CREATE Product
export async function POST(req: Request) {
  try {
    const supabase = createClient(cookies());

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const newProduct = {
      id: uuidv4(),
      name: body.name,
      description: body.description || null,
      price: body.price,
      is_fixed_price: body.is_fixed_price ?? true,
      variants: body.variants ? JSON.stringify(body.variants) : null,
      images: body.images || null,
    };

    const { data, error } = await supabase.from("products").insert([newProduct]).select().single();
    if (error) throw error;

    return NextResponse.json(data, { status: 201 });
  } catch (error: unknown) {
    console.error("POST /products error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : JSON.stringify(error) },
      { status: 400 }
    );
  }
}

// GET All Products
export async function GET() {
  try {
    const supabase = createClient(cookies());

    const { data, error } = await supabase.from("products").select("*");
    if (error) throw error;

    return NextResponse.json(data, { status: 200 });
  } catch (error: unknown) {
    console.error("GET /products error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : JSON.stringify(error) },
      { status: 500 }
    );
  }
}
