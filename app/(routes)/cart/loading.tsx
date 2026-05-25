import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="pt-16 pb-24 px-4 mx-auto max-w-6xl">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {[...Array(2)].map((_, idx) => (
            <div
              key={idx}
              className="cart-item bg-white p-4 md:p-6 flex items-center gap-4 shadow-sm border border-[#E3A7C4]/30"
            >
              <Skeleton className="cart-item-image w-24 h-24 md:w-32 md:h-32 lg:w-36 lg:h-36" />
              <div className="flex-1">
                <div className="flex justify-between">
                  <Skeleton className="w-32 h-6" />
                  <Skeleton className="w-8 h-8" />
                </div>
                <div className="flex flex-wrap gap-x-4 mt-1">
                  <Skeleton className="w-16 h-4" />
                  <Skeleton className="w-16 h-4" />
                </div>
                <div className="flex justify-between items-center mt-3">
                  <Skeleton className="w-20 h-6" />
                  <div className="flex items-center border border-[#E3A7C4]/50 overflow-hidden">
                    <Skeleton className="w-10 h-10" />
                    <Skeleton className="w-10 h-10" />
                    <Skeleton className="w-10 h-10" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="bg-white p-6 shadow-sm border border-[#E3A7C4]/30 h-fit">
          <Skeleton className="w-32 h-8 mb-4" />
          <div className="space-y-3 mb-6">
            <div className="flex justify-between">
              <Skeleton className="w-20 h-6" />
              <Skeleton className="w-16 h-6" />
            </div>
            <div className="flex justify-between">
              <Skeleton className="w-20 h-6" />
              <Skeleton className="w-16 h-6" />
            </div>
            <div className="flex justify-between">
              <Skeleton className="w-20 h-6" />
              <Skeleton className="w-16 h-6" />
            </div>
            <div className="border-t pt-3 mt-3">
              <div className="flex justify-between">
                <Skeleton className="w-20 h-8" />
                <Skeleton className="w-20 h-8" />
              </div>
            </div>
          </div>
          <Skeleton className="w-full h-12" />
        </div>
      </div>
    </div>
  );
}
