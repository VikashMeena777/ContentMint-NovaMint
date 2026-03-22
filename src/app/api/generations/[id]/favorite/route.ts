import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

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

  // Toggle
  const { error } = await supabase
    .from("generations")
    .update({ is_favorite: !generation.is_favorite })
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    is_favorite: !generation.is_favorite,
  });
}
