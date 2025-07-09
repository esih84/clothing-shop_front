export default function CommentsLoading() {
  return (
    <div className="p-4 space-y-6 max-w-2xl mx-auto">
      <div className="flex items-center mb-4">
        <div className="w-5 h-5 bg-gray-200 animate-pulse rounded mr-3"></div>
        <div className="h-6 w-40 bg-gray-200 animate-pulse rounded"></div>
      </div>

      <div className="flex gap-2 mb-4">
        <div className="flex-1 h-10 bg-gray-200 animate-pulse rounded-full"></div>
        <div className="w-10 h-10 bg-gray-200 animate-pulse rounded-full"></div>
      </div>

      <div className="flex space-x-2 overflow-x-auto pb-2">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="w-24 h-10 bg-gray-200 animate-pulse rounded-full flex-shrink-0"></div>
        ))}
      </div>

      <div className="flex space-x-2 overflow-x-auto pb-2">
        {[1, 2, 3].map((i) => (
          <div key={i} className="w-24 h-10 bg-gray-200 animate-pulse rounded-full flex-shrink-0"></div>
        ))}
      </div>

      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-gray-200 animate-pulse rounded-xl h-40"></div>
        ))}
      </div>
    </div>
  )
}
