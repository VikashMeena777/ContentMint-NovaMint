"use client";

import { Suspense } from "react";
import { Settings, User, CreditCard } from "lucide-react";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { createBrowserClient } from "@supabase/ssr";
import Link from "next/link";

function SettingsContent() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [plan, setPlan] = useState("free");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const searchParams = useSearchParams();

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    async function loadProfile() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      setEmail(user.email || "");

      const { data: profile } = await supabase
        .from("profiles")
        .select("full_name, plan")
        .eq("id", user.id)
        .single();

      if (profile) {
        setName(profile.full_name || "");
        setPlan(profile.plan || "free");
      }
    }

    async function verifyPayment(orderId: string) {
      try {
        // Call verify endpoint — this polls Cashfree directly and
        // upgrades the plan in Supabase if payment was successful.
        // This is the critical fallback when the webhook doesn't fire.
        const res = await fetch(`/api/checkout/verify?order_id=${orderId}`);
        if (res.ok) {
          const data = await res.json();
          if (data.status === "paid" && data.plan) {
            setPlan(data.plan);
            setPaymentSuccess(true);
            setTimeout(() => setPaymentSuccess(false), 5000);
          }
        }
      } catch (err) {
        console.error("Payment verification failed:", err);
      }
      // Always reload profile after verification attempt
      await loadProfile();
    }

    loadProfile();

    // Handle payment redirect from Cashfree
    const paymentStatus = searchParams.get("payment");
    const orderId = searchParams.get("order_id");

    if (paymentStatus === "success" && orderId) {
      // Verify the payment with Cashfree and upgrade the plan
      verifyPayment(orderId);
    }
  }, [searchParams]);

  const handleSave = async () => {
    setSaving(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    await supabase
      .from("profiles")
      .update({ full_name: name })
      .eq("id", user.id);

    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const planDetails: Record<
    string,
    { label: string; desc: string; upgradeTo: string | null }
  > = {
    free: {
      label: "Free Plan",
      desc: "10 generations per day · Basic features",
      upgradeTo: "Upgrade to Pro — ₹199/mo",
    },
    pro: {
      label: "Pro Plan",
      desc: "100 generations per day · All generators · Priority",
      upgradeTo: "Upgrade to Business — ₹399/mo",
    },
    business: {
      label: "Business Plan",
      desc: "Unlimited generations · All features · Priority support",
      upgradeTo: null,
    },
  };

  const currentPlan = planDetails[plan] || planDetails.free;

  return (
    <div className="space-y-8">
      {paymentSuccess && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm flex items-center gap-2 animate-fade-up">
          <span className="text-lg">🎉</span>
          Payment successful! Your plan has been upgraded.
        </div>
      )}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
          <Settings className="w-5 h-5 text-accent" />
        </div>
        <div>
          <h1 className="font-display font-bold text-2xl text-text-primary">
            Settings
          </h1>
          <p className="text-text-secondary text-sm">
            Manage your profile and subscription.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Profile */}
        <div className="glass-card-static p-6 space-y-4">
          <div className="flex items-center gap-3">
            <User className="w-5 h-5 text-accent" />
            <h2 className="font-display font-semibold text-text-primary">
              Profile
            </h2>
          </div>
          <div className="space-y-3">
            <div>
              <label className="block text-sm text-text-muted mb-1">
                Email
              </label>
              <input
                type="email"
                value={email}
                disabled
                className="w-full bg-elevated border border-border rounded-xl px-4 py-2.5 text-sm text-text-muted cursor-not-allowed"
              />
            </div>
            <div>
              <label className="block text-sm text-text-muted mb-1">
                Display Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                className="w-full bg-elevated border border-border rounded-xl px-4 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent transition-all"
              />
            </div>
          </div>
          <button
            onClick={handleSave}
            disabled={saving}
            className="btn-primary py-2 px-4 text-sm"
          >
            {saving ? "Saving..." : saved ? "✓ Saved!" : "Save Changes"}
          </button>
        </div>

        {/* Subscription */}
        <div className="glass-card-static p-6 space-y-4">
          <div className="flex items-center gap-3">
            <CreditCard className="w-5 h-5 text-spark" />
            <h2 className="font-display font-semibold text-text-primary">
              Subscription
            </h2>
          </div>
          <div className="p-4 bg-elevated rounded-xl">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-text-primary">
                {currentPlan.label}
              </span>
              <span className="px-2 py-0.5 bg-accent/10 text-accent text-xs font-semibold rounded-full">
                Current
              </span>
            </div>
            <p className="text-xs text-text-muted mb-3">{currentPlan.desc}</p>
            {currentPlan.upgradeTo && (
              <Link href="/dashboard/upgrade" className="btn-primary py-2 px-4 text-sm w-full block text-center">
                {currentPlan.upgradeTo}
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SettingsPage() {
  return (
    <Suspense fallback={<div className="text-text-muted text-sm p-8">Loading settings…</div>}>
      <SettingsContent />
    </Suspense>
  );
}
