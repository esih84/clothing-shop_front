export default function OffersLoading() {
  return (
    <div className="px-4 mb-6">
      <div className="flex justify-between items-center mb-2">
        <div className="h-7 w-32 bg-gray-200 animate-pulse rounded"></div>
        <div className="h-5 w-16 bg-gray-200 animate-pulse rounded"></div>
      </div>

      <div className="flex space-x-3 overflow-x-auto py-2">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="min-w-[160px] sm:min-w-[180px] flex-shrink-0">
            <div className="h-[140px] xs:h-[160px] sm:h-[180px] bg-gray-200 animate-pulse rounded-xl"></div>
            <div className="p-2">
              <div className="h-5 w-16 bg-gray-200 animate-pulse rounded mt-2"></div>
              <div className="h-4 w-24 bg-gray-200 animate-pulse rounded mt-2"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
