import { NextRequest, NextResponse } from "next/server";
import { getCashfreeOrderStatus } from "@/lib/cashfree/client";
import { createClient } from "@/lib/supabase/server";

export async function GET(req: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const orderId = req.nextUrl.searchParams.get("order_id");
    if (!orderId) {
      return NextResponse.json(
        { error: "Missing order_id" },
        { status: 400 }
      );
    }

    // Verify the order belongs to this user
    const { data: order } = await supabase
      .from("orders")
      .select("*")
      .eq("cashfree_order_id", orderId)
      .eq("user_id", user.id)
      .single();

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // If already paid in our DB, return immediately
    if (order.status === "paid") {
      return NextResponse.json({ status: "paid", plan: order.plan });
    }

    // Otherwise, check directly with Cashfree
    try {
      const cfOrder = await getCashfreeOrderStatus(orderId);

      if (cfOrder.order_status === "PAID") {
        // Update our records (webhook might not have fired yet)
        await supabase
          .from("orders")
          .update({ status: "paid" })
          .eq("cashfree_order_id", orderId);

        await supabase
          .from("profiles")
          .update({
            plan: order.plan,
            updated_at: new Date().toISOString(),
          })
          .eq("id", user.id);

        return NextResponse.json({ status: "paid", plan: order.plan });
      }

      return NextResponse.json({
        status: cfOrder.order_status.toLowerCase(),
        plan: order.plan,
      });
    } catch {
      // If Cashfree check fails, return our DB status
      return NextResponse.json({ status: order.status, plan: order.plan });
    }
  } catch (err) {
    console.error("Verify error:", err);
    return NextResponse.json(
      { error: "Verification failed" },
      { status: 500 }
    );
  }
}
