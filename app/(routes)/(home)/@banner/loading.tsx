import { Skeleton } from "@/components/ui/skeleton";

export default function BannerSliderSkeleton() {
  return (
    <div className="px-4 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
        {/* Main large banner */}
        <Skeleton className="min-h-[200px] md:min-h-[320px] md:col-span-2 md:row-span-2" />

        {/* Secondary banners */}
        <Skeleton className="min-h-[120px] md:min-h-0" />
        <Skeleton className="min-h-[120px] md:min-h-0" />
      </div>
    </div>
  )
}