export default function ProductsLoading() {
  return (
    <div className="px-4 max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-2">
        <div className="h-7 w-24 bg-muted animate-pulse rounded"></div>
        <div className="h-5 w-16 bg-muted animate-pulse rounded"></div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <div key={i} className="bg-muted animate-pulse rounded-xl h-[200px]"></div>
        ))}
      </div>
    </div>
  )
}
