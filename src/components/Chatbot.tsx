"use client";

import { FormEvent, Fragment, ReactNode, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Send, X, User } from "lucide-react";

const CHATBOT_LOGO = "/Assets/chatbot_logo.png";

function ChatbotAvatar({
  size = 24,
  className = "",
}: {
  size?: number;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex shrink-0 overflow-hidden rounded-full ${className}`}
      style={{ width: size, height: size }}
    >
      <Image
        src={CHATBOT_LOGO}
        alt="Pervesh Assistant"
        width={size}
        height={size}
        unoptimized
        className="h-full w-full object-contain"
      />
    </span>
  );
}

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

const WELCOME: ChatMessage = {
  role: "assistant",
  content:
    "Hi! I'm the Pervesh Rasayan assistant. Ask me about our products, industries we serve, company history, or how to contact us.",
};

function renderInlineMarkdown(text: string): ReactNode[] {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**") && part.length > 4) {
      return (
        <strong key={i} className="font-semibold text-gray-900">
          {part.slice(2, -2)}
        </strong>
      );
    }
    return <Fragment key={i}>{part}</Fragment>;
  });
}

function MessageBody({ content, isUser }: { content: string; isUser: boolean }) {
  if (isUser) {
    return <>{content}</>;
  }

  const lines = content.replace(/\r\n/g, "\n").split("\n");
  const blocks: ReactNode[] = [];
  let listItems: string[] = [];
  let listType: "ul" | "ol" | null = null;

  const flushList = () => {
    if (!listType || listItems.length === 0) return;
    const Tag = listType;
    blocks.push(
      <Tag
        key={`list-${blocks.length}`}
        className={
          listType === "ul"
            ? "my-1.5 list-disc space-y-1 pl-4"
            : "my-1.5 list-decimal space-y-1 pl-4"
        }
      >
        {listItems.map((item, i) => (
          <li key={i}>{renderInlineMarkdown(item)}</li>
        ))}
      </Tag>
    );
    listItems = [];
    listType = null;
  };

  for (const line of lines) {
    const bullet = line.match(/^\s*[-*•]\s+(.+)$/);
    const numbered = line.match(/^\s*\d+[.)]\s+(.+)$/);

    if (bullet) {
      if (listType && listType !== "ul") flushList();
      listType = "ul";
      listItems.push(bullet[1]);
      continue;
    }

    if (numbered) {
      if (listType && listType !== "ol") flushList();
      listType = "ol";
      listItems.push(numbered[1]);
      continue;
    }

    flushList();

    if (!line.trim()) {
      blocks.push(<div key={`sp-${blocks.length}`} className="h-2" />);
      continue;
    }

    blocks.push(
      <p key={`p-${blocks.length}`} className="my-0.5">
        {renderInlineMarkdown(line)}
      </p>
    );
  }

  flushList();

  return <div className="space-y-0.5">{blocks}</div>;
}

export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([WELCOME]);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
      inputRef.current?.focus();
    }
  }, [open, messages, loading]);

  async function sendMessage(e?: FormEvent) {
    e?.preventDefault();
    const text = input.trim();
    if (!text || loading) return;

    const nextMessages = [...messages, { role: "user" as const, content: text }];
    setMessages(nextMessages);
    setInput("");
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          history: nextMessages.slice(0, -1).filter((m) => m !== WELCOME),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Something went wrong.");
      }

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.reply as string },
      ]);
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : "Failed to send message.";
      setError(msg);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "Sorry — I couldn't process that right now. Please try again, or call us at 0129-2414130.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed bottom-5 right-5 z-[100] flex flex-col items-end gap-3">
      {open && (
        <div className="flex h-[min(560px,75vh)] w-[min(380px,calc(100vw-2.5rem))] flex-col overflow-hidden rounded-2xl border border-white/20 bg-white shadow-2xl">
          <div className="flex items-center justify-between bg-gradient-to-r from-[#16463B] via-[#317A45] to-[#4CAF50] px-4 py-3 text-white">
            <div className="flex items-center gap-2">
              <ChatbotAvatar size={32} className="ring-2 ring-white/30" />
              <div>
                <p className="text-sm font-semibold leading-tight">
                  Pervesh Assistant
                </p>
                <p className="text-[11px] text-white/80">Ask about our chemicals</p>
              </div>
            </div>
            <button
              type="button"
              aria-label="Close chat"
              onClick={() => setOpen(false)}
              className="rounded-full p-1.5 transition hover:bg-white/15"
            >
              <X size={18} />
            </button>
          </div>

          <div className="flex-1 space-y-3 overflow-y-auto bg-[#f7faf8] px-3 py-3">
            {messages.map((m, i) => (
              <div
                key={`${m.role}-${i}`}
                className={`flex gap-2 ${m.role === "user" ? "justify-end" : "justify-start"}`}
              >
                {m.role === "assistant" && (
                  <ChatbotAvatar size={24} className="mt-0.5" />
                )}
                <div
                  className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm leading-relaxed ${
                    m.role === "user"
                      ? "rounded-br-md bg-[#16463B] text-white"
                      : "rounded-bl-md bg-white text-gray-800 shadow-sm"
                  }`}
                >
                  <MessageBody content={m.content} isUser={m.role === "user"} />
                </div>
                {m.role === "user" && (
                  <div className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gray-200 text-gray-600">
                    <User size={14} />
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <ChatbotAvatar size={24} />
                <span className="rounded-2xl bg-white px-3 py-2 shadow-sm">
                  Thinking…
                </span>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {error && (
            <p className="bg-red-50 px-3 py-1 text-xs text-red-600">{error}</p>
          )}

          <form
            onSubmit={sendMessage}
            className="flex items-center gap-2 border-t border-gray-100 bg-white p-3"
          >
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about products, location…"
              disabled={loading}
              className="flex-1 rounded-full border border-gray-200 bg-gray-50 px-4 py-2 text-sm text-gray-800 outline-none focus:border-[#317A45] disabled:opacity-60"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              aria-label="Send message"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-[#317A45] text-white transition hover:bg-[#16463B] disabled:opacity-50"
            >
              <Send size={16} />
            </button>
          </form>
        </div>
      )}

      <button
        type="button"
        aria-label={open ? "Close chat" : "Open chat"}
        onClick={() => setOpen((v) => !v)}
        className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-full shadow-lg transition hover:scale-105"
      >
        {open ? (
          <span className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#16463B] to-[#4CAF50] text-white">
            <X size={22} />
          </span>
        ) : (
          <ChatbotAvatar size={56} />
        )}
      </button>
    </div>
  );
}

