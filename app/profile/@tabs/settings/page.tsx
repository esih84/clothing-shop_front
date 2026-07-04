"use client"
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Bell, Moon, PawPrint, Plus, Trash2, Loader2, LogOut } from 'lucide-react'
import { usePets } from '@/features/pet/queries'
import { useCreatePet, useDeletePet } from '@/features/pet/mutations'
import { useLogout } from '@/features/auth/mutations'

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

function PetsSection() {
  const { data: pets = [], isLoading } = usePets()
  const createPet = useCreatePet()
  const deletePet = useDeletePet()
  const [name, setName] = useState("")

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    const trimmed = name.trim()
    if (!trimmed) return
    try {
      await createPet.mutateAsync({ name: trimmed })
      setName("")
    } catch {
      // خطا توسط کاربر با تلاش دوباره قابل رفع است
    }
  }

  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm border border-[#A9CBF5]/30">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 rounded-xl bg-[#FDE68A]/20 border border-[#A9CBF5]/30 flex items-center justify-center flex-shrink-0">
          <PawPrint className="w-5 h-5 text-[#1473E6]" />
        </div>
        <div className="text-right">
          <p className="font-medium text-gray-800 text-sm">حیوانات خانگی من</p>
          <p className="text-xs text-gray-500 mt-0.5">
            پت‌های شما هنگام ثبت سفارش قابل انتخاب‌اند
          </p>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-4">
          <Loader2 className="w-5 h-5 text-[#1473E6] animate-spin" />
        </div>
      ) : (
        <div className="space-y-2 mb-3">
          {pets.length === 0 && (
            <p className="text-xs text-gray-400 text-center py-2">
              هنوز پتی ثبت نکرده‌اید.
            </p>
          )}
          {pets.map((pet) => (
            <div
              key={pet.id}
              className="flex items-center justify-between rounded-xl border border-[#A9CBF5]/30 bg-[#FDE68A]/10 px-3 py-2"
            >
              <span className="flex items-center gap-2 text-sm text-gray-700">
                <PawPrint className="w-4 h-4 text-[#1473E6]" />
                {pet.name}
              </span>
              <button
                type="button"
                title="حذف پت"
                onClick={() => deletePet.mutate(pet.id)}
                disabled={deletePet.isPending}
                className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      <form onSubmit={handleAdd} className="flex gap-2">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="نام پت جدید، مثال: پوپک"
          className="flex-1 border border-[#A9CBF5]/50 px-3 py-2 text-sm focus:outline-none focus:border-[#1473E6] bg-white rounded-xl"
        />
        <button
          type="submit"
          disabled={createPet.isPending || !name.trim()}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-secondary text-secondary-foreground text-sm font-medium hover:bg-secondary/90 transition-colors disabled:opacity-60"
        >
          {createPet.isPending ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Plus className="w-4 h-4" />
          )}
          افزودن
        </button>
      </form>
    </div>
  )
}

export default function SettingsTab() {
  const router = useRouter()
  const logout = useLogout()
  const [notifications, setNotifications] = useState(true)
  const [darkMode, setDarkMode] = useState(false)

  const handleLogout = async () => {
    try {
      await logout.mutateAsync()
    } finally {
      router.push("/")
    }
  }

  return (
    <div className="space-y-3" style={{ direction: 'rtl' }}>
      <PetsSection />
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

      <button
        type="button"
        onClick={handleLogout}
        disabled={logout.isPending}
        className="w-full flex items-center justify-center gap-2 py-3 mt-2 rounded-2xl bg-white border border-red-200 text-red-600 font-medium text-sm shadow-sm hover:bg-red-50 transition-colors disabled:opacity-60"
      >
        {logout.isPending ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : (
          <LogOut className="w-5 h-5" />
        )}
        خروج از حساب
      </button>
    </div>
  )
}
