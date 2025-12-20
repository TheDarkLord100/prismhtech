import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const search = searchParams.get("search") || "";
    const filter = searchParams.get("filter") || "all";
    const sort = searchParams.get("sort") || "new";
    const page = Number(searchParams.get("page") || 1);
    const limit = Number(searchParams.get("limit") || 10);

    const offset = (page - 1) * limit;

    const supabase = createClient(cookies());

    /* -------------------------------------------------- */
    /* Current user (likes)                               */
    /* -------------------------------------------------- */
    const {
      data: { user },
    } = await supabase.auth.getUser();

    /* -------------------------------------------------- */
    /* Fetch questions ONLY                               */
    /* -------------------------------------------------- */
    let questionQuery = supabase
      .from("questions")
      .select(
        `
        id,
        title,
        body,
        created_at,
        question_likes(user_id),
        question_images(image_url)
        `,
        { count: "exact" }
      )
      .eq("is_public", true);

    if (search) {
      questionQuery = questionQuery.or(
        `title.ilike.%${search}%,body.ilike.%${search}%`
      );
    }

    questionQuery =
      sort === "old"
        ? questionQuery.order("created_at", { ascending: true })
        : questionQuery.order("created_at", { ascending: false });

    questionQuery = questionQuery.range(offset, offset + limit - 1);

    const { data: questionsData, error, count } =
      await questionQuery;

    if (error) throw error;

    const questionIds = questionsData.map(q => q.id);

    /* -------------------------------------------------- */
    /* Fetch answers separately                           */
    /* -------------------------------------------------- */
    const { data: answersData, error: answersError } =
      await supabase
        .from("answers")
        .select("question_id, body, created_at")
        .in("question_id", questionIds);

    if (answersError) throw answersError;

    const answersMap = new Map(
      (answersData || []).map(a => [a.question_id, a])
    );

    /* -------------------------------------------------- */
    /* Normalize response                                 */
    /* -------------------------------------------------- */
    const questions = questionsData.map((q: any) => {
      const likes = q.question_likes || [];
      const answer = answersMap.get(q.id);

      return {
        id: q.id,
        title: q.title,
        body: q.body,
        created_at: q.created_at,

        has_answer: !!answer,
        answer: answer?.body || null,
        answer_created_at: answer?.created_at || null,

        like_count: likes.length,
        is_liked: user
          ? likes.some((l: any) => l.user_id === user.id)
          : false,

        images: (q.question_images || []).map(
          (img: any) => img.image_url
        ),
      };
    });

    /* -------------------------------------------------- */
    /* Optional: filter answered on server                */
    /* -------------------------------------------------- */
    const finalQuestions =
      filter === "answered"
        ? questions.filter(q => q.has_answer)
        : questions;

    return NextResponse.json({
      questions: finalQuestions,
      page,
      totalPages: Math.ceil((count || 0) / limit),
    });
  } catch (err) {
    console.error("Questions API error:", err);
    return NextResponse.json(
      { error: "Failed to fetch questions" },
      { status: 500 }
    );
  }
}




export async function POST(req: Request) {
  try {
    const { title, body, tags = [], product_id } = await req.json();

    if (!title || !body) {
      return NextResponse.json(
        { error: "Title and description are required" },
        { status: 400 }
      );
    }

    const supabase = createClient(cookies());

    const { data: user, error: userError } = await supabase.auth.getUser();

    const { data: userData, error: userDataError } = await supabase
      .from("users")
      .select("*")
      .eq("id", user?.user?.id || "")
      .single();
    /* 1️⃣ Create question */
    const { data: question, error } = await supabase
      .from("questions")
      .insert({
        user_id: user?.user?.id || null,
        user_name: userData?.name || "Guest",
        user_email: userData?.email || "",
        title,
        body,
        product_id: product_id || null,
        status: "pending",
        is_public: true,
      })
      .select("id")
      .single();

    if (error || !question) throw error;

    const questionId = question.id;

    /* 2️⃣ Handle tags */
    if (Array.isArray(tags) && tags.length > 0) {
      for (const tag of tags) {
        // create tag if not exists
        const { data: tagRow } = await supabase
          .from("tags")
          .select("id")
          .eq("name", tag)
          .single();

        let tagId = tagRow?.id;

        if (!tagId) {
          const { data: newTag, error: tagError } = await supabase
            .from("tags")
            .insert({ name: tag })
            .select("id")
            .single();

          if (tagError) throw tagError;
          tagId = newTag.id;
        }

        // map tag to question
        await supabase.from("question_tag_map").insert({
          question_id: questionId,
          tag_id: tagId,
        });
      }
    }

    return NextResponse.json({ question_id: questionId });
  } catch (err) {
    console.error("Create question error:", err);
    return NextResponse.json(
      { error: "Failed to create question" },
      { status: 500 }
    );
  }
}
