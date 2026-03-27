"use client";

import { useState } from "react";
import { useUserStore } from "@/utils/store/userStore";
import { Notification, notify } from "@/utils/notify";
import { useRouter } from "next/navigation";
import { Question } from "@/types/question";

type QuestionCardProps = {
  question: Question;
};

export default function QuestionCard({ question }: QuestionCardProps) {
  const router = useRouter();
  const [expanded, setExpanded] = useState(false);
  const [likeCount, setLikeCount] = useState(question.like_count);
  const [liked, setLiked] = useState(question.is_liked);
  console.log("question:", question);
  const { user } = useUserStore();

  async function toggleLike(e: React.MouseEvent) {
    e.stopPropagation();
    if (!user) return alert("Please login to like questions");

    const res = await fetch("/api/questions/toggle-like", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question_id: question.id }),
    });

    if (!res.ok) return;
    notify(Notification.SUCCESS, "Like status updated");
    const data = await res.json();
    setLiked(data.liked);
    setLikeCount(data.like_count);
  }

  return (
    <div className="bg-white/90 rounded-xl p-5 shadow-md transition">

      {/* HEADER */}
      <div
        className="flex justify-between items-start cursor-pointer"
        onClick={() => router.push(`/forum/${question.id}`)}
      >
        <div>
          <h3 className="text-lg font-semibold text-green-900">
            {question.title}
          </h3>

          <p className="text-sm text-gray-600 mt-1">
            {new Date(question.created_at).toLocaleDateString()}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={toggleLike}
            className={`text-sm flex items-center gap-1 ${liked ? "text-green-700" : "text-gray-600"
              }`}
          >
            👍 {likeCount}
          </button>

          {question.answers_count > 0 && (
            <span className="px-2 py-0.5 text-xs rounded-full bg-green-600 text-white">
              {question.answers_count} Answer
              {question.answers_count > 1 ? "s" : ""}
            </span>
          )}
        </div>
      </div>

      {/* IMAGE PREVIEW */}
      {question.images && question.images.length > 0 && (
        <div className="flex gap-3 mt-3 overflow-x-auto">
          {question.images.map((url, i) => (
            <img
              key={i}
              src={url}
              alt="question"
              className="w-24 h-24 rounded-lg object-cover"
            />
          ))}
        </div>
      )}

      {/* BODY PREVIEW */}
      <p className="text-gray-700 mt-3 line-clamp-2">
        {question.body}
      </p>
    </div>
  );
}
