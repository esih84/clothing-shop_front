"use client"
import { useState } from 'react'
import { Bell, Moon } from 'lucide-react'

function Toggle({ enabled, onToggle }: { enabled: boolean; onToggle: () => void }) {
  return (
    <button
      onClick={onToggle}
      aria-checked={enabled}
      role="switch"
      className={`relative inline-flex w-11 h-6 rounded-full transition-colors duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1473E6]/40 ${
        enabled ? "bg-secondary" : "bg-gray-200"
      }`}
    >
      <span
        className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all duration-300 ${
          enabled ? "right-1" : "right-6"
        }`}
      />
    </button>
  )
}

export default function SettingsTab() {
  const [notifications, setNotifications] = useState(true)
  const [darkMode, setDarkMode] = useState(false)
  return (
    <div className="space-y-3" style={{ direction: 'rtl' }}>
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
          className="flex items-center justify-between bg-white rounded-2xl p-4 shadow-sm border border-[#A9CBF5]/30"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#FDE68A]/20 border border-[#A9CBF5]/30 flex items-center justify-center flex-shrink-0">
              <item.icon className="w-5 h-5 text-[#1473E6]" />
            </div>
            <div className="text-right">
              <p className="font-medium text-gray-800 text-sm">{item.label}</p>
              <p className="text-xs text-gray-500 mt-0.5">{item.desc}</p>
            </div>
          </div>
          <Toggle enabled={item.enabled} onToggle={item.toggle} />
        </div>
      ))}
    </div>
  )
}
