import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createCashfreeOrder } from "@/lib/cashfree/client";
import { PLANS, PlanId } from "@/lib/cashfree/plans";
import { nanoid } from "nanoid";

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { plan } = (await req.json()) as { plan: string };

    if (plan !== "pro" && plan !== "business") {
      return NextResponse.json(
        { error: "Invalid plan. Choose 'pro' or 'business'" },
        { status: 400 }
      );
    }

    const planDef = PLANS[plan as PlanId];
    const orderId = `cm_${user.id.slice(0, 8)}_${nanoid(10)}`;
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    // Create order on Cashfree
    const cfOrder = await createCashfreeOrder({
      orderId,
      amount: planDef.price,
      customerName: user.user_metadata?.full_name || "User",
      customerEmail: user.email || "",
      customerPhone: user.user_metadata?.phone || "9999999999",
      returnUrl: `${appUrl}/dashboard/settings?payment=success&order_id=${orderId}`,
      notifyUrl: `${appUrl}/api/webhooks/cashfree`,
    });

    // Save order to DB
    await supabase.from("orders").insert({
      user_id: user.id,
      cashfree_order_id: orderId,
      plan,
      amount: planDef.price,
      status: "created",
      payment_session_id: cfOrder.payment_session_id,
    });

    return NextResponse.json({
      payment_session_id: cfOrder.payment_session_id,
      order_id: orderId,
    });
  } catch (err) {
    console.error("Checkout error:", err);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
