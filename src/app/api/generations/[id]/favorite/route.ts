import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getPlanConfig } from "@/lib/plan-limits";

export async function PATCH(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createClient();
  const { id } = await params;

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Get current favorite status
  const { data: generation } = await supabase
    .from("generations")
    .select("is_favorite")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (!generation) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  // If toggling ON → check favorites limit
  if (!generation.is_favorite) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("plan")
      .eq("id", user.id)
      .single();

    const plan = profile?.plan || "free";
    const config = getPlanConfig(plan);

    const { count } = await supabase
      .from("generations")
      .select("id", { count: "exact", head: true })
      .eq("user_id", user.id)
      .eq("is_favorite", true);

    const currentCount = count || 0;

    if (currentCount >= config.maxFavorites) {
      return NextResponse.json(
        {
          error: `Favorites limit reached (${currentCount}/${config.maxFavorites}). Upgrade your plan for more.`,
          count: currentCount,
          max: config.maxFavorites,
        },
        { status: 403 }
      );
    }
  }

  // Toggle
  const { error } = await supabase
    .from("generations")
    .update({ is_favorite: !generation.is_favorite })
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Get updated count
  const { count: newCount } = await supabase
    .from("generations")
    .select("id", { count: "exact", head: true })
    .eq("user_id", user.id)
    .eq("is_favorite", true);

  return NextResponse.json({
    is_favorite: !generation.is_favorite,
    favorites_count: newCount || 0,
  });
}

