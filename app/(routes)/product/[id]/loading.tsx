import { Skeleton } from "@/shared/ui/skeleton";

export default function ProductDetailsSkeleton() {
  return (
    <div className="min-h-screen bg-card">
      <div className="max-w-6xl mx-auto px-4 pt-6 pb-28 lg:pb-6">
        {/* Main two-column section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
          {/* LEFT: Image gallery */}
          <div>
            {/* Main image */}
            <div className="relative aspect-square overflow-hidden border border-border mb-3 rounded-2xl">
              <Skeleton className="absolute inset-0 h-full w-full rounded-2xl" />
              <div className="absolute top-0 left-0 z-10">
                <Skeleton className="h-7 w-20 rounded-tl-2xl rounded-br-2xl" />
              </div>
            </div>
          </div>

          {/* RIGHT: Product info */}
          <div className="space-y-5">
            {/* Category / Brand badges */}
            <div className="flex flex-wrap items-center gap-2">
              <Skeleton className="h-6 w-24 rounded-full" />
              <Skeleton className="h-6 w-28 rounded-full" />
            </div>

            {/* Title */}
            <div className="space-y-2">
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-8 w-1/2 md:hidden" />
            </div>

            {/* Rating row */}
            <div className="flex items-center flex-wrap gap-2">
              <div className="flex items-center gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="w-4 h-4 rounded-sm" />
                ))}
              </div>
              <Skeleton className="h-4 w-8" />
              <span className="text-muted-foreground">|</span>
              <Skeleton className="h-4 w-16" />
            </div>

            {/* Price (hidden on mobile — shown in the sticky bottom bar instead) */}
            <div className="hidden lg:flex items-center gap-3 pb-4 border-b border-border">
              <Skeleton className="h-9 w-28" />
              <Skeleton className="h-6 w-20" />
            </div>

            {/* Stock status */}
            <Skeleton className="h-4 w-32" />

            {/* Add to cart (hidden on mobile — sticky bar instead) */}
            <div className="hidden lg:block space-y-3 pt-1">
              <Skeleton className="h-12 w-full rounded-2xl" />
            </div>

            {/* Features strip */}
            <div className="grid grid-cols-3 gap-2 py-4 border-t border-b border-border">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className={`flex flex-col items-center text-center gap-1.5 p-2 ${
                    i === 1 ? "border-x border-border" : ""
                  }`}
                >
                  <Skeleton className="w-5 h-5 rounded-sm" />
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-3 w-12" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Info tabs */}
        <div className="mb-12 border border-border rounded-2xl overflow-hidden">
          <div className="flex border-b border-border overflow-x-auto">
            <div className="px-6 py-3">
              <Skeleton className="h-5 w-24" />
            </div>
          </div>

          <div className="p-6">
            <div className="space-y-4">
              <Skeleton className="h-5 w-full" />
              <Skeleton className="h-5 w-11/12" />
              <Skeleton className="h-5 w-9/12" />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className="bg-primary/15 border border-border p-3 rounded-xl space-y-2"
                  >
                    <Skeleton className="h-3 w-16" />
                    <Skeleton className="h-4 w-20" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Related products */}
        <div className="pb-8">
          <Skeleton className="h-8 w-44 mb-6" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i}>
                <Skeleton className="aspect-square w-full rounded-2xl mb-3" />
                <Skeleton className="h-4 w-5/6 mb-2" />
                <Skeleton className="h-4 w-1/3" />
              </div>
            ))}
          </div>

          <div className="flex justify-center mt-8">
            <Skeleton className="h-12 w-52 rounded-2xl" />
          </div>
        </div>
      </div>

      {/* Mobile sticky add-to-cart bar (price right, add-to-cart left) */}
      <div className="lg:hidden fixed inset-x-0 bottom-0 z-40 flex items-center gap-3 border-t border-border bg-card px-4 py-3 pb-[calc(env(safe-area-inset-bottom)+0.75rem)] shadow-[0_-2px_10px_rgba(0,0,0,0.06)]">
        {/* Add to cart (left in RTL) */}
        <div className="flex flex-1 justify-start">
          <Skeleton className="h-12 w-full max-w-[240px] rounded-2xl" />
        </div>
        {/* Price (right in RTL) */}
        <div className="flex shrink-0 flex-col gap-1">
          <Skeleton className="h-3 w-14" />
          <Skeleton className="h-6 w-24" />
        </div>
      </div>
    </div>
  );
}
