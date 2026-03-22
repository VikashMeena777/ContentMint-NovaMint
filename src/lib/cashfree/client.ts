/* ========================================
   Cashfree — API Client
   Creates payment orders via REST API
   ======================================== */

const CASHFREE_BASE =
  process.env.CASHFREE_ENV === "production"
    ? "https://api.cashfree.com/pg"
    : "https://sandbox.cashfree.com/pg";

const API_VERSION = process.env.CASHFREE_API_VERSION || "2023-08-01";

interface CreateOrderParams {
  orderId: string;
  amount: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  returnUrl: string;
  notifyUrl?: string;
}

interface CashfreeOrderResponse {
  cf_order_id: string;
  order_id: string;
  payment_session_id: string;
  order_status: string;
}

export async function createCashfreeOrder(
  params: CreateOrderParams
): Promise<CashfreeOrderResponse> {
  const appId = process.env.CASHFREE_APP_ID;
  const secretKey = process.env.CASHFREE_SECRET_KEY;

  if (!appId || !secretKey) {
    throw new Error("Cashfree credentials not configured");
  }

  const body = {
    order_id: params.orderId,
    order_amount: params.amount,
    order_currency: "INR",
    customer_details: {
      customer_id: params.orderId.split("_")[1] || params.orderId,
      customer_name: params.customerName,
      customer_email: params.customerEmail,
      customer_phone: params.customerPhone,
    },
    order_meta: {
      return_url: params.returnUrl,
      notify_url: params.notifyUrl,
    },
  };

  const res = await fetch(`${CASHFREE_BASE}/orders`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-client-id": appId,
      "x-client-secret": secretKey,
      "x-api-version": API_VERSION,
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(
      `Cashfree order creation failed: ${err.message || res.statusText}`
    );
  }

  return res.json();
}

export async function getCashfreeOrderStatus(
  orderId: string
): Promise<CashfreeOrderResponse> {
  const appId = process.env.CASHFREE_APP_ID;
  const secretKey = process.env.CASHFREE_SECRET_KEY;

  if (!appId || !secretKey) {
    throw new Error("Cashfree credentials not configured");
  }

  const res = await fetch(`${CASHFREE_BASE}/orders/${orderId}`, {
    method: "GET",
    headers: {
      "x-client-id": appId,
      "x-client-secret": secretKey,
      "x-api-version": API_VERSION,
    },
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(
      `Cashfree order fetch failed: ${err.message || res.statusText}`
    );
  }

  return res.json();
}

/**
 * Verify Cashfree webhook signature
 * Uses HMAC-SHA256 with the secret key
 */
export function verifyCashfreeWebhook(
  rawBody: string,
  signature: string
): boolean {
  // In production, verify using crypto HMAC
  // For sandbox, Cashfree may not always send valid signatures
  if (process.env.CASHFREE_ENV !== "production") {
    return true; // Skip verification in sandbox
  }

  try {
    const crypto = require("crypto");
    const secretKey = process.env.CASHFREE_SECRET_KEY;
    if (!secretKey) return false;

    const expectedSignature = crypto
      .createHmac("sha256", secretKey)
      .update(rawBody)
      .digest("base64");

    return signature === expectedSignature;
  } catch {
    return false;
  }
}
