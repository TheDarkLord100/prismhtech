import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import { chatRateLimit } from "@/utils/rateLimit";
import { PERVESH_KNOWLEDGE_BASE } from "@/data/knowledgeBase";

export const runtime = "nodejs";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

function buildSystemInstruction(knowledgeBase: string): string {
  return `You are the official customer support assistant for Pervesh Rasayan Pvt. Ltd., an industrial chemical supplier based in Faridabad, Haryana, India.

You are embedded on the company website (https://www.perveshrasayan.com/). Users are ALREADY on the site when chatting with you.

Use ONLY the knowledge base below to answer questions. Be concise, professional, and helpful.

Rules:
- Answer based on the knowledge base. If something is not covered (pricing, MOQ, certifications, exact stock), say you do not have that detail and suggest contacting the company via phone or email only.
- Do NOT tell users to visit the official website, browse the website, or include https://www.perveshrasayan.com/ in replies — they are already on the site. Only share the URL if the user explicitly asks for the website link.
- Do not invent product specs, prices, certifications, or claims.
- For contact requests, share phone numbers and email from the knowledge base. Do not add a website CTA.
- Keep answers short unless the user asks for detail.
- Formatting: use short paragraphs, bullet lists (- item) or numbered lists when listing items, and **bold** only for short labels/headings. Put each list item on its own line. Do not use headings with #.
- If asked about unrelated topics, politely redirect to Pervesh Rasayan products and services.

--- KNOWLEDGE BASE ---
${knowledgeBase}
--- END KNOWLEDGE BASE ---`;
}

async function allowChatRequest(ip: string): Promise<boolean> {
  try {
    const { success } = await chatRateLimit.limit(ip);
    return success;
  } catch (error) {
    // Don't break chat if Redis is down — fail open.
    console.error("Chat rate limit error:", error);
    return true;
  }
}

export async function POST(req: Request) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.error("GEMINI_API_KEY is missing");
      return NextResponse.json(
        { error: "Chat service is not configured." },
        { status: 500 }
      );
    }

    const ip = req.headers.get("x-forwarded-for") || "anonymous";
    const allowed = await allowChatRequest(ip);
    if (!allowed) {
      return NextResponse.json(
        { error: "Too many messages. Please try again later." },
        { status: 429 }
      );
    }

    const body = await req.json();
    const message =
      typeof body.message === "string" ? body.message.trim() : "";
    const history: ChatMessage[] = Array.isArray(body.history)
      ? body.history
      : [];

    if (!message) {
      return NextResponse.json(
        { error: "Message is required." },
        { status: 400 }
      );
    }

    if (message.length > 2000) {
      return NextResponse.json(
        { error: "Message is too long." },
        { status: 400 }
      );
    }

    const ai = new GoogleGenAI({ apiKey });

    const contents = [
      ...history
        .filter(
          (m) =>
            m &&
            (m.role === "user" || m.role === "assistant") &&
            typeof m.content === "string" &&
            m.content.trim()
        )
        .slice(-12)
        .map((m) => ({
          role: m.role === "assistant" ? "model" : "user",
          parts: [{ text: m.content.trim() }],
        })),
      {
        role: "user" as const,
        parts: [{ text: message }],
      },
    ];

    const response = await ai.models.generateContent({
      model: process.env.GEMINI_MODEL || "gemini-3.5-flash-lite",
      contents,
      config: {
        systemInstruction: buildSystemInstruction(PERVESH_KNOWLEDGE_BASE),
        temperature: 0.4,
        maxOutputTokens: 1024,
      },
    });

    const reply = response.text?.trim();
    if (!reply) {
      return NextResponse.json(
        { error: "No response from the assistant. Please try again." },
        { status: 502 }
      );
    }

    return NextResponse.json({ reply });
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      { error: "Failed to get a response. Please try again." },
      { status: 500 }
    );
  }
}
