import Link from "next/link";
import { Sparkles, ArrowRight, Clock } from "lucide-react";

export const metadata = {
  title: "Blog — ContentMint",
  description:
    "Tips, tutorials, and insights on AI content creation, growth hacking, and social media marketing.",
};

const posts = [
  {
    title: "10 Viral Hook Formulas That Actually Work in 2026",
    excerpt:
      "We analyzed 50,000+ high-performing posts to find the hook patterns that consistently stop the scroll.",
    date: "March 18, 2026",
    readTime: "5 min read",
    tag: "Hooks",
  },
  {
    title: "AI-Generated Captions vs. Human-Written: A 30-Day Test",
    excerpt:
      "We ran a split test across 4 creator accounts. The results surprised us.",
    date: "March 12, 2026",
    readTime: "7 min read",
    tag: "Case Study",
  },
  {
    title: "How to Write CTAs That Convert at 3x the Average Rate",
    excerpt:
      "Most calls-to-action are generic. Here's how to make yours impossible to ignore.",
    date: "March 5, 2026",
    readTime: "4 min read",
    tag: "CTAs",
  },
  {
    title: "The Creator's Guide to Content Batching with AI",
    excerpt:
      "Batch a week of content in 30 minutes using AI-generated hooks, captions and ideas.",
    date: "Feb 28, 2026",
    readTime: "6 min read",
    tag: "Productivity",
  },
];

export default function BlogPage() {
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
          Blog
        </h1>
        <p className="text-text-secondary text-lg mb-12">
          Tips, tutorials, and insights on AI-powered content creation.
        </p>

        <div className="space-y-6">
          {posts.map((post) => (
            <article
              key={post.title}
              className="glass-card p-6 sm:p-8 group hover:border-[hsl(var(--accent)/0.3)] transition-all duration-300"
            >
              <div className="flex items-center gap-3 mb-3">
                <span className="badge-accent text-xs">{post.tag}</span>
                <span className="flex items-center gap-1.5 text-xs text-text-muted">
                  <Clock className="w-3 h-3" />
                  {post.readTime}
                </span>
              </div>
              <h2 className="font-display font-semibold text-xl text-text-primary mb-2 group-hover:text-accent transition-colors">
                {post.title}
              </h2>
              <p className="text-text-secondary text-sm leading-relaxed mb-4">
                {post.excerpt}
              </p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-text-muted">{post.date}</span>
                <span className="text-sm text-accent font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
                  Read more <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </article>
          ))}
        </div>
      </main>
    </>
  );
}
