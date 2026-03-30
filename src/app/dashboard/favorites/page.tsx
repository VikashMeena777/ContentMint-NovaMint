"use client";

import {
  Star,
  Copy,
  Check,
  Loader2,
  Trash2,
  Download,
  ChevronDown,
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import type { Generation } from "@/types";

export default function FavoritesPage() {
  const [generations, setGenerations] = useState<Generation[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showExport, setShowExport] = useState(false);
  const [exporting, setExporting] = useState(false);
  const exportRef = useRef<HTMLDivElement>(null);

  const fetchFavorites = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/generations?favorites=true&limit=50");
      const data = await res.json();
      setGenerations(data.generations || []);
    } catch {
      console.error("Failed to fetch favorites");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, []);

  const removeFavorite = async (id: string) => {
    const res = await fetch(`/api/generations/${id}/favorite`, { method: "PATCH" });
    if (!res.ok) {
      console.error("Failed to remove favorite");
      return;
    }
    setGenerations((prev) => prev.filter((g) => g.id !== id));
  };

  const copyText = async (text: string, id: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  const typeLabel: Record<string, string> = {
    hook: "🪝 Hook",
    caption: "💬 Caption",
    cta: "🎯 CTA",
    title: "📰 Title",
    idea: "💡 Idea",
  };

  const handleExport = async (format: "csv" | "txt") => {
    setExporting(true);
    setShowExport(false);
    try {
      const res = await fetch(`/api/export?format=${format}&scope=favorites`);
      if (res.status === 403) {
        alert("Export is available on Pro and Business plans. Upgrade to unlock!");
        return;
      }
      if (!res.ok) throw new Error("Export failed");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `contentmint-favorites.${format}`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      console.error("Export failed");
    } finally {
      setExporting(false);
    }
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (exportRef.current && !exportRef.current.contains(e.target as Node)) {
        setShowExport(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-warning/10 flex items-center justify-center">
            <Star className="w-5 h-5 text-warning" />
          </div>
          <div>
            <h1 className="font-display font-bold text-2xl text-text-primary">
              Favorites
            </h1>
            <p className="text-text-secondary text-sm">
              Your saved content, quickly accessible.
            </p>
          </div>
        </div>

        {/* Export dropdown */}
        <div className="relative" ref={exportRef}>
          <button
            onClick={() => setShowExport(!showExport)}
            disabled={exporting}
            className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium bg-elevated hover:bg-hover border border-border transition-colors text-text-secondary"
          >
            {exporting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Download className="w-4 h-4" />
            )}
            Export
            <ChevronDown className="w-3 h-3" />
          </button>
          {showExport && (
            <div className="absolute right-0 mt-2 w-36 bg-elevated border border-border rounded-xl shadow-lg z-10 overflow-hidden">
              <button
                onClick={() => handleExport("csv")}
                className="w-full text-left px-4 py-2.5 text-sm text-text-primary hover:bg-hover transition-colors"
              >
                Download CSV
              </button>
              <button
                onClick={() => handleExport("txt")}
                className="w-full text-left px-4 py-2.5 text-sm text-text-primary hover:bg-hover transition-colors"
              >
                Download TXT
              </button>
            </div>
          )}
        </div>
      </div>

      {loading ? (
        <div className="glass-card-static p-12 text-center">
          <Loader2 className="w-8 h-8 text-warning mx-auto mb-3 animate-spin" />
          <p className="text-sm text-text-muted">Loading favorites...</p>
        </div>
      ) : generations.length === 0 ? (
        <div className="glass-card-static p-12 text-center">
          <Star className="w-12 h-12 text-text-muted mx-auto mb-4" />
          <h3 className="font-display font-semibold text-text-primary mb-2">
            No favorites yet
          </h3>
          <p className="text-sm text-text-secondary max-w-sm mx-auto">
            Click the star icon on any generated content to save it here for
            quick access.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {generations.map((gen) => (
            <div key={gen.id} className="glass-card-static p-5 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-text-primary">
                    {typeLabel[gen.type] || gen.type}
                  </span>
                  {gen.viral_score && (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-accent/10 text-accent font-medium">
                      Score: {gen.viral_score}
                    </span>
                  )}
                </div>
                <button
                  onClick={() => removeFavorite(gen.id)}
                  className="p-1.5 rounded-lg hover:bg-hover transition-colors text-warning"
                  title="Remove from favorites"
                >
                  <Star className="w-4 h-4 fill-warning" />
                </button>
              </div>

              <p className="text-xs text-text-muted">
                Topic: {gen.input?.topic}
              </p>

              <div className="space-y-2">
                {gen.output?.results?.map((result, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-3 p-3 bg-elevated rounded-xl group"
                  >
                    <p className="flex-1 text-sm text-text-primary leading-relaxed">
                      {result.text}
                    </p>
                    <button
                      onClick={() => copyText(result.text, `${gen.id}-${idx}`)}
                      className="p-1.5 rounded-lg text-text-muted opacity-0 group-hover:opacity-100 hover:bg-hover transition-all shrink-0"
                    >
                      {copiedId === `${gen.id}-${idx}` ? (
                        <Check className="w-4 h-4 text-success" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
