import { Skeleton } from "@/shared/ui/skeleton";

/** Placeholder rows shown while the first page of reviews loads. */
export function ReviewListSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="rounded-2xl border border-border bg-card p-4 sm:p-5"
        >
          <div className="flex items-start gap-3">
            <Skeleton className="w-10 h-10 rounded-full shrink-0" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-3.5 w-32" />
              <Skeleton className="h-3 w-24" />
            </div>
          </div>
          <div className="mt-4 space-y-2">
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-4/5" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function ReviewSummarySkeleton() {
  return (
    <div className="flex flex-col sm:flex-row gap-6 sm:gap-8 rounded-2xl border border-border bg-primary/10 p-5">
      <div className="flex sm:flex-col items-center gap-3 sm:w-40 sm:shrink-0">
        <Skeleton className="h-10 w-16" />
        <Skeleton className="h-4 w-24" />
      </div>
      <div className="flex-1 space-y-2.5">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-2.5 w-full" />
        ))}
      </div>
    </div>
  );
}
