export default function LoadingOrderDetail() {
  return (
    <div
      className="max-w-5xl mx-auto p-4 lg:py-8 space-y-6 animate-pulse"
      style={{ direction: "rtl" }}
    >
      {/* عنوان */}
      <div className="flex items-center gap-2">
        <div className="w-5 h-5 bg-gray-200 rounded" />
        <div className="h-6 bg-gray-200 rounded w-40" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* ستون اصلی: محصولات سفارش */}
        <div className="lg:col-span-2 space-y-6 order-2 lg:order-1">
          <div className="bg-white rounded-lg shadow p-4 border border-[#A9CBF5]/30">
            <div className="h-5 bg-gray-200 rounded w-28 mb-4" />
            <ul className="divide-y divide-gray-100">
              {[1, 2, 3].map((i) => (
                <li key={i} className="py-3 flex gap-3">
                  <div className="w-16 h-16 rounded-lg bg-gray-200 flex-shrink-0" />
                  <div className="flex-1 min-w-0 space-y-3 py-1">
                    <div className="h-4 bg-gray-200 rounded w-3/4" />
                    <div className="flex items-center justify-between gap-3">
                      <div className="h-4 bg-gray-200 rounded w-20" />
                      <div className="h-3 bg-gray-100 rounded w-24" />
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* ستون کناری: خلاصه سفارش و آدرس */}
        <div className="lg:col-span-1 space-y-6 order-1 lg:order-2">
          {/* خلاصه سفارش */}
          <div className="bg-white rounded-lg shadow p-4 border border-[#A9CBF5]/30 space-y-3">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-gray-200 rounded flex-shrink-0" />
              <div className="space-y-2 flex-1">
                <div className="h-4 bg-gray-200 rounded w-24" />
                <div className="h-3 bg-gray-100 rounded w-32" />
              </div>
            </div>
            <div className="h-5 bg-gray-100 rounded-full w-20 mb-2" />
            <div className="flex justify-between">
              <div className="h-4 bg-gray-100 rounded w-16" />
              <div className="h-4 bg-gray-200 rounded w-20" />
            </div>
            <div className="flex justify-between">
              <div className="h-4 bg-gray-100 rounded w-16" />
              <div className="h-4 bg-gray-200 rounded w-20" />
            </div>
          </div>

          {/* آدرس تحویل */}
          <div className="bg-white rounded-lg shadow p-4 border border-[#A9CBF5]/30 space-y-3">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-4 h-4 bg-gray-200 rounded" />
              <div className="h-5 bg-gray-200 rounded w-24" />
            </div>
            <div className="h-4 bg-gray-100 rounded w-40" />
            <div className="h-4 bg-gray-100 rounded w-28" />
            <div className="h-4 bg-gray-100 rounded w-3/4" />
          </div>
        </div>
      </div>
    </div>
  );
}
