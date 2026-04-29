import { Skeleton } from "./ui/skeleton";

function SkillSkeleton() {
  return (
    <div className="w-full max-w-7xl mx-auto px-6 py-20 space-y-8 animate-pulse">

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div className="space-y-2">
          <Skeleton className="h-8 w-40" />
          <Skeleton className="h-4 w-60" />
        </div>

        <Skeleton className="h-10 w-32 rounded-md" />
      </div>

      {/* GRID */}
      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">

        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="p-5 rounded-xl border space-y-4"
          >
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-24" />

            <div className="flex gap-2 pt-2">
              <Skeleton className="h-8 w-16" />
              <Skeleton className="h-8 w-16" />
            </div>
          </div>
        ))}

      </div>

    </div>
  );
}

export default SkillSkeleton;