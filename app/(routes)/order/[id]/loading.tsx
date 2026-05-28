export default function LoadingOrderDetail() {
  return (
    <div className="max-w-xl mx-auto p-4 space-y-6 animate-pulse" style={{ direction: 'rtl' }}>
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 bg-gray-200 rounded-full" />
        <div className="h-6 bg-gray-200 rounded w-32" />
      </div>
      <div className="bg-white rounded-lg shadow p-4 border border-[#E3A7C4]/30 space-y-3">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 bg-gray-200 rounded" />
          <div className="space-y-2 flex-1">
            <div className="h-4 bg-gray-200 rounded w-24" />
            <div className="h-3 bg-gray-100 rounded w-16" />
          </div>
        </div>
        <div className="h-4 bg-gray-100 rounded w-20 mb-2" />
        <div className="h-4 bg-gray-100 rounded w-28 mb-2" />
        <div className="h-4 bg-gray-100 rounded w-24 mb-2" />
      </div>
      <div className="bg-white rounded-lg shadow p-4 border border-[#E3A7C4]/30">
        <div className="h-5 bg-gray-200 rounded w-32 mb-3" />
        <ul className="space-y-2">
          {[1,2].map((i) => (
            <li key={i} className="flex items-center gap-3">
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-20" />
                <div className="h-3 bg-gray-100 rounded w-12" />
                <div className="h-3 bg-gray-100 rounded w-16" />
              </div>
              <div className="h-4 bg-gray-200 rounded w-12" />
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
