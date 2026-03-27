"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import QuestionCard from "@/components/questions/QuestionCard";
import { useRouter } from "next/navigation";
import { Question } from "@/types/question";

export default function QuestionsPage() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "answered">("all");
  const [sort, setSort] = useState<"new" | "old">("new");
  const [page, setPage] = useState(1);
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const delay = setTimeout(() => {
      fetchQuestions();
    }, 400);

    return () => clearTimeout(delay);
  }, [search, filter, sort, page]);

  async function fetchQuestions() {
    try {
      setLoading(true);

      const params = new URLSearchParams({
        search,
        filter,
        sort,
        page: page.toString(),
      });

      const res = await fetch(`/api/questions?${params.toString()}`, {
        cache: "no-store",
      });

      console.log("fetching questions with params:", { search, filter, sort, page });

      if (res.ok) {
        const data = await res.json();
        console.log("fetched questions:", data);
        setQuestions(data.questions);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-r from-[#16463B] via-[#317A45] to-[#4CAF50]">
      <Navbar />

      <main className="flex-1 pt-8">
        <div className="max-w-6xl mx-auto px-6 py-10 my-10">

          {/* TOP BAR */}
          <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center mb-6">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search discussions..."
              className="w-full md:w-2/3 px-4 py-2 rounded-lg bg-white/90 focus:outline-none"
            />

            <button className="px-6 py-2 bg-yellow-400 text-green-900 font-semibold rounded-lg hover:bg-yellow-300" 
            onClick={() => router.push("/forum/new")}>
              Start a Discussion
            </button>
          </div>

          {/* FILTERS */}
          <div className="flex flex-wrap gap-4 items-center mb-8">
            <div className="flex gap-2">
              <button
                onClick={() => setFilter("all")}
                className={`px-4 py-1 rounded-full ${filter === "all"
                  ? "bg-yellow-400 text-green-900"
                  : "bg-white/20 text-white"
                  }`}
              >
                All Discussions
              </button>

              <button
                onClick={() => setFilter("answered")}
                className={`px-4 py-1 rounded-full ${filter === "answered"
                  ? "bg-yellow-400 text-green-900"
                  : "bg-white/20 text-white"
                  }`}
              >
                With Replies
              </button>
            </div>

            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as any)}
              className="ml-auto bg-white/90 px-3 py-1 rounded-lg"
            >
              <option value="new">Newest first</option>
              <option value="old">Oldest first</option>
            </select>
          </div>

          {/* QUESTIONS */}
          <div className="space-y-4">
            {loading ? (
              <div className="text-white text-center py-10">
                Loading discussions...
              </div>
            ) : questions.length === 0 ? (
              <div className="text-center py-16 bg-white/10 rounded-xl">
                <p className="text-white text-lg font-semibold">
                  No discussions found
                </p>
                <p className="text-white/70 text-sm mt-2">
                  Start the first conversation
                </p>

                <button
                  onClick={() => router.push("/forum/new")}
                  className="mt-4 px-5 py-2 bg-yellow-400 text-green-900 font-semibold rounded-lg hover:bg-yellow-300"
                >
                  Start a Discussion
                </button>
              </div>
            ) : (
              questions.map((q) => (
                <QuestionCard key={q.id} question={q} />
              ))
            )}
          </div>

          {/* PAGINATION (placeholder) */}
          <div className="flex justify-center mt-10 gap-4">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="px-4 py-2 bg-white/20 text-white rounded-lg"
            >
              Previous
            </button>

            <button
              onClick={() => setPage((p) => p + 1)}
              className="px-4 py-2 bg-white/20 text-white rounded-lg"
            >
              Next
            </button>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
