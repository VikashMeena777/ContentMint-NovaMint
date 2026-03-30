import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getPlanConfig } from "@/lib/plan-limits";

export async function GET(request: NextRequest) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Check plan allows export
  const { data: profile } = await supabase
    .from("profiles")
    .select("plan")
    .eq("id", user.id)
    .single();

  const plan = profile?.plan || "free";
  const config = getPlanConfig(plan);

  if (!config.canExport) {
    return NextResponse.json(
      { error: "Export is available on Pro and Business plans. Upgrade to unlock." },
      { status: 403 }
    );
  }

  const { searchParams } = new URL(request.url);
  const format = searchParams.get("format") || "csv";
  const scope = searchParams.get("scope") || "all";

  // Fetch generations
  let query = supabase
    .from("generations")
    .select("type, input, output, viral_score, is_favorite, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(1000);

  if (scope === "favorites") {
    query = query.eq("is_favorite", true);
  }

  const { data: generations, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (!generations || generations.length === 0) {
    return NextResponse.json({ error: "No content to export" }, { status: 404 });
  }

  // Flatten results — one row per result text
  interface ExportRow {
    type: string;
    topic: string;
    platform: string;
    tone: string;
    text: string;
    score: string;
    favorite: string;
    date: string;
  }

  const rows: ExportRow[] = [];
  for (const gen of generations) {
    const input = gen.input as Record<string, string> | null;
    const output = gen.output as { results?: { text: string; score?: number }[] } | null;
    const results = output?.results || [];

    for (const result of results) {
      rows.push({
        type: gen.type || "",
        topic: input?.topic || "",
        platform: input?.platform || "",
        tone: input?.tone || "",
        text: result.text || "",
        score: String(result.score || gen.viral_score || ""),
        favorite: gen.is_favorite ? "Yes" : "No",
        date: new Date(gen.created_at).toISOString().split("T")[0],
      });
    }
  }

  if (format === "txt") {
    // Plain text export
    const lines: string[] = [];
    lines.push(`ContentMint Export — ${scope === "favorites" ? "Favorites" : "All History"}`);
    lines.push(`Exported: ${new Date().toLocaleDateString()}`);
    lines.push(`Total items: ${rows.length}`);
    lines.push("═".repeat(60));
    lines.push("");

    let currentType = "";
    for (const row of rows) {
      if (row.type !== currentType) {
        currentType = row.type;
        lines.push(`── ${currentType.toUpperCase()} ──`);
        lines.push("");
      }
      lines.push(`[${row.date}] ${row.topic}`);
      if (row.platform || row.tone) {
        lines.push(`  Platform: ${row.platform || "—"}  |  Tone: ${row.tone || "—"}`);
      }
      lines.push(`  ${row.text}`);
      if (row.score) lines.push(`  Score: ${row.score}`);
      lines.push("");
    }

    const body = lines.join("\n");
    return new Response(body, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Content-Disposition": `attachment; filename="contentmint-${scope}-${Date.now()}.txt"`,
      },
    });
  }

  // CSV export (default)
  const headers = ["Type", "Topic", "Platform", "Tone", "Text", "Score", "Favorite", "Date"];

  const escapeCSV = (val: string) => {
    if (val.includes(",") || val.includes('"') || val.includes("\n")) {
      return `"${val.replace(/"/g, '""')}"`;
    }
    return val;
  };

  const csvLines = [
    headers.join(","),
    ...rows.map((row) =>
      [row.type, row.topic, row.platform, row.tone, row.text, row.score, row.favorite, row.date]
        .map(escapeCSV)
        .join(",")
    ),
  ];

  const csvBody = csvLines.join("\n");
  return new Response(csvBody, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="contentmint-${scope}-${Date.now()}.csv"`,
    },
  });
}
