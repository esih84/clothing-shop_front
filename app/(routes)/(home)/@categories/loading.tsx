export default function CategoriesLoading() {
  return (
    <div className="px-4 py-4 mb-2">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-1 h-5 bg-[#ffbdc5] animate-pulse" />
        <div className="h-5 w-24 bg-[#ffbdc5]/50 animate-pulse" />
      </div>
      <div className="flex gap-2">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            className="h-9 bg-[#ffbdc5]/40 animate-pulse flex-shrink-0"
            style={{ width: `${60 + (i % 3) * 20}px` }}
          />
        ))}
      </div>
    </div>
  )
}
