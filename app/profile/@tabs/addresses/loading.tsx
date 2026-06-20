// profile/@tabs/addresses/loading.tsx

import { MapPin } from 'lucide-react'

export default function AddressesLoading() {
  return (
    <div className="space-y-3" style={{ direction: 'rtl' }}>
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="flex items-center justify-between bg-white p-4 shadow-sm border border-[#A9CBF5]/30"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#FDE68A]/20 border border-[#A9CBF5]/30 flex-shrink-0 animate-pulse" />
            <div className="space-y-2">
              <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
              <div className="h-3 w-40 bg-gray-100 rounded animate-pulse" />
            </div>
          </div>
          <div className="w-4 h-4 bg-gray-100 rounded animate-pulse" />
        </div>
      ))}
      <div className="w-full p-4 border border-dashed border-[#A9CBF5]/60 flex items-center justify-center">
        <div className="h-4 w-32 bg-gray-100 rounded animate-pulse" />
      </div>
    </div>
  )
}
