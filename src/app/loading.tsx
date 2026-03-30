/* eslint-disable @next/next/no-img-element */

export default function Loading() {
  return (
    <div className="min-h-screen bg-bg-primary flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center animate-pulse">
          <img src="/ContentMint Logo.jpg" alt="Loading" className="w-10 h-10 rounded-lg" />
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-accent animate-bounce [animation-delay:0ms]" />
          <div className="w-2 h-2 rounded-full bg-accent animate-bounce [animation-delay:150ms]" />
          <div className="w-2 h-2 rounded-full bg-accent animate-bounce [animation-delay:300ms]" />
        </div>
        <p className="text-text-secondary text-sm">Loading…</p>
      </div>
    </div>
  );
}
