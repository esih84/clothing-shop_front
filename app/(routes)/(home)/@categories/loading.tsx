// components/category-selector-skeleton.tsx
import { Skeleton } from "@/components/ui/skeleton"

export default function CategorySelectorSkeleton() {
  return (
    <div className="py-6">
      <div className="flex items-center justify-between mb-4 px-3 sm:px-4">
        <div className="flex items-center gap-2">
          <div className="w-1 h-5 bg-[#670626]" />
          <Skeleton className="h-4 w-32" />
        </div>
        <Skeleton className="h-3 w-16" />
      </div>

      <div className="mx-3 sm:mx-4 border">
        <div className="grid grid-cols-2 sm:flex sm:gap-3 h-auto">
          {Array.from({ length: 5 }).map((_, index) => {
            const nameOnTop = index % 2 === 1
            return (
              <div key={index} className="flex flex-col sm:flex-1 border-x min-w-0">
                {nameOnTop && (
                  <div className="flex-1 flex items-center justify-center border-b p-2">
                    <Skeleton className="h-3 w-14" />
                  </div>
                )}
                <div className="relative aspect-[3/4] w-full max-w-[90%] m-2 mx-auto">
                  <Skeleton className="absolute inset-0" />
                </div>
                {!nameOnTop && (
                  <div className="flex-1 flex items-center justify-center border-t p-2">
                    <Skeleton className="h-3 w-14" />
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
