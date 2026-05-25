"use client"

import { useState } from "react"
import { Package, MapPin, Settings, LogOut, ChevronLeft, Plus, Bell, Moon } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const orders = [
  { id: "۱۲۳۴۵", date: "۱۲ اردیبهشت ۱۴۰۴", status: "تحویل شده", statusColor: "bg-[#ffbdc5]/40 text-[#670626]" },
  { id: "۱۲۳۴۶", date: "۹ اردیبهشت ۱۴۰۴", status: "در حال پردازش", statusColor: "bg-amber-100 text-amber-700" },
  { id: "۱۲۳۴۷", date: "۲ اردیبهشت ۱۴۰۴", status: "لغو شده", statusColor: "bg-red-100 text-red-600" },
]

const addresses = [
  { label: "خانه", detail: "تهران، خیابان آزادی، پلاک ۱۲۳", isDefault: true },
  { label: "محل کار", detail: "تهران، خیابان ولیعصر، پلاک ۴۵۶", isDefault: false },
]

function Toggle({ enabled, onToggle }: { enabled: boolean; onToggle: () => void }) {
  return (
    <button
      onClick={onToggle}
      aria-checked={enabled}
      role="switch"
      className={`relative inline-flex w-11 h-6 transition-colors duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#670626]/40 ${
        enabled ? "bg-[#670626]" : "bg-gray-200"
      }`}
    >
      <span
        className={`absolute top-1 w-4 h-4 bg-white shadow transition-all duration-300 ${
          enabled ? "right-1" : "right-6"
        }`}
      />
    </button>
  )
}

export default function ProfilePage() {
  const [notifications, setNotifications] = useState(true)
  const [darkMode, setDarkMode] = useState(false)

  return (
    <div className="pt-16 pb-24 px-4 mx-auto max-w-6xl" dir="rtl">
      <div className="flex flex-col lg:flex-row gap-4 items-start">

        {/* ستون چپ — پروفایل و آمار */}
        <div className="w-full lg:w-80 lg:sticky lg:top-20 space-y-4 flex-shrink-0">

          {/* Profile Card */}
          <div className="bg-white p-6 shadow-sm border border-[#E3A7C4]/30">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 bg-[#ffbdc5]/40 border border-[#E3A7C4]/30 flex items-center justify-center flex-shrink-0">
                <span className="text-3xl font-bold text-[#670626]">ج</span>
              </div>
              <div className="flex-1 min-w-0 text-right">
                <h1 className="text-xl font-bold text-gray-900 truncate">جواد محمدی</h1>
                <p className="text-sm text-gray-500 truncate mt-0.5">user@email.com</p>
                <span className="inline-block mt-2 text-xs bg-[#ffbdc5]/40 text-[#670626] font-medium px-2 py-0.5 border border-[#E3A7C4]/30">
                  عضو طلایی
                </span>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 divide-x divide-x-reverse divide-[#E3A7C4]/30 border border-[#E3A7C4]/30 bg-white shadow-sm">
            {[
              { label: "سفارش‌ها", value: "۱۲" },
              { label: "امتیاز", value: "۳۴۰" },
              { label: "آدرس‌ها", value: "۲" },
            ].map((stat) => (
              <div key={stat.label} className="flex flex-col items-center py-4 px-2 bg-[#ffbdc5]/10">
                <span className="text-lg font-bold text-[#670626]">{stat.value}</span>
                <span className="text-xs text-gray-500 mt-0.5">{stat.label}</span>
              </div>
            ))}
          </div>

          {/* Logout */}
          <button className="w-full flex items-center justify-center gap-2 py-3 bg-white border border-[#E3A7C4]/30 text-[#670626] font-medium text-base shadow-sm hover:bg-[#ffbdc5]/10 transition-colors">
            <LogOut className="w-5 h-5" />
            خروج از حساب
          </button>

        </div>

        {/* ستون راست — تب‌ها */}
        <div className="flex-1 min-w-0">
          <Tabs defaultValue="orders" className="w-full">
            <TabsList className="grid grid-cols-3 bg-white border border-[#E3A7C4]/30 shadow-sm h-auto p-0 gap-0 w-full">
              {[
                { value: "orders", icon: Package, label: "سفارش‌ها" },
                { value: "addresses", icon: MapPin, label: "آدرس‌ها" },
                { value: "settings", icon: Settings, label: "تنظیمات" },
              ].map(({ value, icon: Icon, label }, i) => (
                <TabsTrigger
                  key={value}
                  value={value}
                  className={`flex flex-col items-center gap-1.5 py-3 text-gray-400
                    data-[state=active]:bg-[#670626] data-[state=active]:text-white
                    transition-colors duration-200
                    ${i < 2 ? "border-l border-[#E3A7C4]/30" : ""}`}
                >
                  <Icon className="h-4 w-4" />
                  <span className="text-xs font-medium">{label}</span>
                </TabsTrigger>
              ))}
            </TabsList>

            {/* Orders */}
            <TabsContent value="orders" className="mt-4 space-y-3">
              {orders.map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between bg-white p-4 shadow-sm border border-[#E3A7C4]/30 hover:border-[#E3A7C4]/60 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#ffbdc5]/20 border border-[#E3A7C4]/30 flex items-center justify-center flex-shrink-0">
                      <Package className="w-5 h-5 text-[#670626]" />
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-800 text-sm">سفارش #{order.id}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{order.date}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-medium px-2 py-0.5 ${order.statusColor}`}>
                      {order.status}
                    </span>
                    <ChevronLeft className="w-4 h-4 text-gray-300" />
                  </div>
                </div>
              ))}
            </TabsContent>

            {/* Addresses */}
            <TabsContent value="addresses" className="mt-4 space-y-3">
              {addresses.map((addr) => (
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
              ))}

              <button className="w-full flex items-center justify-center gap-2 p-4 border border-dashed border-[#E3A7C4]/60 text-[#670626] text-sm font-medium hover:bg-[#ffbdc5]/10 transition-colors">
                <Plus className="w-4 h-4" />
                افزودن آدرس جدید
              </button>
            </TabsContent>

            {/* Settings */}
            <TabsContent value="settings" className="mt-4 space-y-3">
              {[
                {
                  icon: Bell,
                  label: "اعلان‌ها",
                  desc: "دریافت پیام‌های سیستم",
                  enabled: notifications,
                  toggle: () => setNotifications((p) => !p),
                },
                {
                  icon: Moon,
                  label: "حالت تیره",
                  desc: "تغییر ظاهر برنامه",
                  enabled: darkMode,
                  toggle: () => setDarkMode((p) => !p),
                },
              ].map((item) => (
                <div
                  key={item.label}
                  className="flex items-center justify-between bg-white p-4 shadow-sm border border-[#E3A7C4]/30"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#ffbdc5]/20 border border-[#E3A7C4]/30 flex items-center justify-center flex-shrink-0">
                      <item.icon className="w-5 h-5 text-[#670626]" />
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-800 text-sm">{item.label}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{item.desc}</p>
                    </div>
                  </div>
                  <Toggle enabled={item.enabled} onToggle={item.toggle} />
                </div>
              ))}
            </TabsContent>
          </Tabs>
        </div>

      </div>
    </div>
  )
}
