export function ReelsSkeleton() {
  return (
    <div className="fixed inset-0 animate-pulse bg-black">
      <div className="h-full w-full bg-neutral-900" />
      <div className="absolute bottom-28 left-4 space-y-2">
        <div className="h-4 w-48 rounded bg-neutral-700" />
        <div className="h-3 w-32 rounded bg-neutral-700" />
      </div>
      <div className="absolute bottom-28 right-4 space-y-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-10 w-10 rounded-full bg-neutral-700" />
        ))}
      </div>
    </div>
  );
}
