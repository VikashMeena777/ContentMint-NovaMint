"use client";

import { useState, useRef, useCallback } from "react";
import type { ContentType, GenerationResult, Tone, Platform } from "@/types";

interface UseGenerateOptions {
  type: ContentType;
  showPlatform?: boolean;
  showTone?: boolean;
  showNiche?: boolean;
  showGoal?: boolean;
  showFormat?: boolean;
  showAudience?: boolean;
}

interface GeneratePayload {
  topic: string;
  platform?: Platform;
  tone?: Tone;
  niche?: string;
  goal?: string;
  audience?: string;
  format?: string;
}

export function useGenerate({ type }: UseGenerateOptions) {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<GenerationResult[]>([]);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);
  const [favIdx, setFavIdx] = useState<Set<number>>(new Set());
  const [error, setError] = useState<string | null>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  const generate = useCallback(
    async (payload: GeneratePayload) => {
      if (!payload.topic.trim()) return;
      setLoading(true);
      setResults([]);
      setError(null);

      try {
        const res = await fetch("/api/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ type, ...payload }),
        });

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
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Something went wrong";
        setError(message);
        setResults([
          {
            text: `Oops! ${message}. Please try again.`,
            score: 0,
          },
        ]);
      } finally {
        setLoading(false);
      }
    },
    [type]
  );

  const handleCopy = useCallback(async (text: string, idx: number) => {
    await navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  }, []);

  const toggleFav = useCallback(
    async (idx: number) => {
      const result = results[idx];
      if (!result?.id) {
        // Local-only toggle if no server ID yet
        setFavIdx((prev) => {
          const next = new Set(prev);
          if (next.has(idx)) next.delete(idx);
          else next.add(idx);
          return next;
        });
        return;
      }

      try {
        const res = await fetch(`/api/generations/${result.id}/favorite`, {
          method: "PATCH",
        });
        if (res.ok) {
          setFavIdx((prev) => {
            const next = new Set(prev);
            if (next.has(idx)) next.delete(idx);
            else next.add(idx);
            return next;
          });
        }
      } catch {
        // Silently fail — user can retry
      }
    },
    [results]
  );

  return {
    loading,
    results,
    copiedIdx,
    favIdx,
    error,
    resultsRef,
    generate,
    handleCopy,
    toggleFav,
  };
}
