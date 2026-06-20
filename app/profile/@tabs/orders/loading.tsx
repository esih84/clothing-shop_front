// profile/@tabs/orders/loading.tsx

import { Package } from 'lucide-react'

export default function OrdersLoading() {
  return (
    <div className="space-y-3" style={{ direction: 'rtl' }}>
      {[1, 2, 3, 4].map((i) => (
        <div
          key={i}
          className="flex items-center justify-between bg-white p-4 shadow-sm border border-[#A9CBF5]/30"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#FDE68A]/20 border border-[#A9CBF5]/30 flex items-center justify-center flex-shrink-0 animate-pulse">
              <Package className="w-5 h-5 text-[#A9CBF5]/40" />
            </div>
            <div className="space-y-2 text-right">
              <div className="h-4 w-28 bg-gray-200 rounded animate-pulse" />
              <div className="h-3 w-20 bg-gray-100 rounded animate-pulse" />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-5 w-16 bg-gray-100 rounded animate-pulse" />
            <div className="w-4 h-4 bg-gray-100 rounded animate-pulse" />
          </div>
        </div>
      ))}
    </div>
  )
}
