import Link from "next/link";
import { Sparkles, Users, Zap, Heart } from "lucide-react";

export const metadata = {
  title: "About — ContentMint",
  description:
    "Learn about ContentMint, the AI-powered content generation platform built for creators, marketers & founders.",
};

export default function AboutPage() {
  return (
    <>
      {/* Nav */}
      <nav className="sticky top-0 z-50 glass-card-static border-b border-[hsl(var(--border))]">
        <div className="mx-auto max-w-7xl flex items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[hsl(var(--accent))] to-[hsl(var(--spark)/0.7)] flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-bold text-text-primary font-display tracking-tight">
              ContentMint
            </span>
          </Link>
          <Link href="/login" className="btn-primary text-sm">
            Get Started Free
          </Link>
        </div>
      </nav>

      <main className="mx-auto max-w-4xl px-6 py-20">
        <h1 className="font-display font-bold text-4xl sm:text-5xl text-text-primary mb-6">
          About <span className="gradient-text">ContentMint</span>
        </h1>
        <p className="text-text-secondary text-lg leading-relaxed mb-12 max-w-2xl">
          ContentMint is an AI-powered content generation platform that helps
          creators, marketers &amp; founders produce high-converting hooks,
          captions, CTAs, titles and content ideas in seconds — not hours.
        </p>

        <div className="grid sm:grid-cols-3 gap-6 mb-16">
          {[
            {
              icon: Zap,
              title: "Our Mission",
              desc: "Democratize high-quality content creation so anyone can build an audience and grow their brand.",
            },
            {
              icon: Users,
              title: "Our Team",
              desc: "A small, passionate team of creators and engineers who understand the pain of staring at a blank screen.",
            },
            {
              icon: Heart,
              title: "Our Values",
              desc: "Speed, simplicity and putting creators first. We build tools we use ourselves every day.",
            },
          ].map((card) => (
            <div key={card.title} className="glass-card p-6">
              <card.icon className="w-8 h-8 text-accent mb-4" />
              <h3 className="font-display font-semibold text-lg text-text-primary mb-2">
                {card.title}
              </h3>
              <p className="text-text-secondary text-sm leading-relaxed">
                {card.desc}
              </p>
            </div>
          ))}
        </div>

        <div className="glass-card-featured p-8 text-center">
          <h2 className="font-display font-bold text-2xl text-text-primary mb-3">
            Want to join us?
          </h2>
          <p className="text-text-secondary mb-6">
            We&apos;re always looking for talented people who share our mission.
          </p>
          <Link href="/careers" className="btn-primary">
            View Open Positions
          </Link>
        </div>
      </main>
    </>
  );
}
