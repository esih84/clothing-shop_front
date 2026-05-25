import { Skeleton } from "@/components/ui/skeleton";

export  default function ProductDetailsSkeleton() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Main two-column section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
          {/* LEFT: Image gallery */}
          <div>
            {/* Main image */}
            <div className="relative aspect-square overflow-hidden bg-[#ffbdc5]/20 border border-[#E3A7C4]/30 mb-3">
              <Skeleton className="absolute inset-0 h-full w-full rounded-none" />
              <div className="absolute top-0 left-0 z-10 p-0">
                <Skeleton className="h-7 w-20 rounded-none" />
              </div>
            </div>

            {/* Thumbnail strip */}
            <div className="flex gap-2 overflow-x-auto pb-1">
              {[...Array(4)].map((_, idx) => (
                <Skeleton
                  key={idx}
                  className="flex-shrink-0 w-16 h-16 md:w-20 md:h-20 rounded-none border-2 border-[#E3A7C4]/30"
                />
              ))}
            </div>
          </div>

          {/* RIGHT: Product info */}
          <div className="space-y-5">
            {/* Brand */}
            <div className="flex items-center gap-2">
              <Skeleton className="h-6 w-20 rounded-none" />
              <Skeleton className="h-4 w-16" />
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
              <span className="text-gray-300">|</span>
              <Skeleton className="h-4 w-16" />
              <span className="text-gray-300">|</span>
              <Skeleton className="h-4 w-16" />
            </div>

            {/* Price */}
            <div className="flex items-center gap-3 pb-4 border-b border-[#E3A7C4]/30">
              <Skeleton className="h-9 w-28" />
              <Skeleton className="h-6 w-20" />
            </div>

            {/* Color selector */}
            <div>
              <Skeleton className="h-4 w-28 mb-2" />
              <div className="flex gap-2 flex-wrap">
                {[...Array(4)].map((_, i) => (
                  <Skeleton key={i} className="w-8 h-8 rounded-full" />
                ))}
              </div>
            </div>

            {/* Size selector */}
            <div>
              <Skeleton className="h-4 w-14 mb-2" />
              <div className="flex flex-wrap gap-2">
                {[...Array(4)].map((_, i) => (
                  <Skeleton key={i} className="h-10 w-14 rounded-none" />
                ))}
              </div>
            </div>

            {/* CTA buttons - similar to default page state */}
            <div className="space-y-3 pt-1">
              <div className="flex gap-3">
                <Skeleton className="h-12 flex-1 rounded-none" />
                <Skeleton className="h-12 flex-1 rounded-none" />
              </div>
            </div>

            {/* Features strip */}
            <div className="grid grid-cols-3 gap-2 py-4 border-t border-b border-[#E3A7C4]/30">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className={`flex flex-col items-center text-center gap-1.5 p-2 ${
                    i === 1 ? "border-x border-[#E3A7C4]/30" : ""
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
        <div className="mb-12 border border-[#E3A7C4]/30">
          <div className="flex border-b border-[#E3A7C4]/30 overflow-x-auto px-0">
            {[...Array(3)].map((_, i) => (
              <Skeleton
                key={i}
                className="h-11 w-32 flex-shrink-0 rounded-none mx-0"
              />
            ))}
          </div>

          <div className="p-6">
            <div className="space-y-4">
              <Skeleton className="h-5 w-full" />
              <Skeleton className="h-5 w-11/12" />
              <Skeleton className="h-5 w-9/12" />

              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 pt-2">
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className="bg-[#ffbdc5]/15 border border-[#E3A7C4]/30 p-3 space-y-2"
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
              <div key={i} className="space-y-3">
                <Skeleton className="aspect-[3/4] w-full" />
                <Skeleton className="h-4 w-5/6" />
                <Skeleton className="h-4 w-2/3" />
                <Skeleton className="h-5 w-1/3" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
