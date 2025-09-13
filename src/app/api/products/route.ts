import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { supabase } from "@/lib/supabaseClient";

/**
 * Helper to extract bearer token from headers
 */
function getAuthToken(req: Request) {
  const authHeader = req.headers.get("Authorization") || "";
  const match = authHeader.match(/^Bearer (.*)$/);
  return match ? match[1] : null;
}

/**
 * CREATE Product (POST)
 */
export async function POST(req: Request) {
  try {
    const token = getAuthToken(req);

    if (!token) {
      return NextResponse.json({ error: "Missing auth token" }, { status: 401 });
    }

    supabase.auth.setAuth(token);

    const body = await req.json();
    console.log("Received body:", body);

    const newProduct = {
      id: uuidv4(),
      name: body.name,
      description: body.description || null,
      price: body.price,
      is_fixed_price: body.is_fixed_price ?? true,
      variants: body.variants ? JSON.stringify(body.variants) : null,
      images: body.images || null,
    };

    const { data, error } = await supabase
      .from("products")
      .insert([newProduct])
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(data, { status: 201 });
  } catch (error: unknown) {
    console.error("POST /products error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : JSON.stringify(error) },
      { status: 400 }
    );
  }
};

/**
 * READ Products (GET)
 */
export async function GET() {
  try {
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
};

/**
 * UPDATE Product (PUT)
 */
export async function PUT(req: Request) {
  try {
    const token = getAuthToken(req);

    if (!token) {
      return NextResponse.json({ error: "Missing auth token" }, { status: 401 });
    }

    supabase.auth.setAuth(token);

    const body = await req.json();

    const updatedProduct = {
      ...body,
      variants: body.variants ? JSON.stringify(body.variants) : null,
    };

    const { data, error } = await supabase
      .from("products")
      .update(updatedProduct)
      .eq("id", body.id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(data, { status: 200 });
  } catch (error: unknown) {
    console.error("PUT /products error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : JSON.stringify(error) },
      { status: 400 }
    );
  }
};

/**
 * DELETE Product (DELETE)
 */
export async function DELETE(req: Request) {
  try {
    const token = getAuthToken(req);

    if (!token) {
      return NextResponse.json({ error: "Missing auth token" }, { status: 401 });
    }

    supabase.auth.setAuth(token);

    const { id } = await req.json();

    const { error } = await supabase.from("products").delete().eq("id", id);

    if (error) throw error;

    return NextResponse.json({ message: "Product deleted" }, { status: 200 });
  } catch (error: unknown) {
    console.error("DELETE /products error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : JSON.stringify(error) },
      { status: 400 }
    );
  }
};
