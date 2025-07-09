export default function ProductLoading() {
  return (
    <div className="flex flex-col pb-24 max-w-2xl mx-auto">
      <div className="mt-16 relative">
        <div className="w-full h-[300px] xs:h-[340px] sm:h-[380px] md:h-[420px] bg-gray-200 animate-pulse rounded-b-3xl"></div>
      </div>

      <div className="flex-1 bg-white rounded-t-3xl -mt-4 p-4 sm:p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-gray-200 animate-pulse h-8 w-16 rounded-md"></div>
          <div className="h-5 w-24 bg-gray-200 animate-pulse rounded"></div>
          <div className="ml-auto h-8 w-8 bg-gray-200 animate-pulse rounded-full"></div>
        </div>

        <div className="h-8 w-3/4 bg-gray-200 animate-pulse rounded mb-2"></div>

        <div className="flex items-center mb-4">
          <div className="flex space-x-1">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="w-5 h-5 bg-gray-200 animate-pulse rounded-full"></div>
            ))}
          </div>
          <div className="ml-1 h-5 w-8 bg-gray-200 animate-pulse rounded"></div>
        </div>

        <div className="h-20 bg-gray-200 animate-pulse rounded mb-6"></div>

        <div className="h-24 bg-gray-200 animate-pulse rounded-xl mb-6"></div>

        <div className="mb-6">
          <div className="h-6 w-16 bg-gray-200 animate-pulse rounded mb-2"></div>
          <div className="flex gap-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-10 w-10 bg-gray-200 animate-pulse rounded-full"></div>
            ))}
          </div>
        </div>

        <div className="h-8 w-24 bg-gray-200 animate-pulse rounded mb-4"></div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white p-4 border-t z-40">
        <div className="max-w-2xl mx-auto">
          <div className="h-12 bg-gray-200 animate-pulse rounded-full"></div>
        </div>
      </div>
    </div>
  )
}
