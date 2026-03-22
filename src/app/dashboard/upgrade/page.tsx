"use client";

import { useState, useEffect } from "react";
import { PLANS, PlanId } from "@/lib/cashfree/plans";

export default function UpgradePage() {
  const [loading, setLoading] = useState<PlanId | null>(null);
  const [error, setError] = useState("");
  const [currentPlan, setCurrentPlan] = useState<string>("free");

  useEffect(() => {
    async function fetchPlan() {
      try {
        const res = await fetch("/api/profile");
        if (res.ok) {
          const data = await res.json();
          setCurrentPlan(data.plan || "free");
        }
      } catch {
        // Fall back to "free"
      }
    }
    fetchPlan();
  }, []);

  async function handleUpgrade(plan: PlanId) {
    if (plan === "free") return;
    setLoading(plan);
    setError("");

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Checkout failed");
      }

      const { payment_session_id } = await res.json();

      // Load Cashfree JS SDK and redirect
      const cashfree = await loadCashfreeSDK();
      if (cashfree) {
        cashfree.checkout({
          paymentSessionId: payment_session_id,
          redirectTarget: "_self",
        });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setLoading(null);
    }
  }

  return (
    <div className="space-y-8 animate-fade-up">
      <div className="text-center">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)] bg-clip-text text-transparent">
          Upgrade Your Plan
        </h1>
        <p className="text-[var(--text-muted)] mt-2">
          Unlock more generations, longer history, and premium features
        </p>
      </div>

      {error && (
        <div className="mx-auto max-w-md p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-center text-sm">
          {error}
        </div>
      )}

      <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {(["free", "pro", "business"] as PlanId[]).map((planId) => {
          const plan = PLANS[planId];
          const isPopular = planId === "pro";

          return (
            <div
              key={planId}
              className={`relative rounded-2xl p-6 border transition-all duration-300 ${
                isPopular
                  ? "border-[var(--accent-primary)] bg-[var(--accent-primary)]/5 shadow-lg shadow-[var(--accent-primary)]/10 scale-[1.02]"
                  : "border-[var(--border-primary)] bg-[var(--bg-secondary)]"
              }`}
            >
              {isPopular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)] text-white">
                  MOST POPULAR
                </div>
              )}

              <div className="text-center mb-6">
                <h3 className="text-lg font-semibold text-[var(--text-primary)]">
                  {plan.name}
                </h3>
                <div className="mt-3">
                  <span className="text-4xl font-bold text-[var(--text-primary)]">
                    ₹{plan.price}
                  </span>
                  {plan.price > 0 && (
                    <span className="text-[var(--text-muted)] text-sm">
                      /month
                    </span>
                  )}
                </div>
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2 text-sm text-[var(--text-secondary)]"
                  >
                    <svg
                      className="w-4 h-4 mt-0.5 text-emerald-400 shrink-0"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2.5}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>

              {planId === currentPlan ? (
                <button
                  disabled
                  className="w-full py-3 rounded-xl text-sm font-medium bg-[var(--bg-tertiary)] text-[var(--text-muted)] cursor-default"
                >
                  Current Plan
                </button>
              ) : planId === "free" ? (
                <button
                  disabled
                  className="w-full py-3 rounded-xl text-sm font-medium bg-[var(--bg-tertiary)] text-[var(--text-muted)] cursor-default"
                >
                  Free Tier
                </button>
              ) : (
                <button
                  onClick={() => handleUpgrade(planId)}
                  disabled={loading !== null}
                  className={`w-full py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                    isPopular
                      ? "bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)] text-white hover:opacity-90"
                      : "bg-[var(--bg-tertiary)] text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)]/80 border border-[var(--border-primary)]"
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {loading === planId ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg
                        className="w-4 h-4 animate-spin"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                        />
                      </svg>
                      Processing…
                    </span>
                  ) : (
                    `Upgrade to ${plan.name}`
                  )}
                </button>
              )}
            </div>
          );
        })}
      </div>

      <p className="text-center text-xs text-[var(--text-muted)]">
        Payments processed securely by Cashfree. Cancel anytime.
      </p>
    </div>
  );
}

/* ---- Cashfree JS SDK Loader ---- */
function loadCashfreeSDK(): Promise<CashfreeInstance | null> {
  return new Promise((resolve) => {
    // If already loaded
    if ((window as unknown as Record<string, unknown>).Cashfree) {
      const cf = (window as unknown as { Cashfree: CashfreeConstructor })
        .Cashfree;
      resolve(
        new cf({
          mode:
            process.env.NEXT_PUBLIC_CASHFREE_ENV === "production"
              ? "production"
              : "sandbox",
        })
      );
      return;
    }

    const script = document.createElement("script");
    script.src = "https://sdk.cashfree.com/js/v3/cashfree.js";
    script.onload = () => {
      const cf = (window as unknown as { Cashfree: CashfreeConstructor })
        .Cashfree;
      if (cf) {
        resolve(
          new cf({
            mode:
              process.env.NEXT_PUBLIC_CASHFREE_ENV === "production"
                ? "production"
                : "sandbox",
          })
        );
      } else {
        resolve(null);
      }
    };
    script.onerror = () => resolve(null);
    document.head.appendChild(script);
  });
}

interface CashfreeInstance {
  checkout(options: {
    paymentSessionId: string;
    redirectTarget: string;
  }): void;
}

interface CashfreeConstructor {
  new (options: { mode: string }): CashfreeInstance;
}
