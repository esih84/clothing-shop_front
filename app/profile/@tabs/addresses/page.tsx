import { MapPin, ChevronLeft, Plus } from 'lucide-react'

export default async function AddressesTab() {
  // const data = await getProfileData()
  // const addresses = data.addresses || []
  return (
    <div className="space-y-3" style={{ direction: 'rtl' }}>
      {/* {addresses.map((addr: any) => (
        <div
          key={addr.label}
          className="flex items-center justify-between bg-white p-4 shadow-sm border border-[#E3A7C4]/30 hover:border-[#E3A7C4]/60 transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#ffbdc5]/20 border border-[#E3A7C4]/30 flex items-center justify-center flex-shrink-0">
              <MapPin className="w-5 h-5 text-[#670626]" />
            </div>
            <div className="text-right">
              <div className="flex items-center gap-2">
                <p className="font-medium text-gray-800 text-sm">{addr.label}</p>
                {addr.isDefault && (
                  <span className="text-xs bg-[#ffbdc5]/40 text-[#670626] px-2 py-0.5 border border-[#E3A7C4]/30">
                    پیش‌فرض
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-500 mt-0.5">{addr.detail}</p>
            </div>
          </div>
          <ChevronLeft className="w-4 h-4 text-gray-300" />
        </div>
      ))} */}
      <button className="w-full flex items-center justify-center gap-2 p-4 border border-dashed border-[#E3A7C4]/60 text-[#670626] text-sm font-medium hover:bg-[#ffbdc5]/10 transition-colors">
        <Plus className="w-4 h-4" />
        افزودن آدرس جدید
      </button>
    </div>
  )
}
