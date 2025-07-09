export default function StoreLoading() {
  return (
    <div className="pb-20 max-w-2xl mx-auto">
      {/* Store Cover Image */}
      <div className="h-40 sm:h-48 md:h-56 w-full bg-gray-200 animate-pulse"></div>

      {/* Store Profile */}
      <div className="bg-white -mt-10 mx-4 rounded-xl shadow-md relative z-10">
        <div className="p-4 sm:p-6">
          <div className="flex items-start">
            <div className="w-20 h-20 rounded-xl -mt-12 border-4 border-white bg-gray-200 animate-pulse"></div>
            <div className="ml-4 mt-2 flex-1">
              <div className="h-8 w-40 bg-gray-200 animate-pulse rounded"></div>
              <div className="h-5 w-32 bg-gray-200 animate-pulse rounded mt-1"></div>
            </div>
            <div className="h-10 w-20 bg-gray-200 animate-pulse rounded-full"></div>
          </div>

          <div className="h-16 bg-gray-200 animate-pulse rounded mt-4"></div>

          <div className="flex flex-wrap gap-2 mt-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-6 w-20 bg-gray-200 animate-pulse rounded-full"></div>
            ))}
          </div>

          <div className="grid grid-cols-3 gap-4 mt-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-20 bg-gray-200 animate-pulse rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>

      {/* Store Products */}
      <div className="mt-6 px-4">
        <div className="h-7 w-24 bg-gray-200 animate-pulse rounded mb-4"></div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-48 bg-gray-200 animate-pulse rounded-xl"></div>
          ))}
        </div>
      </div>
    </div>
  )
}
