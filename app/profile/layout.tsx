"use client"
import { useState, useEffect } from "react"

import { getProfileData, Profile } from "@/lib/profile"
import { LogOut } from "lucide-react"


export default function ProfileLayout({
  tabs,
}: {
  children: React.ReactNode
  tabs: React.ReactNode
}) {

  const [profile, setProfile] = useState<Profile | null>(null)
  useEffect(() => {
    getProfileData().then((data) => {
      setProfile(data.profile)
    })
  }, [])

  return (
    <div className="pt-16 pb-24 px-4 mx-auto max-w-6xl" dir="rtl">
      <div className="flex flex-col lg:flex-row gap-4 items-start">
        {/* ستون چپ — پروفایل و آمار */}
        <div className="w-full lg:w-80 lg:sticky lg:top-20 space-y-4 flex-shrink-0">
          {/* Profile Card */}
          <div className="bg-white p-6 shadow-sm border border-[#E3A7C4]/30">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 bg-[#ffbdc5]/40 border border-[#E3A7C4]/30 flex items-center justify-center flex-shrink-0">
                <span className="text-3xl font-bold text-[#670626]">{profile?.name?.[0] || "ج"}</span>
              </div>
              <div className="flex-1 min-w-0 text-right">
                <h1 className="text-xl font-bold text-gray-900 truncate">{profile?.name || "---"}</h1>
                <p className="text-sm text-gray-500 truncate mt-0.5">{profile?.email || "---"}</p>
                <span className="inline-block mt-2 text-xs bg-[#ffbdc5]/40 text-[#670626] font-medium px-2 py-0.5 border border-[#E3A7C4]/30">
                  {profile?.membership || "---"}
                </span>
              </div>
            </div>
          </div>
          {/* Stats */}
          <div className="grid grid-cols-3 divide-x divide-x-reverse divide-[#E3A7C4]/30 border border-[#E3A7C4]/30 bg-white shadow-sm">
            {(profile?.stats || [
              { label: "سفارش‌ها", value: "-" },
              { label: "امتیاز", value: "-" },
              { label: "آدرس‌ها", value: "-" },
            ]).map((stat) => (
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
        <div className="flex-1 w-full min-w-0">
          {/* Parallel route slot for tabs */}
          {/* @profile-tabs will be rendered here by Next.js */}
          <div className="flex-1 min-w-0">{tabs}</div>
        </div>
      </div>
    </div>
  )
}
