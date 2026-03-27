// /api/questions/[qid]/answer/[aid]/route.ts

import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(req: Request, { params }: any) {
  try {
    const supabase = createClient(cookies());
    const { aid } = await params;
    const answerId = aid;

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { vote } = await req.json(); // +1 or -1

    if (![1, -1].includes(vote)) {
      return NextResponse.json(
        { error: "Invalid vote value" },
        { status: 400 }
      );
    }

    /* ---------------- CHECK EXISTING ---------------- */
    const { data: existing } = await supabase
      .from("answer_votes")
      .select("vote")
      .eq("answer_id", answerId)
      .eq("user_id", user.id)
      .maybeSingle(); // 🔥 safer than single()

    let finalVote = vote;

    if (existing) {
      if (existing.vote === vote) {
        // 🔥 TOGGLE OFF
        await supabase
          .from("answer_votes")
          .delete()
          .eq("answer_id", answerId)
          .eq("user_id", user.id);

        finalVote = 0;
      } else {
        // 🔥 SWITCH VOTE
        await supabase
          .from("answer_votes")
          .update({ vote })
          .eq("answer_id", answerId)
          .eq("user_id", user.id);
      }
    } else {
      // 🔥 NEW VOTE
      await supabase.from("answer_votes").insert({
        answer_id: answerId,
        user_id: user.id,
        vote,
      });
    }

    /* ---------------- RECOMPUTE SCORE ---------------- */
    const { data: votes } = await supabase
      .from("answer_votes")
      .select("vote")
      .eq("answer_id", answerId);

    const score =
      votes?.reduce((acc, v) => acc + v.vote, 0) || 0;

    await supabase
      .from("answers")
      .update({ upvotes_count: score })
      .eq("id", answerId);

    console.log("User vote", finalVote);
    return NextResponse.json({
      success: true,
      score,
      user_vote: finalVote, // 🔥 important for UI sync
    });
  } catch (err) {
    console.error("Vote error:", err);
    return NextResponse.json(
      { error: "Failed to vote" },
      { status: 500 }
    );
  }
}