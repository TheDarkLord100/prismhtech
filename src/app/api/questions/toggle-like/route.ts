import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  try {
    const supabase = createClient(cookies());
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { question_id } = await req.json();
    if (!question_id) {
      return NextResponse.json({ error: "Question ID required" }, { status: 400 });
    }

    // check existing like
    const { data: existing } = await supabase
      .from("question_likes")
      .select("question_id")
      .eq("question_id", question_id)
      .eq("user_id", user.id)
      .single();

    if (existing) {
      // unlike
      await supabase
        .from("question_likes")
        .delete()
        .eq("question_id", question_id)
        .eq("user_id", user.id);
    } else {
      // like
      await supabase.from("question_likes").insert({
        question_id,
        user_id: user.id,
      });
    }

    const { count } = await supabase
      .from("question_likes")
      .select("*", { count: "exact", head: true })
      .eq("question_id", question_id);

    return NextResponse.json({
      liked: !existing,
      like_count: count || 0,
    });
  } catch (err) {
    console.error("Toggle like error:", err);
    return NextResponse.json(
      { error: "Failed to toggle like" },
      { status: 500 }
    );
  }
}
