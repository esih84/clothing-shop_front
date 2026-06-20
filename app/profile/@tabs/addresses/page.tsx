import { MapPin, ChevronLeft, Plus } from 'lucide-react'

export default async function AddressesTab() {
  // const data = await getProfileData()
  // const addresses = data.addresses || []
  return (
    <div className="space-y-3" style={{ direction: 'rtl' }}>
      {/* {addresses.map((addr: any) => (
        <div
          key={addr.label}
          className="flex items-center justify-between bg-white p-4 rounded-2xl shadow-sm border border-[#A9CBF5]/30 hover:border-[#A9CBF5]/60 transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#FDE68A]/20 border border-[#A9CBF5]/30 flex items-center justify-center flex-shrink-0">
              <MapPin className="w-5 h-5 text-[#1473E6]" />
            </div>
            <div className="text-right">
              <div className="flex items-center gap-2">
                <p className="font-medium text-gray-800 text-sm">{addr.label}</p>
                {addr.isDefault && (
                  <span className="text-xs bg-[#FDE68A]/40 text-[#1473E6] px-2 py-0.5 rounded-full border border-[#A9CBF5]/30">
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
      <button className="w-full flex items-center justify-center gap-2 p-4 rounded-2xl border border-dashed border-[#A9CBF5]/60 text-[#1473E6] text-sm font-medium hover:bg-[#FDE68A]/10 transition-colors">
        <Plus className="w-4 h-4" />
        افزودن آدرس جدید
      </button>
    </div>
  )
}
