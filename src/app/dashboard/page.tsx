"use client";

import Link from "next/link";
import {
  Zap,
  MessageSquare,
  Target,
  Type,
  Lightbulb,
  ArrowRight,
  TrendingUp,
  Clock,
  Star,
  Loader2,
} from "lucide-react";
import { useState, useEffect } from "react";
import { createBrowserClient } from "@supabase/ssr";

const generators = [
  {
    title: "Viral Hooks",
    description: "Scroll-stopping openers that boost watch time",
    href: "/dashboard/hooks",
    icon: Zap,
    color: "text-accent",
    bg: "bg-accent/10",
  },
  {
    title: "Captions",
    description: "Platform-optimized captions with CTAs",
    href: "/dashboard/captions",
    icon: MessageSquare,
    color: "text-spark",
    bg: "bg-spark/10",
  },
  {
    title: "CTAs",
    description: "Action-driving calls-to-action that convert",
    href: "/dashboard/ctas",
    icon: Target,
    color: "text-success",
    bg: "bg-success/10",
  },
  {
    title: "Titles",
    description: "Click-worthy titles for blogs & videos",
    href: "/dashboard/titles",
    icon: Type,
    color: "text-warning",
    bg: "bg-warning/10",
  },
  {
    title: "Ideas",
    description: "Trending content ideas for your niche",
    href: "/dashboard/ideas",
    icon: Lightbulb,
    color: "text-error",
    bg: "bg-error/10",
  },
];

type Stats = {
  generationsToday: number;
  favorites: number;
  totalHistory: number;
  loading: boolean;
};

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats>({
    generationsToday: 0,
    favorites: 0,
    totalHistory: 0,
    loading: true,
  });
  const [userName, setUserName] = useState<string>("");

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    async function fetchStats() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      // Extract display name
      const name =
        user.user_metadata?.full_name ||
        user.user_metadata?.name ||
        user.email?.split("@")[0] ||
        "";
      setUserName(name);

      // Today's usage
      const today = new Date().toISOString().split("T")[0];
      const { data: usage } = await supabase
        .from("usage")
        .select("count")
        .eq("user_id", user.id)
        .eq("date", today)
        .single();

      // Favorites count
      const { count: favsCount } = await supabase
        .from("generations")
        .select("id", { count: "exact", head: true })
        .eq("user_id", user.id)
        .eq("is_favorite", true);

      // Total history count
      const { count: totalCount } = await supabase
        .from("generations")
        .select("id", { count: "exact", head: true })
        .eq("user_id", user.id);

      setStats({
        generationsToday: usage?.count || 0,
        favorites: favsCount || 0,
        totalHistory: totalCount || 0,
        loading: false,
      });
    }

    fetchStats();
  }, []);

  const statCards = [
    {
      label: "Generations Today",
      value: stats.generationsToday,
      icon: TrendingUp,
    },
    { label: "Saved to Favorites", value: stats.favorites, icon: Star },
    { label: "History Items", value: stats.totalHistory, icon: Clock },
  ];

  return (
    <div className="space-y-8">
      {/* Greeting */}
      <div>
        <h1 className="font-display font-bold text-2xl sm:text-3xl text-text-primary">
          {userName ? `Welcome back, ${userName} ✨` : "Welcome back ✨"}
        </h1>
        <p className="text-text-secondary mt-1">
          Choose a generator below to start creating content.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="glass-card-static p-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
                  <Icon className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-text-primary font-display">
                    {stats.loading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      stat.value
                    )}
                  </p>
                  <p className="text-xs text-text-muted">{stat.label}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Generators Grid */}
      <div>
        <h2 className="font-display font-semibold text-lg text-text-primary mb-4">
          Generators
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {generators.map((gen) => {
            const Icon = gen.icon;
            return (
              <Link
                key={gen.title}
                href={gen.href}
                className="glass-card p-6 flex flex-col gap-3 group"
              >
                <div
                  className={`w-12 h-12 rounded-xl ${gen.bg} flex items-center justify-center`}
                >
                  <Icon className={`w-6 h-6 ${gen.color}`} />
                </div>
                <h3 className="font-display font-semibold text-text-primary">
                  {gen.title}
                </h3>
                <p className="text-sm text-text-secondary">
                  {gen.description}
                </p>
                <div className="mt-auto flex items-center gap-1 text-sm text-accent opacity-0 group-hover:opacity-100 transition-opacity">
                  Generate now
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
