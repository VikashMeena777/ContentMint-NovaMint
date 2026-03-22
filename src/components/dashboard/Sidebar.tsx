"use client";

import { useState, useEffect, useMemo } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  Zap,
  MessageSquare,
  Target,
  Type,
  Lightbulb,
  History,
  Star,
  Settings,
  LogOut,
  Menu,
  X,
  LayoutDashboard,
} from "lucide-react";
import { createBrowserClient } from "@supabase/ssr";
import clsx from "clsx";
import { PLAN_LIMITS, formatCreditLimit } from "@/lib/plan-limits";

const navItems = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  { divider: true, label: "GENERATORS" },
  {
    label: "Viral Hooks",
    href: "/dashboard/hooks",
    icon: Zap,
    color: "text-accent",
  },
  {
    label: "Captions",
    href: "/dashboard/captions",
    icon: MessageSquare,
    color: "text-spark",
  },
  {
    label: "CTAs",
    href: "/dashboard/ctas",
    icon: Target,
    color: "text-success",
  },
  {
    label: "Titles",
    href: "/dashboard/titles",
    icon: Type,
    color: "text-warning",
  },
  {
    label: "Ideas",
    href: "/dashboard/ideas",
    icon: Lightbulb,
    color: "text-error",
  },
  { divider: true, label: "LIBRARY" },
  {
    label: "History",
    href: "/dashboard/history",
    icon: History,
  },
  {
    label: "Favorites",
    href: "/dashboard/favorites",
    icon: Star,
  },
  { divider: true, label: "ACCOUNT" },
  {
    label: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
  },
];

type UserInfo = {
  name: string;
  email: string;
  avatar: string | null;
  plan: string;
  creditsUsed: number;
  creditsLimit: number;
};

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [user, setUser] = useState<UserInfo | null>(null);
  const [signingOut, setSigningOut] = useState(false);

  const supabase = useMemo(
    () =>
      createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      ),
    []
  );

  useEffect(() => {
    async function loadUser() {
      const {
        data: { user: authUser },
      } = await supabase.auth.getUser();

      if (!authUser) return;

      const { data: profile } = await supabase
        .from("profiles")
        .select("full_name, plan, credits")
        .eq("id", authUser.id)
        .single();

      // Fetch today's usage
      const today = new Date().toISOString().split("T")[0];
      const { data: usageRow } = await supabase
        .from("usage")
        .select("count")
        .eq("user_id", authUser.id)
        .eq("date", today)
        .single();

      const plan = profile?.plan || "free";

      setUser({
        name:
          profile?.full_name ||
          authUser.user_metadata?.full_name ||
          authUser.email?.split("@")[0] ||
          "User",
        email: authUser.email || "",
        avatar:
          authUser.user_metadata?.avatar_url ||
          authUser.user_metadata?.picture ||
          null,
        plan,
        creditsUsed: usageRow?.count || 0,
        creditsLimit: PLAN_LIMITS[plan] || 10,
      });
    }

    loadUser();
  }, [supabase]);

  // Close mobile sidebar on ESC key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape" && mobileOpen) setMobileOpen(false);
    };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [mobileOpen]);

  const handleSignOut = async () => {
    setSigningOut(true);
    await supabase.auth.signOut();
    router.push("/login");
  };

  const usagePercent = user
    ? Math.min((user.creditsUsed / user.creditsLimit) * 100, 100)
    : 0;

  return (
    <>
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 glass-card-static py-3 px-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/ContentMint Logo.jpg"
            alt="ContentMint"
            width={28}
            height={28}
            className="rounded-lg"
          />
          <span className="text-base font-bold text-text-primary font-display">
            ContentMint
          </span>
        </Link>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="btn-ghost p-2"
          aria-label="Toggle sidebar"
        >
          {mobileOpen ? (
            <X className="w-5 h-5" />
          ) : (
            <Menu className="w-5 h-5" />
          )}
        </button>
      </div>

      {/* Backdrop */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 bottom-0 z-50 w-64 bg-surface border-r border-border overflow-y-auto flex flex-col transition-transform duration-300 lg:translate-x-0 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Logo */}
        <div className="p-5 border-b border-border">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/ContentMint Logo.jpg"
              alt="ContentMint"
              width={32}
              height={32}
              className="rounded-lg"
            />
            <span className="text-lg font-bold text-text-primary font-display">
              ContentMint
            </span>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-4 px-3 space-y-1">
          {navItems.map((item, i) => {
            if ("divider" in item && item.divider) {
              return (
                <div
                  key={`divider-${i}`}
                  className="pt-4 pb-2 px-3 text-[11px] font-semibold text-text-muted uppercase tracking-widest"
                >
                  {item.label}
                </div>
              );
            }

            const isActive = pathname === item.href;
            const Icon = item.icon!;

            return (
              <Link
                key={item.href}
                href={item.href!}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? "bg-accent/10 text-accent"
                    : "text-text-secondary hover:text-text-primary hover:bg-hover"
                }`}
              >
                <Icon
                  className={`w-4.5 h-4.5 ${
                    isActive ? "text-accent" : (item as any).color || ""
                  }`}
                />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Usage Bar */}
        <div className="p-4 border-t border-border">
          <div className="glass-card-static p-3 rounded-xl">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-text-muted capitalize">
                {user?.plan || "Free"} Plan
              </span>
              <span className="text-xs font-mono text-text-secondary">
                {user?.creditsUsed || 0}/{user?.creditsLimit || 10}
              </span>
            </div>
            <div className="h-1.5 bg-elevated rounded-full overflow-hidden">
              <div
                className="h-full bg-accent rounded-full transition-all"
                style={{ width: `${usagePercent}%` }}
              />
            </div>
            {user?.plan === "free" && (
              <Link
                href="/dashboard/upgrade"
                className="mt-3 block text-center text-xs text-accent hover:underline"
              >
                Upgrade to Pro →
              </Link>
            )}
          </div>
        </div>

        {/* User & Sign Out */}
        <div className="p-3 border-t border-border">
          {user && (
            <div className="flex items-center gap-3 px-3 py-2 mb-1">
              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt=""
                  className="w-8 h-8 rounded-full"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center text-accent text-sm font-bold">
                  {user.name[0]?.toUpperCase()}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-text-primary truncate">
                  {user.name}
                </p>
                <p className="text-xs text-text-muted truncate">
                  {user.email}
                </p>
              </div>
            </div>
          )}
          <button
            onClick={handleSignOut}
            disabled={signingOut}
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm text-text-muted hover:text-error hover:bg-hover transition-all disabled:opacity-50"
          >
            <LogOut className="w-4 h-4" />
            {signingOut ? "Signing out..." : "Sign Out"}
          </button>
        </div>
      </aside>
    </>
  );
}
