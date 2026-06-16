// components/PageSkeleton.tsx

import { Skeleton } from "@/components/ui/skeleton";

export default function PageSkeleton() {
  return (
    <div className="w-full max-w-7xl mx-auto px-6 py-12 space-y-12 animate-pulse">

      {/* Hero */}
      <div className="space-y-6">
        <Skeleton className="h-10 w-72" />
        <Skeleton className="h-5 w-full max-w-2xl" />
        <Skeleton className="h-5 w-full max-w-xl" />

        <Skeleton className="h-[450px] w-full rounded-3xl" />
      </div>

      {/* Cards */}
      <div className="grid md:grid-cols-3 gap-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="space-y-4 rounded-2xl border p-5"
          >
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-4/5" />
          </div>
        ))}
      </div>

      {/* Content Section */}
      <div className="grid lg:grid-cols-2 gap-8">
        <div className="space-y-4">
          <Skeleton className="h-8 w-48" />

          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton
              key={i}
              className="h-4 w-full"
            />
          ))}
        </div>

        <Skeleton className="h-[300px] rounded-3xl" />
      </div>

      {/* Team/Testimonial */}
      <div className="grid md:grid-cols-3 gap-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="space-y-4 rounded-2xl border p-5"
          >
            <Skeleton className="h-14 w-14 rounded-full" />
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-4 w-24" />

            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="rounded-3xl border p-10 space-y-4">
        <Skeleton className="h-10 w-80 mx-auto" />
        <Skeleton className="h-4 w-full max-w-xl mx-auto" />

        <div className="flex justify-center gap-4 mt-6">
          <Skeleton className="h-12 w-40" />
          <Skeleton className="h-12 w-40" />
        </div>
      </div>

    </div>
  );
}