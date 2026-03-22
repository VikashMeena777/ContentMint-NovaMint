import { NextRequest, NextResponse } from "next/server";
import { getGroqClient, GROQ_MODEL } from "@/lib/groq/client";
import { buildPrompt } from "@/lib/prompts";
import type { ContentType } from "@/types";

/**
 * Public demo endpoint — generates real content for the homepage "Try it now" section.
 * No auth required, but limited to 3 items per type and all 5 types in one call.
 * IP-based rate limiting via a simple in-memory store (resets on server restart).
 */

const VALID_TYPES: ContentType[] = ["hook", "caption", "cta", "title", "idea"];

// Simple in-memory IP rate limiter (1 call per IP)
const usedIPs = new Set<string>();

export async function POST(request: NextRequest) {
  try {
    // Rate limit by IP — one demo per IP
    const forwarded = request.headers.get("x-forwarded-for");
    const ip = forwarded?.split(",")[0]?.trim() || "unknown";

    if (usedIPs.has(ip)) {
      return NextResponse.json(
        { error: "Demo limit reached. Sign up for unlimited generations!" },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { topic } = body;

    if (!topic || typeof topic !== "string" || topic.trim().length === 0) {
      return NextResponse.json(
        { error: "Topic is required" },
        { status: 400 }
      );
    }

    if (topic.length > 200) {
      return NextResponse.json(
        { error: "Topic must be under 200 characters" },
        { status: 400 }
      );
    }

    const groq = getGroqClient();
    const trimmedTopic = topic.trim();

    // Generate all 5 types in parallel for speed
    const generateType = async (type: ContentType): Promise<{ type: ContentType; results: string[] }> => {
      const { system, user: userPrompt } = buildPrompt(type, {
        topic: trimmedTopic,
      });

      const chatCompletion = await groq.chat.completions.create({
        messages: [
          { role: "system", content: system },
          { role: "user", content: userPrompt },
        ],
        model: GROQ_MODEL,
        temperature: 0.8,
        max_tokens: 1024,
        response_format: { type: "json_object" },
      });

      const responseText = chatCompletion.choices[0]?.message?.content || "[]";

      // Parse the JSON response
      let items: string[] = [];
      try {
        const parsed = JSON.parse(responseText);

        if (Array.isArray(parsed)) {
          items = parsed.map((item: any) =>
            typeof item === "string" ? item : item.text || item.content || String(item)
          );
        } else if (parsed.results && Array.isArray(parsed.results)) {
          items = parsed.results.map((item: any) =>
            typeof item === "string" ? item : item.text || item.content || String(item)
          );
        } else {
          const key = Object.keys(parsed).find((k) => Array.isArray(parsed[k]));
          if (key) {
            items = parsed[key].map((item: any) =>
              typeof item === "string" ? item : item.text || item.content || String(item)
            );
          }
        }
      } catch {
        items = responseText
          .split("\n")
          .filter((line: string) => line.trim())
          .map((line: string) => line.replace(/^\d+[.)]\s*/, "").trim())
          .filter((line: string) => line.length > 0);
      }

      // Limit to 3 items for demo
      return { type, results: items.filter(Boolean).slice(0, 3) };
    };

    const allResults = await Promise.all(VALID_TYPES.map(generateType));

    // Map singular→plural keys for the homepage
    const TYPE_MAP: Record<ContentType, string> = {
      hook: "hooks",
      caption: "captions",
      cta: "ctas",
      title: "titles",
      idea: "ideas",
    };

    const output: Record<string, string[]> = {};
    for (const { type, results } of allResults) {
      output[TYPE_MAP[type]] = results;
    }

    // Mark this IP as used
    usedIPs.add(ip);

    return NextResponse.json({ results: output });
  } catch (error: any) {
    console.error("Demo generation error:", error);

    if (error.message?.includes("GROQ_API_KEY")) {
      return NextResponse.json(
        { error: "API key not configured" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: "Failed to generate. Please try again." },
      { status: 500 }
    );
  }
}
