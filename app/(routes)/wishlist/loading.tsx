import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="pb-20 pt-16 mx-auto max-w-6xl">
      <div className="px-4 mt-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
          {[...Array(4)].map((_, idx) => (
            <div
              key={idx}
              className="wishlist-item bg-white overflow-hidden shadow-sm border border-[#E3A7C4]/30"
            >
              <div className="flex p-3 sm:p-4 md:p-6 items-center">
                <Skeleton className="mr-3 sm:mr-4 md:mr-6 w-[60px] h-[60px] sm:w-[80px] sm:h-[80px] md:w-[100px] md:h-[100px] lg:w-[120px] lg:h-[120px]" />
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <Skeleton className="w-32 h-6" />
                    <Skeleton className="w-8 h-8" />
                  </div>
                  <div className="flex justify-between items-center mt-2 md:mt-4">
                    <Skeleton className="w-20 h-6" />
                    <Skeleton className="w-24 h-8" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
