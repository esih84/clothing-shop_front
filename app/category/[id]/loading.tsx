import { ProductCardSkeleton } from "@/components/product-card";

export default function Loading() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-8 flex items-center gap-2">
        <div className="h-6 w-20 bg-[#ffbdc5]/50 animate-pulse rounded" />
        <span className="text-gray-400">/</span>
        <div className="h-6 w-24 bg-[#ffbdc5]/50 animate-pulse rounded" />
      </div>
      <div className="h-8 w-40 bg-[#ffbdc5]/50 animate-pulse rounded mb-6" />
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5">
        {[...Array(8)].map((_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
