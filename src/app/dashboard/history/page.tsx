"use client";

import {
  History as HistoryIcon,
  Clock,
  Trash2,
  Star,
  Copy,
  Check,
  Loader2,
} from "lucide-react";
import { useState, useEffect } from "react";
import type { Generation } from "@/types";

export default function HistoryPage() {
  const [generations, setGenerations] = useState<Generation[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/generations?limit=50");
      const data = await res.json();
      setGenerations(data.generations || []);
    } catch {
      console.error("Failed to fetch history");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleDelete = async (id: string) => {
    const res = await fetch(`/api/generations?id=${id}`, { method: "DELETE" });
    if (!res.ok) {
      console.error("Failed to delete generation");
      return;
    }
    setGenerations((prev) => prev.filter((g) => g.id !== id));
  };

  const toggleFavorite = async (id: string) => {
    const res = await fetch(`/api/generations/${id}/favorite`, {
      method: "PATCH",
    });
    if (!res.ok) {
      console.error("Failed to toggle favorite");
      return;
    }
    const data = await res.json();
    setGenerations((prev) =>
      prev.map((g) =>
        g.id === id ? { ...g, is_favorite: data.is_favorite } : g
      )
    );
  };

  const copyText = async (text: string, id: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const typeLabel: Record<string, string> = {
    hook: "🪝 Hook",
    caption: "💬 Caption",
    cta: "🎯 CTA",
    title: "📰 Title",
    idea: "💡 Idea",
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
          <HistoryIcon className="w-5 h-5 text-accent" />
        </div>
        <div>
          <h1 className="font-display font-bold text-2xl text-text-primary">
            History
          </h1>
          <p className="text-text-secondary text-sm">
            Browse all your past generations.
          </p>
        </div>
      </div>

      {loading ? (
        <div className="glass-card-static p-12 text-center">
          <Loader2 className="w-8 h-8 text-accent mx-auto mb-3 animate-spin" />
          <p className="text-sm text-text-muted">Loading history...</p>
        </div>
      ) : generations.length === 0 ? (
        <div className="glass-card-static p-12 text-center">
          <Clock className="w-12 h-12 text-text-muted mx-auto mb-4" />
          <h3 className="font-display font-semibold text-text-primary mb-2">
            No history yet
          </h3>
          <p className="text-sm text-text-secondary max-w-sm mx-auto">
            Your generated content will appear here. Start by using any
            generator to create your first piece of content.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {generations.map((gen) => (
            <div key={gen.id} className="glass-card-static p-5 space-y-3">
              {/* Header */}
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
                  {gen.input?.platform && (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-spark/10 text-spark capitalize">
                      {gen.input.platform}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-text-muted">
                    {formatDate(gen.created_at)}
                  </span>
                  <button
                    onClick={() => toggleFavorite(gen.id)}
                    className="p-1.5 rounded-lg hover:bg-hover transition-colors"
                    title={gen.is_favorite ? "Remove favorite" : "Add favorite"}
                  >
                    <Star
                      className={`w-4 h-4 ${
                        gen.is_favorite
                          ? "text-warning fill-warning"
                          : "text-text-muted"
                      }`}
                    />
                  </button>
                  <button
                    onClick={() => handleDelete(gen.id)}
                    className="p-1.5 rounded-lg hover:bg-hover hover:text-error transition-colors text-text-muted"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Topic */}
              <p className="text-xs text-text-muted">
                Topic: {gen.input?.topic}
              </p>

              {/* Results */}
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
