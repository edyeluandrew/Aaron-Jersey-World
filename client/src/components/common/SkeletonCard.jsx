export default function SkeletonCard() {
  return (
    <div className="animate-pulse overflow-hidden rounded-card border border-border-light bg-white">
      <div className="aspect-square bg-surface-light" />
      <div className="space-y-3 p-4">
        <div className="h-4 w-1/3 rounded bg-surface-light" />
        <div className="h-5 w-3/4 rounded bg-surface-light" />
        <div className="h-4 w-1/2 rounded bg-surface-light" />
      </div>
    </div>
  );
}

export function SkeletonGrid({ count = 4 }) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: count }).map((_, index) => (
        <SkeletonCard key={index} />
      ))}
    </div>
  );
}
