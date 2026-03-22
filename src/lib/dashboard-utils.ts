/** Shared utility constants and functions used across dashboard pages */

/** Human-readable labels for content generation types */
export const typeLabel: Record<string, string> = {
  hook: "🪝 Hook",
  caption: "📝 Caption",
  cta: "🎯 CTA",
  title: "✏️ Title",
  idea: "💡 Idea",
};

/**
 * Format an ISO date string to a localized short date.
 * Example: "2025-03-22T08:09:19+05:30" → "Mar 22, 2025"
 */
export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}
