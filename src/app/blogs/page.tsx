"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import QuestionCard from "@/components/questions/QuestionCard";
import { useRouter } from "next/navigation";

type Question = {
  id: string;
  title: string;
  body: string;
  created_at: string;
  like_count: number;
  has_answer: boolean;
  answer?: string;
};

export default function QuestionsPage() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "answered">("all");
  const [sort, setSort] = useState<"new" | "old">("new");
  const [page, setPage] = useState(1);
  const router = useRouter();

  useEffect(() => {
    fetchQuestions();
  }, [search, filter, sort, page]);

  async function fetchQuestions() {
    const params = new URLSearchParams({
      search,
      filter,
      sort,
      page: page.toString(),
    });

    const res = await fetch(`/api/questions?${params.toString()}`, {
      cache: "no-store",
    });

    if (res.ok) {
      const data = await res.json();
      setQuestions(data.questions);
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
              placeholder="Search questions..."
              className="w-full md:w-2/3 px-4 py-2 rounded-lg bg-white/90 focus:outline-none"
            />

            <button className="px-6 py-2 bg-yellow-400 text-green-900 font-semibold rounded-lg hover:bg-yellow-300" onClick={() => router.push("/blogs/new")}>
              Add Question
            </button>
          </div>

          {/* FILTERS */}
          <div className="flex flex-wrap gap-4 items-center mb-8">
            <div className="flex gap-2">
              <button
                onClick={() => setFilter("all")}
                className={`px-4 py-1 rounded-full ${
                  filter === "all"
                    ? "bg-yellow-400 text-green-900"
                    : "bg-white/20 text-white"
                }`}
              >
                All Questions
              </button>

              <button
                onClick={() => setFilter("answered")}
                className={`px-4 py-1 rounded-full ${
                  filter === "answered"
                    ? "bg-yellow-400 text-green-900"
                    : "bg-white/20 text-white"
                }`}
              >
                Answered
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
            {questions.map((q) => (
              <QuestionCard key={q.id} question={q} />
            ))}
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
