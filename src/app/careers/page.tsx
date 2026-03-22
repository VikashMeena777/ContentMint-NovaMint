import Link from "next/link";
import { Sparkles, MapPin, Briefcase } from "lucide-react";

export const metadata = {
  title: "Careers — ContentMint",
  description:
    "Join the ContentMint team and help build the future of AI-powered content creation.",
};

const positions = [
  {
    title: "Senior Full-Stack Engineer",
    team: "Engineering",
    location: "Remote",
    type: "Full-time",
  },
  {
    title: "AI/ML Engineer",
    team: "Engineering",
    location: "Remote",
    type: "Full-time",
  },
  {
    title: "Growth Marketer",
    team: "Marketing",
    location: "Remote",
    type: "Full-time",
  },
];

export default function CareersPage() {
  return (
    <>
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
        <h1 className="font-display font-bold text-4xl sm:text-5xl text-text-primary mb-4">
          Careers at <span className="gradient-text">ContentMint</span>
        </h1>
        <p className="text-text-secondary text-lg mb-12 max-w-2xl">
          We&apos;re building the future of AI-powered content creation. Join our
          remote-first team and help millions of creators grow faster.
        </p>

        <h2 className="font-display font-semibold text-xl text-text-primary mb-6">
          Open Positions
        </h2>

        <div className="space-y-4 mb-16">
          {positions.map((pos) => (
            <div
              key={pos.title}
              className="glass-card p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div>
                <h3 className="font-semibold text-text-primary text-lg">
                  {pos.title}
                </h3>
                <div className="flex items-center gap-4 mt-1.5 text-sm text-text-muted">
                  <span className="flex items-center gap-1.5">
                    <Briefcase className="w-3.5 h-3.5" />
                    {pos.team} · {pos.type}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5" />
                    {pos.location}
                  </span>
                </div>
              </div>
              <button className="btn-primary text-sm whitespace-nowrap">
                Apply Now
              </button>
            </div>
          ))}
        </div>

        <div className="glass-card-featured p-8 text-center">
          <h2 className="font-display font-bold text-2xl text-text-primary mb-3">
            Don&apos;t see your role?
          </h2>
          <p className="text-text-secondary mb-6">
            We&apos;re always looking for exceptional talent. Send us your resume
            and tell us how you&apos;d contribute.
          </p>
          <Link href="/contact" className="btn-secondary">
            Get in Touch
          </Link>
        </div>
      </main>
    </>
  );
}
