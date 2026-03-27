import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const supabase = createClient(cookies());
        const { id } = await params;
        const questionId = id;
        const {
            data: { user },
        } = await supabase.auth.getUser();

        /* ---------------- QUESTION ---------------- */
        const { data: question, error: questionError } = await supabase
            .from("questions")
            .select(`
        id,
        title,
        body,
        created_at,
        user_name,
        status,
        is_public,
        question_images(image_url),
        question_likes(user_id)
      `)
            .eq("id", questionId)
            .single();
        if (questionError || !question) {
            return NextResponse.json(
                { error: "Question not found" },
                { status: 404 }
            );
        }

        // // 🔥 moderation check
        // if (question.status !== "approved" || !question.is_public) {
        //     return NextResponse.json(
        //         { error: "Question not available" },
        //         { status: 403 }
        //     );
        // }

        /* ---------------- ANSWERS ---------------- */
        const { searchParams } = new URL(req.url);
        const page = Number(searchParams.get("page") || 1);
        const limit = Number(searchParams.get("limit") || 10);
        const offset = (page - 1) * limit;

        const { data: answersData, error: answersError } =
            await supabase
                .from("answers")
                .select(`
          id,
          body,
          created_at,
          user_id,
          user_name,
          admin_id,
          upvotes_count,
          is_accepted,
          answer_votes(user_id, vote)
        `)
                .eq("question_id", questionId)
                .range(offset, offset + limit - 1);

        if (answersError) throw answersError;

        /* ---------------- SORTING (IMPORTANT) ---------------- */
        const answers = (answersData || [])
            .map((a: any) => {
                const votes = a.answer_votes || [];

                return {
                    id: a.id,
                    body: a.body,
                    created_at: a.created_at,
                    user_id: a.user_id,
                    user_name: a.user_name,
                    admin_id: a.admin_id,
                    upvotes_count: a.upvotes_count,
                    is_accepted: a.is_accepted,
                    is_upvoted: user
                        ? votes.some(
                            (v: any) =>
                                v.user_id === user.id && v.vote === 1
                        )
                        : false,
                };
            })
            .sort((a, b) => {
                // 🔥 priority sorting
                if (a.admin_id && !b.admin_id) return -1;
                if (!a.admin_id && b.admin_id) return 1;

                if (a.is_accepted && !b.is_accepted) return -1;
                if (!a.is_accepted && b.is_accepted) return 1;

                return b.upvotes_count - a.upvotes_count;
            });

        /* ---------------- NORMALIZE QUESTION ---------------- */
        const likes = question.question_likes || [];

        const normalizedQuestion = {
            id: question.id,
            title: question.title,
            body: question.body,
            created_at: question.created_at,
            user_name: question.user_name,

            like_count: likes.length,
            is_liked: user
                ? likes.some((l: any) => l.user_id === user.id)
                : false,

            images: (question.question_images || []).map(
                (img: any) => img.image_url
            ),
        };

        return NextResponse.json({
            question: normalizedQuestion,
            answers,
            page,
        });
    } catch (err) {
        console.error("Question thread API error:", err);
        return NextResponse.json(
            { error: "Failed to fetch question" },
            { status: 500 }
        );
    }
}