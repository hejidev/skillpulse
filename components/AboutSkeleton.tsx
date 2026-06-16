// components/AboutSkeleton.tsx

import { Skeleton } from "@/components/ui/skeleton";

export default function AboutSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-20 space-y-16 animate-pulse">

      {/* Hero */}
      <div className="space-y-6">
        <Skeleton className="h-6 w-60 rounded-full" />
        <Skeleton className="h-14 w-3/4" />
        <Skeleton className="h-6 w-2/3" />

        <Skeleton className="h-150 w-full rounded-[32px]" />

        <div className="grid sm:grid-cols-3 gap-4">
          <Skeleton className="h-30 rounded-2xl" />
          <Skeleton className="h-30 rounded-2xl" />
          <Skeleton className="h-30 rounded-2xl" />
        </div>
      </div>

      {/* Story */}
      <div className="grid lg:grid-cols-2 gap-8">
        <div className="space-y-4">
          <Skeleton className="h-8 w-56" />

          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton
              key={i}
              className="h-4 w-full"
            />
          ))}
        </div>

        <div className="space-y-4">
          <Skeleton className="h-16 w-16 rounded-full" />
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-4 w-28" />

          <Skeleton className="h-40 w-full rounded-2xl" />
        </div>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton
            key={i}
            className="h-32 rounded-2xl"
          />
        ))}
      </div>

      {/* Team */}
      <div className="grid md:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="border rounded-2xl p-5 space-y-4"
          >
            <Skeleton className="h-14 w-14 rounded-full" />
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
          </div>
        ))}
      </div>

    </div>
  );
}