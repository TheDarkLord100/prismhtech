import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const path = formData.get("path") as string | null;

    if (!file || !path) {
      return NextResponse.json(
        { error: "File and path are required" },
        { status: 400 }
      );
    }

    const supabase = createClient(cookies());

    const { error } = await supabase.storage
      .from("question-images")
      .upload(path, file, {
        upsert: false,
        contentType: file.type,
      });

    if (error) throw error;

    const { data } = supabase.storage
      .from("question-images")
      .getPublicUrl(path);

    return NextResponse.json({
      publicUrl: data.publicUrl,
    });
  } catch (err) {
    console.log("Image upload error:", err);
    return NextResponse.json(
      { error: "Failed to upload image" },
      { status: 500 }
    );
  }
}
