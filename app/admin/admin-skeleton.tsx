import { Skeleton } from "@/components/ui/skeleton";

export function AdminPageSkeleton() {
  return (
    <div className="space-y-8 animate-pulse">

      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="space-y-3">
          <Skeleton className="h-12 w-80 rounded-xl" />
          <Skeleton className="h-4 w-96 rounded-lg" />
        </div>

        <Skeleton className="h-10 w-52 rounded-xl" />
      </div>

      {/* KPI Cards */}
      <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="rounded-3xl border p-6 space-y-4"
          >
            <Skeleton className="h-8 w-8 rounded-lg" />
            <Skeleton className="h-12 w-28" />
            <Skeleton className="h-4 w-24" />
          </div>
        ))}
      </div>

      {/* Metrics */}
      <div className="grid lg:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="rounded-3xl border p-5 space-y-4"
          >
            <Skeleton className="h-6 w-6" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-10 w-20" />
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="rounded-3xl border p-6"
          >
            <Skeleton className="h-6 w-40 mb-6" />
            <Skeleton className="h-72 w-full rounded-2xl" />
          </div>
        ))}
      </div>

      {/* Bottom */}
      <div className="grid lg:grid-cols-2 gap-6">
        {Array.from({ length: 2 }).map((_, i) => (
          <div
            key={i}
            className="rounded-3xl border p-6 space-y-4"
          >
            <Skeleton className="h-6 w-48" />

            {Array.from({ length: 5 }).map((_, idx) => (
              <Skeleton
                key={idx}
                className="h-12 w-full rounded-xl"
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}