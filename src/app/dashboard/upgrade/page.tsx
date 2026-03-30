"use client";

import { useState, useEffect } from "react";
import {
  Check,
  Zap,
  Crown,
  Rocket,
  Shield,
  ArrowRight,
  Loader2,
  Star,
  Infinity,
  Sparkles,
} from "lucide-react";
import { PLANS, PlanId } from "@/lib/cashfree/plans";

/* ---- Plan visual config ---- */
const PLAN_META: Record<
  PlanId,
  {
    icon: React.ReactNode;
    gradient: string;
    glowColor: string;
    tagline: string;
    badge?: string;
    bg: string;
    iconBg: string;
    iconColor: string;
  }
> = {
  free: {
    icon: <Zap className="w-5 h-5" />,
    gradient: "from-emerald-400 to-teal-500",
    glowColor: "shadow-emerald-500/20",
    tagline: "Perfect for getting started",
    bg: "bg-gradient-to-br from-emerald-500/5 to-teal-500/5",
    iconBg: "bg-gradient-to-br from-emerald-500/20 to-teal-500/20",
    iconColor: "text-emerald-400",
  },
  pro: {
    icon: <Crown className="w-5 h-5" />,
    gradient: "from-[hsl(var(--accent))] to-[hsl(var(--spark))]",
    glowColor: "shadow-[hsl(var(--accent-glow))/0.25]",
    tagline: "For serious creators & marketers",
    badge: "MOST POPULAR",
    bg: "bg-gradient-to-br from-[hsl(var(--accent)/0.08)] to-[hsl(var(--spark)/0.05)]",
    iconBg:
      "bg-gradient-to-br from-[hsl(var(--accent)/0.25)] to-[hsl(var(--spark)/0.15)]",
    iconColor: "text-[hsl(var(--accent))]",
  },
  business: {
    icon: <Rocket className="w-5 h-5" />,
    gradient: "from-amber-400 to-orange-500",
    glowColor: "shadow-amber-500/20",
    tagline: "For teams & agencies at scale",
    bg: "bg-gradient-to-br from-amber-500/5 to-orange-500/5",
    iconBg: "bg-gradient-to-br from-amber-500/20 to-orange-500/20",
    iconColor: "text-amber-400",
  },
};

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
    <div className="min-h-[80vh] space-y-10 animate-fade-up">
      {/* ---- Hero Header ---- */}
      <div className="relative text-center pt-4 pb-2">
        {/* Background glow */}
        <div className="absolute inset-0 -top-20 pointer-events-none overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-gradient-to-r from-[hsl(var(--accent)/0.15)] via-[hsl(var(--spark)/0.08)] to-transparent rounded-full blur-[100px]" />
        </div>

        <div className="relative">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[hsl(var(--accent)/0.1)] border border-[hsl(var(--accent)/0.2)] text-xs font-semibold tracking-wider uppercase text-[hsl(var(--accent))] mb-5">
            <Sparkles className="w-3.5 h-3.5" />
            Pricing Plans
          </div>

          <h1 className="text-4xl md:text-5xl font-bold font-display text-text-primary leading-tight">
            Supercharge Your{" "}
            <span className="bg-gradient-to-r from-[hsl(var(--accent))] to-[hsl(var(--spark))] bg-clip-text text-transparent">
              Content
            </span>
          </h1>
          <p className="text-text-secondary text-lg mt-3 max-w-lg mx-auto">
            Unlock more generations, longer history, and premium features to
            10× your content workflow.
          </p>
        </div>
      </div>

      {/* ---- Error Alert ---- */}
      {error && (
        <div className="mx-auto max-w-md p-4 rounded-2xl bg-[hsl(var(--error)/0.1)] border border-[hsl(var(--error)/0.25)] text-[hsl(var(--error))] text-center text-sm font-medium">
          {error}
        </div>
      )}

      {/* ---- Pricing Cards ---- */}
      <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto px-1 pt-4">
        {(["free", "pro", "business"] as PlanId[]).map((planId, idx) => {
          const plan = PLANS[planId];
          const meta = PLAN_META[planId];
          const isPopular = planId === "pro";
          const isCurrent = planId === currentPlan;

          return (
            <div
              key={planId}
              className="relative group"
              style={{ animationDelay: `${idx * 100}ms` }}
            >
              {/* Popular badge — placed OUTSIDE overflow-hidden card */}
              {isPopular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 z-20">
                  <div className="flex items-center gap-1.5 px-4 py-1.5 rounded-full text-[11px] font-bold tracking-wider bg-gradient-to-r from-[hsl(var(--accent))] to-[hsl(var(--spark))] text-white shadow-lg shadow-[hsl(var(--accent-glow)/0.3)] whitespace-nowrap">
                    <Star className="w-3 h-3 fill-current" />
                    {meta.badge}
                  </div>
                </div>
              )}

              {/* Card */}
              <div
                className={`relative h-full rounded-2xl border transition-all duration-500
                  ${
                    isPopular
                      ? "border-[hsl(var(--accent)/0.4)] shadow-xl " +
                        meta.glowColor +
                        " md:scale-[1.03] z-10"
                      : "border-[hsl(var(--border))] hover:border-[hsl(var(--border-hover)/0.4)] shadow-lg shadow-black/10"
                  }
                  ${meta.bg}
                  group-hover:shadow-2xl group-hover:-translate-y-1
                `}
              >
                {/* Top accent bar */}
                <div
                  className={`h-1 w-full bg-gradient-to-r ${meta.gradient} rounded-t-2xl`}
                />

                <div className="p-7">
                  {/* Plan icon + name */}
                  <div className="flex items-center gap-3 mb-4">
                    <div
                      className={`w-11 h-11 rounded-xl ${meta.iconBg} flex items-center justify-center ${meta.iconColor}`}
                    >
                      {meta.icon}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-text-primary font-display">
                        {plan.name}
                      </h3>
                      <p className="text-xs text-text-muted">{meta.tagline}</p>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="flex items-baseline gap-1 mb-1">
                    <span className="text-4xl font-extrabold text-text-primary tracking-tight">
                      {plan.price === 0 ? (
                        "Free"
                      ) : (
                        <>
                          ₹{plan.price}
                        </>
                      )}
                    </span>
                    {plan.price > 0 && (
                      <span className="text-text-muted text-sm font-medium">
                        /month
                      </span>
                    )}
                  </div>
                  {plan.price > 0 && (
                    <p className="text-xs text-text-muted mb-5">
                      Billed monthly · Cancel anytime
                    </p>
                  )}
                  {plan.price === 0 && (
                    <p className="text-xs text-text-muted mb-5">
                      No credit card required
                    </p>
                  )}

                  {/* Divider */}
                  <div className="h-px w-full bg-gradient-to-r from-transparent via-[hsl(var(--border))] to-transparent mb-5" />

                  {/* Features */}
                  <ul className="space-y-3 mb-7">
                    {plan.features.map((feature, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-2.5 text-sm text-text-secondary"
                      >
                        <div
                          className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                            isPopular
                              ? "bg-[hsl(var(--accent)/0.15)]"
                              : planId === "business"
                              ? "bg-amber-500/15"
                              : "bg-emerald-500/15"
                          }`}
                        >
                          {feature.includes("Unlimited") ? (
                            <Infinity
                              className={`w-3 h-3 ${
                                planId === "business"
                                  ? "text-amber-400"
                                  : "text-emerald-400"
                              }`}
                            />
                          ) : (
                            <Check
                              className={`w-3 h-3 ${
                                isPopular
                                  ? "text-[hsl(var(--accent))]"
                                  : planId === "business"
                                  ? "text-amber-400"
                                  : "text-emerald-400"
                              }`}
                            />
                          )}
                        </div>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA Button */}
                  {isCurrent ? (
                    <button
                      disabled
                      className="w-full py-3.5 rounded-xl text-sm font-semibold bg-[hsl(var(--bg-elevated))] text-text-muted border border-[hsl(var(--border))] cursor-default flex items-center justify-center gap-2"
                    >
                      <Shield className="w-4 h-4" />
                      Current Plan
                    </button>
                  ) : planId === "free" ? (
                    <button
                      disabled
                      className="w-full py-3.5 rounded-xl text-sm font-semibold bg-[hsl(var(--bg-elevated))] text-text-muted border border-[hsl(var(--border))] cursor-default"
                    >
                      Free Tier
                    </button>
                  ) : (
                    <button
                      onClick={() => handleUpgrade(planId)}
                      disabled={loading !== null}
                      className={`w-full py-3.5 rounded-xl text-sm font-semibold transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed
                        ${
                          isPopular
                            ? "bg-gradient-to-r from-[hsl(var(--accent))] to-[hsl(var(--spark))] text-white shadow-lg shadow-[hsl(var(--accent-glow)/0.3)] hover:shadow-xl hover:shadow-[hsl(var(--accent-glow)/0.4)] hover:scale-[1.02] active:scale-[0.98]"
                            : "bg-gradient-to-r " +
                              meta.gradient +
                              " text-white shadow-lg " +
                              meta.glowColor +
                              " hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]"
                        }
                      `}
                    >
                      {loading === planId ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Processing…
                        </>
                      ) : (
                        <>
                          Upgrade to {plan.name}
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ---- Trust Footer ---- */}
      <div className="text-center space-y-3 pb-6">
        <div className="flex items-center justify-center gap-6 text-text-muted text-xs">
          <span className="flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5" />
            Secure Payments
          </span>
          <span className="w-1 h-1 rounded-full bg-[hsl(var(--border))]" />
          <span>Powered by Cashfree</span>
          <span className="w-1 h-1 rounded-full bg-[hsl(var(--border))]" />
          <span>Cancel Anytime</span>
        </div>
      </div>
    </div>
  );
}

/* ---- Cashfree JS SDK Loader ---- */
function loadCashfreeSDK(): Promise<CashfreeInstance | null> {
  return new Promise((resolve) => {
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
