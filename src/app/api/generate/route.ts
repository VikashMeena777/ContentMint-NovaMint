import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getGroqClient, GROQ_MODEL } from "@/lib/groq/client";
import { buildPrompt } from "@/lib/prompts";
import { PLAN_LIMITS } from "@/lib/plan-limits";
import type { ContentType, Platform, Tone } from "@/types";

const VALID_TYPES: ContentType[] = ["hook", "caption", "cta", "title", "idea"];

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Check auth
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check usage limits
    const { data: profile } = await supabase
      .from("profiles")
      .select("plan, credits")
      .eq("id", user.id)
      .single();

    const plan = profile?.plan || "free";
    const dailyLimit = PLAN_LIMITS[plan] || 10;

    const today = new Date().toISOString().split("T")[0];
    const { data: usageRow } = await supabase
      .from("usage")
      .select("count")
      .eq("user_id", user.id)
      .eq("date", today)
      .single();

    const currentUsage = usageRow?.count || 0;
    if (currentUsage >= dailyLimit) {
      return NextResponse.json(
        {
          error: `Daily limit reached (${dailyLimit}/${plan} plan). Upgrade for more.`,
        },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { type, topic, platform, tone, niche, goal, audience, format } = body;

    // Validate required fields
    if (!type || !VALID_TYPES.includes(type)) {
      return NextResponse.json(
        { error: "Invalid content type" },
        { status: 400 }
      );
    }

    if (!topic || typeof topic !== "string" || topic.trim().length === 0) {
      return NextResponse.json(
        { error: "Topic is required" },
        { status: 400 }
      );
    }

    if (topic.length > 500) {
      return NextResponse.json(
        { error: "Topic must be under 500 characters" },
        { status: 400 }
      );
    }

    // Build prompt
    const { system, user: userPrompt } = buildPrompt(type as ContentType, {
      topic: topic.trim(),
      platform: platform as Platform | undefined,
      tone: tone as Tone | undefined,
      niche,
      goal,
      audience,
      format,
    });

    // Call Groq API
    const groq = getGroqClient();
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        { role: "system", content: system },
        { role: "user", content: userPrompt },
      ],
      model: GROQ_MODEL,
      temperature: 0.8,
      max_tokens: 2048,
      response_format: { type: "json_object" },
    });

    const responseText =
      chatCompletion.choices[0]?.message?.content || "[]";

    // Parse the JSON response
    let results: { text: string; score?: number }[] = [];

    try {
      const parsed = JSON.parse(responseText);

      if (Array.isArray(parsed)) {
        results = parsed.map((item: any) => ({
          text: typeof item === "string" ? item : item.text || item.content || String(item),
          score: item.score,
        }));
      } else if (parsed.results && Array.isArray(parsed.results)) {
        results = parsed.results.map((item: any) => ({
          text: typeof item === "string" ? item : item.text || item.content || String(item),
          score: item.score,
        }));
      } else if (parsed.hooks || parsed.captions || parsed.ctas || parsed.titles || parsed.ideas) {
        const key = Object.keys(parsed).find((k) =>
          Array.isArray(parsed[k])
        );
        if (key) {
          results = parsed[key].map((item: any) => ({
            text: typeof item === "string" ? item : item.text || item.content || String(item),
            score: item.score,
          }));
        }
      } else {
        results = [{ text: responseText }];
      }
    } catch {
      const lines = responseText
        .split("\n")
        .filter((line: string) => line.trim())
        .map((line: string) => line.replace(/^\d+[.)]\s*/, "").trim())
        .filter((line: string) => line.length > 0);

      results = lines.map((text: string) => ({ text }));
    }

    results = results.filter((r) => r.text && r.text.trim().length > 0);

    // Calculate average viral score
    const avgScore = results.length > 0
      ? Math.round(results.reduce((sum, r) => sum + (r.score || 0), 0) / results.length)
      : null;

    // Save generation to DB
    const inputData = { topic: topic.trim(), platform, tone, niche, goal, audience, format };
    const { data: generation } = await supabase
      .from("generations")
      .insert({
        user_id: user.id,
        type,
        input: inputData,
        output: { results },
        viral_score: avgScore,
      })
      .select("id")
      .single();

    // Update daily usage count

    // Manual upsert for usage
    if (usageRow) {
      await supabase
        .from("usage")
        .update({ count: currentUsage + 1 })
        .eq("user_id", user.id)
        .eq("date", today);
    } else {
      await supabase.from("usage").insert({
        user_id: user.id,
        date: today,
        count: 1,
      });
    }

    // Add generation ID to each result
    const resultsWithId = results.map((r) => ({
      ...r,
      id: generation?.id,
    }));

    return NextResponse.json({
      results: resultsWithId,
      model: GROQ_MODEL,
      generation_id: generation?.id,
      usage: {
        used: currentUsage + 1,
        limit: dailyLimit,
        plan,
      },
    });
  } catch (error: any) {
    console.error("Generation error:", error);

    if (error.message?.includes("GROQ_API_KEY")) {
      return NextResponse.json(
        { error: "API key not configured. Please add GROQ_API_KEY to .env.local" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: "Failed to generate content. Please try again." },
      { status: 500 }
    );
  }
}
