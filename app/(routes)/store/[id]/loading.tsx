export default function StoreLoading() {
  return (
    <div className="min-h-screen bg-[#fff5f7]">
      {/* Cover skeleton */}
      <div className="h-52 md:h-72 bg-[#ffbdc5]/40 animate-pulse" />

      {/* Stats bar skeleton */}
      <div className="bg-white border-b border-[#E3A7C4]/40">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-stretch divide-x divide-[#E3A7C4]/30">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex-1 py-3 flex flex-col items-center gap-1.5">
                <div className="h-5 w-10 bg-[#ffbdc5]/50 animate-pulse" />
                <div className="h-3 w-14 bg-[#ffbdc5]/30 animate-pulse" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs + product grid skeleton */}
      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Tab bar */}
        <div className="flex gap-6 border-b border-[#E3A7C4]/40 mb-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-8 w-20 bg-[#ffbdc5]/40 animate-pulse" />
          ))}
        </div>

        {/* Product grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i}>
              <div className="aspect-square bg-[#ffbdc5]/40 animate-pulse mb-3" />
              <div className="space-y-2">
                <div className="h-3.5 bg-[#ffbdc5]/30 animate-pulse w-4/5" />
                <div className="h-3.5 bg-[#ffbdc5]/30 animate-pulse w-1/3" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

