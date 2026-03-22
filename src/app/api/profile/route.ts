import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, plan, credits")
    .eq("id", user.id)
    .single();

  return NextResponse.json({
    plan: profile?.plan || "free",
    full_name: profile?.full_name || "",
    credits: profile?.credits || 0,
  });
}
