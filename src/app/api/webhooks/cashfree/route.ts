import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { verifyCashfreeWebhook } from "@/lib/cashfree/client";

// Use service-role client for webhook (no user auth context)
function getAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  return createClient(url, serviceKey);
}

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get("x-webhook-signature") || "";

    // Verify webhook signature
    if (!verifyCashfreeWebhook(rawBody, signature)) {
      return NextResponse.json(
        { error: "Invalid signature" },
        { status: 401 }
      );
    }

    const payload = JSON.parse(rawBody);
    const eventType = payload.type;
    const orderData = payload.data?.order;

    if (!orderData) {
      return NextResponse.json({ ok: true });
    }

    const orderId = orderData.order_id;
    const supabase = getAdminClient();

    if (
      eventType === "PAYMENT_SUCCESS_WEBHOOK" ||
      orderData.order_status === "PAID"
    ) {
      // Find the order
      const { data: order } = await supabase
        .from("orders")
        .select("*")
        .eq("cashfree_order_id", orderId)
        .single();

      if (!order) {
        console.error("Order not found:", orderId);
        return NextResponse.json({ error: "Order not found" }, { status: 404 });
      }

      // Update order status
      const { error: orderErr } = await supabase
        .from("orders")
        .update({ status: "paid" })
        .eq("cashfree_order_id", orderId);

      if (orderErr) {
        console.error("❌ Failed to update order status:", orderErr);
      }

      // Upgrade user plan
      const { error: profileErr } = await supabase
        .from("profiles")
        .update({
          plan: order.plan,
          updated_at: new Date().toISOString(),
        })
        .eq("id", order.user_id);

      if (profileErr) {
        console.error(
          `❌ Failed to upgrade plan for user ${order.user_id}:`,
          profileErr
        );
        return NextResponse.json(
          { error: "Plan upgrade failed" },
          { status: 500 }
        );
      }

      console.log(
        `✅ Payment success: user ${order.user_id} upgraded to ${order.plan}`
      );
    } else if (
      eventType === "PAYMENT_FAILED_WEBHOOK" ||
      orderData.order_status === "FAILED"
    ) {
      await supabase
        .from("orders")
        .update({ status: "failed" })
        .eq("cashfree_order_id", orderId);

      console.log(`❌ Payment failed for order: ${orderId}`);
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Webhook error:", err);
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    );
  }
}
