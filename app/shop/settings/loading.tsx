export default function SettingsLoading() {
  return (
    <div className="p-4 space-y-6 max-w-2xl mx-auto">
      <div className="bg-white p-4 rounded-xl shadow-sm">
        <div className="h-6 w-32 bg-gray-200 animate-pulse rounded mb-4"></div>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gray-200 animate-pulse rounded-full mr-3"></div>
              <div>
                <div className="h-4 w-24 bg-gray-200 animate-pulse rounded mb-1"></div>
                <div className="h-3 w-32 bg-gray-200 animate-pulse rounded"></div>
              </div>
            </div>
            <div className="h-5 w-16 bg-gray-200 animate-pulse rounded-full"></div>
          </div>

          <div className="h-px bg-gray-200 my-3"></div>

          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex items-center justify-between py-2">
              <div className="flex items-center">
                <div className="w-5 h-5 bg-gray-200 animate-pulse rounded"></div>
                <div className="ml-3 h-4 w-32 bg-gray-200 animate-pulse rounded"></div>
              </div>
              <div className="h-5 w-10 bg-gray-200 animate-pulse rounded"></div>
            </div>
          ))}

          {/* Expandable sections loading state */}
          {[1, 2].map((i) => (
            <div key={`section-${i}`} className="border rounded-lg overflow-hidden">
              <div className="flex items-center justify-between py-2 px-3">
                <div className="flex items-center">
                  <div className="w-5 h-5 bg-gray-200 animate-pulse rounded"></div>
                  <div className="ml-3 h-4 w-40 bg-gray-200 animate-pulse rounded"></div>
                </div>
                <div className="w-5 h-5 bg-gray-200 animate-pulse rounded"></div>
              </div>
            </div>
          ))}

          {[1, 2].map((i) => (
            <div key={`item-${i}`} className="flex items-center justify-between py-2">
              <div className="flex items-center">
                <div className="w-5 h-5 bg-gray-200 animate-pulse rounded"></div>
                <div className="ml-3 h-4 w-32 bg-gray-200 animate-pulse rounded"></div>
              </div>
              <div className="h-5 w-10 bg-gray-200 animate-pulse rounded"></div>
            </div>
          ))}
        </div>
      </div>

      <div className="h-12 w-full bg-gray-200 animate-pulse rounded-xl"></div>
    </div>
  )
}
