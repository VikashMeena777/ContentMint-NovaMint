"use client";

import { useState, useRef, useEffect } from "react";
import {
  Sparkles,
  Copy,
  Check,
  Star,
  Loader2,
  RefreshCw,
  Lock,
} from "lucide-react";
import type { ContentType, GenerationResult, Tone, Platform } from "@/types";
import { PLATFORM_OPTIONS, TONE_OPTIONS } from "@/types";

interface GeneratorFormProps {
  type: ContentType;
  title: string;
  description: string;
  icon: React.ReactNode;
  accentColor: string;
  topicPlaceholder: string;
  showPlatform?: boolean;
  showTone?: boolean;
  showNiche?: boolean;
  showGoal?: boolean;
  showFormat?: boolean;
  showAudience?: boolean;
  showCharLimit?: boolean;
  goalLabel?: string;
  goalPlaceholder?: string;
}

export default function GeneratorForm({
  type,
  title,
  description,
  icon,
  accentColor,
  topicPlaceholder,
  showPlatform = false,
  showTone = true,
  showNiche = false,
  showGoal = false,
  showFormat = false,
  showAudience = false,
  showCharLimit = false,
  goalLabel = "Goal",
  goalPlaceholder = "e.g. Lead generation, sales...",
}: GeneratorFormProps) {
  const [topic, setTopic] = useState("");
  const [platform, setPlatform] = useState<Platform>("instagram");
  const [tone, setTone] = useState<Tone>("professional");
  const [niche, setNiche] = useState("");
  const [goal, setGoal] = useState("");
  const [audience, setAudience] = useState("");
  const [format, setFormat] = useState("short-form video");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<GenerationResult[]>([]);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);
  const [favIdx, setFavIdx] = useState<Set<number>>(new Set());
  const resultsRef = useRef<HTMLDivElement>(null);
  const [toneCount, setToneCount] = useState<number>(3); // default to free

  // Fetch user plan to determine tone limits
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/profile");
        if (res.ok) {
          const data = await res.json();
          const plan = data.plan || "free";
          // Map plan to tone count
          const counts: Record<string, number> = { free: 3, pro: 10, business: 10 };
          setToneCount(counts[plan] || 3);
        }
      } catch { /* keep default */ }
    })();
  }, []);

  const handleGenerate = async () => {
    if (!topic.trim()) return;
    setLoading(true);
    setResults([]);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type,
          topic: topic.trim(),
          platform: showPlatform ? platform : undefined,
          tone: showTone ? tone : undefined,
          niche: showNiche ? niche : undefined,
          goal: showGoal ? goal : undefined,
          audience: showAudience ? audience : undefined,
          format: showFormat ? format : undefined,
        }),
      });

      if (res.status === 401) {
        window.location.href = "/login";
        return;
      }

      if (res.status === 429) {
        setResults([
          {
            text: "⚡ You've reached your daily generation limit. Upgrade your plan for more credits!",
            score: 0,
          },
        ]);
        return;
      }

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || "Generation failed");
      }

      const data = await res.json();
      setResults(data.results || []);

      // Scroll to results
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 100);
    } catch {
      setResults([
        {
          text: "Oops! Something went wrong. Please check your API key and try again.",
          score: 0,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async (text: string, idx: number) => {
    await navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  const toggleFav = (idx: number) => {
    setFavIdx((prev) => {
      const next = new Set(prev);
      if (next.has(idx)) next.delete(idx);
      else next.add(idx);
      return next;
    });
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-start gap-4">
        <div
          className={`w-12 h-12 rounded-xl flex items-center justify-center ${accentColor}`}
        >
          {icon}
        </div>
        <div>
          <h1 className="font-display font-bold text-2xl text-text-primary">
            {title}
          </h1>
          <p className="text-text-secondary text-sm mt-1">{description}</p>
        </div>
      </div>

      {/* Form */}
      <div className="glass-card-static p-6 space-y-5">
        {/* Topic */}
        <div>
          <label className="block text-sm font-medium text-text-primary mb-2">
            Topic / Subject *
          </label>
          <textarea
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder={topicPlaceholder}
            rows={3}
            className="w-full bg-elevated border border-border rounded-xl px-4 py-3 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent resize-none transition-all"
          />
        </div>

        {/* Optional fields in grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {showPlatform && (
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Platform
              </label>
              <select
                value={platform}
                onChange={(e) => setPlatform(e.target.value as Platform)}
                className="w-full bg-elevated border border-border rounded-xl px-4 py-3 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent transition-all appearance-none"
              >
                {PLATFORM_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          )}

          {showTone && (
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Tone
              </label>
              <select
                value={tone}
                onChange={(e) => setTone(e.target.value as Tone)}
                className="w-full bg-elevated border border-border rounded-xl px-4 py-3 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent transition-all appearance-none"
              >
                {TONE_OPTIONS.map((opt, i) => (
                  <option
                    key={opt.value}
                    value={opt.value}
                    disabled={i >= toneCount}
                  >
                    {opt.label}{i >= toneCount ? " 🔒 Pro" : ""}
                  </option>
                ))}
              </select>
            </div>
          )}

          {showNiche && (
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Niche
              </label>
              <input
                type="text"
                value={niche}
                onChange={(e) => setNiche(e.target.value)}
                placeholder="e.g. fitness, tech, lifestyle..."
                className="w-full bg-elevated border border-border rounded-xl px-4 py-3 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent transition-all"
              />
            </div>
          )}

          {showGoal && (
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                {goalLabel}
              </label>
              <input
                type="text"
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                placeholder={goalPlaceholder}
                className="w-full bg-elevated border border-border rounded-xl px-4 py-3 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent transition-all"
              />
            </div>
          )}

          {showAudience && (
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Target Audience
              </label>
              <input
                type="text"
                value={audience}
                onChange={(e) => setAudience(e.target.value)}
                placeholder="e.g. beginners, business owners..."
                className="w-full bg-elevated border border-border rounded-xl px-4 py-3 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent transition-all"
              />
            </div>
          )}

          {showFormat && (
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Content Format
              </label>
              <select
                value={format}
                onChange={(e) => setFormat(e.target.value)}
                className="w-full bg-elevated border border-border rounded-xl px-4 py-3 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent transition-all appearance-none"
              >
                <option value="short-form video">Short-Form Video</option>
                <option value="long-form video">Long-Form Video</option>
                <option value="blog post">Blog Post</option>
                <option value="carousel">Carousel</option>
                <option value="thread">Thread</option>
                <option value="newsletter">Newsletter</option>
              </select>
            </div>
          )}
        </div>

        {/* Generate Button */}
        <button
          onClick={handleGenerate}
          disabled={!topic.trim() || loading}
          className="btn-primary py-3 px-6 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              Generate {title}
            </>
          )}
        </button>
      </div>

      {/* Results */}
      {results.length > 0 && (
        <div ref={resultsRef} className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-display font-semibold text-lg text-text-primary">
              Results ({results.length})
            </h2>
            <button
              onClick={handleGenerate}
              disabled={loading}
              className="btn-ghost text-sm gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Regenerate
            </button>
          </div>

          <div className="space-y-3">
            {results.map((result, idx) => (
              <div
                key={idx}
                className="glass-card-static p-5 group animate-fade-up"
                style={{ animationDelay: `${idx * 60}ms` }}
              >
                <p className="text-text-primary text-sm leading-relaxed whitespace-pre-wrap">
                  {result.text}
                </p>

                <div className="flex items-center justify-between mt-4 pt-3 border-t border-border">
                  {result.score ? (
                    <span className="text-xs text-text-muted font-mono">
                      Score: {result.score}/10
                    </span>
                  ) : (
                    <span />
                  )}

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleFav(idx)}
                      className={`p-1.5 rounded-lg transition-colors ${
                        favIdx.has(idx)
                          ? "text-warning"
                          : "text-text-muted hover:text-warning"
                      }`}
                      aria-label="Toggle favorite"
                    >
                      <Star
                        className={`w-4 h-4 ${
                          favIdx.has(idx) ? "fill-warning" : ""
                        }`}
                      />
                    </button>
                    <button
                      onClick={() => handleCopy(result.text, idx)}
                      className="flex items-center gap-1.5 text-xs text-text-muted hover:text-accent transition-colors p-1.5 rounded-lg"
                      aria-label="Copy to clipboard"
                    >
                      {copiedIdx === idx ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-success" />
                          <span className="text-success">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          Copy
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
