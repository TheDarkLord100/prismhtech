"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useUserStore } from "@/utils/store/userStore";
import { Notification, notify } from "@/utils/notify";
import { Question, Answer } from "@/types/question";


export default function ForumDiscussionPage() {
    const { id } = useParams();
    const { user } = useUserStore();

    const [question, setQuestion] = useState<Question | null>(null);
    const [answers, setAnswers] = useState<Answer[]>([]);
    const [reply, setReply] = useState("");
    const [loading, setLoading] = useState(true);

    /* ---------------- FETCH ---------------- */
    useEffect(() => {
        fetchQuestion();
    }, [id]);

    async function fetchQuestion() {
        try {
            setLoading(true);

            const res = await fetch(`/api/questions/${id}`, {
                cache: "no-store",
            });

            if (res.ok) {
                const data = await res.json();
                setQuestion(data.question);
                setAnswers(data.answers);
            }
        } finally {
            setLoading(false);
        }
    }

    /* ---------------- POST REPLY ---------------- */
    async function postReply() {
        if (!user) {
            notify(Notification.FAILURE, "Please login to reply");
            return;
        }

        if (!reply.trim()) return;

        const res = await fetch(`/api/questions/${id}/answer`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ body: reply, user_name: user.name }),
        });

        if (!res.ok) {
            notify(Notification.FAILURE, "Failed to post reply");
            return;
        }

        notify(Notification.SUCCESS, "Reply posted");
        setReply("");
        fetchQuestion();
    }

    /* ---------------- VOTE ---------------- */
    async function vote(answerId: string, vote: 1 | -1 | 0) {
        if (!user) {
            notify(Notification.FAILURE, "Login to vote");
            return;
        }

        // 🔥 OPTIMISTIC UPDATE
        setAnswers((prev) =>
            prev.map((a) => {
                if (a.id !== answerId) return a;

                let newCount = a.upvotes_count;
                let currentVote = a.user_vote || 0;

                // remove previous vote
                if (currentVote === 1) newCount -= 1;
                if (currentVote === -1) newCount += 1;

                // apply new vote
                let newVote = vote;

                if (currentVote === vote) {
                    // toggle off
                    newVote = 0;
                } else {
                    if (vote === 1) newCount += 1;
                    if (vote === -1) newCount -= 1;
                }

                return {
                    ...a,
                    upvotes_count: newCount,
                    user_vote: newVote,
                };
            })
        );

        const res = await fetch(
            `/api/questions/${id}/answer/${answerId}`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ vote }),
            }
        );

        if (!res.ok) {
            // 🔥 rollback if failed
            fetchQuestion();
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center text-white">
                Loading discussion...
            </div>
        );
    }

    if (!question) {
        return (
            <div className="min-h-screen flex items-center justify-center text-white">
                Discussion not found
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-r from-[#16463B] via-[#317A45] to-[#4CAF50]">
            <Navbar />

            <main className="flex-1 pt-8">
                <div className="max-w-4xl mx-auto px-6 py-10">

                    {/* ---------------- DISCUSSION ---------------- */}
                    <div className="bg-white/90 rounded-xl p-6 shadow-md">
                        <h1 className="text-2xl font-bold text-green-900">
                            {question.title}
                        </h1>

                        <p className="text-sm text-gray-600 mt-2">
                            {new Date(question.created_at).toLocaleDateString()}
                        </p>

                        {/* Images */}
                        {question.images && question.images.length > 0 && (
                            <div className="flex gap-3 mt-4 overflow-x-auto">
                                {question.images.map((img, i) => (
                                    <img
                                        key={i}
                                        src={img}
                                        className="w-32 h-32 object-cover rounded-lg"
                                    />
                                ))}
                            </div>
                        )}

                        <p className="text-gray-800 mt-4 whitespace-pre-line">
                            {question.body}
                        </p>
                    </div>

                    {/* ---------------- REPLIES ---------------- */}
                    <div className="mt-8 space-y-4">
                        <h2 className="text-white text-xl font-semibold">
                            Replies ({answers.length})
                        </h2>

                        {answers.length === 0 ? (
                            <div className="bg-white/10 text-white text-center py-10 rounded-xl">
                                No replies yet. Be the first to respond 👀
                            </div>
                        ) : (
                            answers.map((a) => (
                                <div
                                    key={a.id}
                                    className="bg-white/90 rounded-xl p-5 shadow-md"
                                >
                                    {/* header */}
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-sm text-gray-600">
                                            {new Date(a.created_at).toLocaleDateString()}
                                        </span>

                                        {a.admin_id ? (
                                            <span className="text-yellow-600 font-semibold">
                                                Admin
                                            </span>
                                        ) : (
                                            <span>{a.user_name}</span>
                                        )}

                                    </div>

                                    {/* body */}
                                    <p className="text-gray-800 mb-3 whitespace-pre-line">
                                        {a.body}
                                    </p>

                                    {/* votes */}
                                    <div className="flex items-center gap-3">
                                        <button
                                            onClick={() => vote(a.id, 1)}
                                            className={`text-sm ${a.user_vote === 1 ? "text-green-700 font-bold" : ""
                                                }`}
                                        >
                                            👍
                                        </button>

                                        <span className={`text-sm ${a.user_vote === 1 ? "text-green-700 font-bold" : a.user_vote === -1 ? "text-red-600 font-bold" : "text-gray-600"}`}>
                                            {a.upvotes_count}
                                        </span>

                                        <button
                                            onClick={() => vote(a.id, -1)}
                                            className={`text-sm ${a.user_vote === -1 ? "text-red-600 font-bold" : ""
                                                }`}
                                        >
                                            👎
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {/* ---------------- ADD REPLY ---------------- */}
                    <div className="mt-8 bg-white/90 rounded-xl p-5 shadow-md">
                        <h3 className="text-lg font-semibold text-green-900 mb-3">
                            Add a reply
                        </h3>

                        <textarea
                            value={reply}
                            onChange={(e) => setReply(e.target.value)}
                            placeholder="Write your reply..."
                            className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none"
                            rows={4}
                        />

                        <button
                            onClick={postReply}
                            className="mt-3 px-5 py-2 bg-yellow-400 text-green-900 font-semibold rounded-lg hover:bg-yellow-300"
                        >
                            Post Reply
                        </button>
                    </div>

                </div>
            </main>

            <Footer />
        </div>
    );
}