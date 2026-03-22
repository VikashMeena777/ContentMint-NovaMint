export default function DashboardLoading() {
  return (
    <div className="p-6 md:p-8 space-y-6 animate-pulse">
      {/* Header skeleton */}
      <div className="space-y-2">
        <div className="h-8 w-48 bg-surface-card rounded-lg" />
        <div className="h-4 w-72 bg-surface-card rounded" />
      </div>

      {/* Stats grid skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="h-28 bg-surface-card rounded-2xl border border-border-subtle"
          />
        ))}
      </div>

      {/* Cards grid skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="h-40 bg-surface-card rounded-2xl border border-border-subtle"
          />
        ))}
      </div>
    </div>
  );
}
