import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";

export async function POST(req: Request) {
  try {
    const { question_id, images } = await req.json();

    if (!question_id || !Array.isArray(images)) {
      return NextResponse.json(
        { error: "Invalid payload" },
        { status: 400 }
      );
    }

    if (images.length > 3) {
      return NextResponse.json(
        { error: "Maximum 3 images allowed" },
        { status: 400 }
      );
    }

    const supabase = createClient(cookies());

    const inserts = images.map((url: string, index: number) => ({
      question_id,
      image_url: url,
      sort_order: index,
    }));

    const { error } = await supabase
      .from("question_images")
      .insert(inserts);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Link images error:", err);
    return NextResponse.json(
      { error: "Failed to link images" },
      { status: 500 }
    );
  }
}
