export function HomeSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="h-16 bg-slate-200" />
      <div className="mx-4 mt-4 h-48 rounded-[2rem] bg-gradient-to-r from-slate-200 to-slate-300" />
      <div className="mx-4 mt-6 grid grid-cols-4 gap-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-24 rounded-2xl bg-slate-200" />
        ))}
      </div>
      <div className="mx-4 mt-6 h-6 w-48 rounded bg-slate-200" />
      <div className="mx-4 mt-4 grid gap-4 sm:grid-cols-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="overflow-hidden rounded-[1.75rem] bg-slate-200">
            <div className="aspect-[4/3] bg-gradient-to-br from-slate-300 to-slate-200" />
            <div className="space-y-3 p-5">
              <div className="h-3 w-20 rounded bg-slate-200" />
              <div className="h-5 w-32 rounded bg-slate-200" />
              <div className="h-4 w-40 rounded bg-slate-200" />
              <div className="h-11 w-full rounded-2xl bg-slate-200" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
