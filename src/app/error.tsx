"use client";

import { AlertTriangle, RotateCcw, Home } from "lucide-react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen bg-bg-primary flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        {/* Icon */}
        <div className="w-16 h-16 rounded-2xl bg-red-500/10 flex items-center justify-center mx-auto mb-6">
          <AlertTriangle className="w-8 h-8 text-red-400" />
        </div>

        <h2 className="text-2xl font-semibold text-text-primary mb-3">
          Something went wrong
        </h2>

        <p className="text-text-secondary mb-8">
          {error.message || "An unexpected error occurred. Please try again."}
        </p>

        {/* Actions */}
        <div className="flex items-center justify-center gap-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-border-subtle text-text-secondary hover:text-text-primary hover:border-border-default transition-colors"
          >
            <Home className="w-4 h-4" />
            Home
          </Link>
          <button
            onClick={reset}
            className="btn-primary text-sm py-2.5 px-5"
          >
            <RotateCcw className="w-4 h-4" />
            Try Again
          </button>
        </div>
      </div>
    </div>
  );
}
