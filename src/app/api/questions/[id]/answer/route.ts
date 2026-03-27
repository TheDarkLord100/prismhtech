// /api/questions/[id]/answer/route.ts

import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { checkProfanity } from "@/utils/questionUtils/profanityCheck";

export async function POST(req: Request, { params }: any) {
  try {
    const supabase = createClient(cookies());
    const { id } = await params;
    const questionId = id;

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { body, user_name } = await req.json();

    if (!body) {
      return NextResponse.json(
        { error: "Answer body is required" },
        { status: 400 }
      );
    }

    /* ---------------- VALIDATE QUESTION ---------------- */
    const { data: question } = await supabase
      .from("questions")
      .select("id, status, is_public")
      .eq("id", questionId)
      .single();

    if (!question) {
      return NextResponse.json(
        { error: "Question not found" },
        { status: 404 }
      );
    }

    // if (question.status !== "approved" || !question.is_public) {
    //   return NextResponse.json(
    //     { error: "Cannot answer this question" },
    //     { status: 403 }
    //   );
    // }

    /* ---------------- MODERATION ---------------- */
    const containsBadWords = checkProfanity(body);

    const { error } = await supabase.from("answers").insert({
      question_id: questionId,
      user_id: user.id,
      user_name: user_name,
      body,
      status: containsBadWords ? "pending" : "approved",
    });

    if (error) throw error;

    return NextResponse.json({
      success: true,
      status: containsBadWords ? "pending" : "approved",
    });
  } catch (err) {
    console.error("Create answer error:", err);
    return NextResponse.json(
      { error: "Failed to create answer" },
      { status: 500 }
    );
  }
}