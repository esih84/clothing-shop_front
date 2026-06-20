"use client"
import { useState, useEffect } from "react"

import Link from 'next/link'
import { Tabs, TabsList, TabsTrigger } from '@/shared/ui/tabs'
import { LogOut } from 'lucide-react'

export default function Layout({ children }: { children: React.ReactNode }) {


  return (
          <div className="flex flex-col lg:flex-row gap-4 items-start">
        {/* <div className="w-full lg:w-80 lg:sticky lg:top-20 space-y-4 flex-shrink-0">
          <div className="bg-white p-6 shadow-sm border border-[#A9CBF5]/30">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 bg-[#FDE68A]/40 border border-[#A9CBF5]/30 flex items-center justify-center flex-shrink-0">
                <span className="text-3xl font-bold text-[#1473E6]">{profile?.name?.[0] || "ج"}</span>
              </div>
              <div className="flex-1 min-w-0 text-right">
                <h1 className="text-xl font-bold text-gray-900 truncate">{profile?.name || "---"}</h1>
                <p className="text-sm text-gray-500 truncate mt-0.5">{profile?.email || "---"}</p>
                <span className="inline-block mt-2 text-xs bg-[#FDE68A]/40 text-[#1473E6] font-medium px-2 py-0.5 border border-[#A9CBF5]/30">
                  {profile?.membership || "---"}
                </span>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-3 divide-x divide-x-reverse divide-[#A9CBF5]/30 border border-[#A9CBF5]/30 bg-white shadow-sm">
            {(profile?.stats || [
              { label: "سفارش‌ها", value: "-" },
              { label: "امتیاز", value: "-" },
              { label: "آدرس‌ها", value: "-" },
            ]).map((stat) => (
              <div key={stat.label} className="flex flex-col items-center py-4 px-2 bg-[#FDE68A]/10">
                <span className="text-lg font-bold text-[#1473E6]">{stat.value}</span>
                <span className="text-xs text-gray-500 mt-0.5">{stat.label}</span>
              </div>
            ))}
          </div>
          <button className="w-full flex items-center justify-center gap-2 py-3 bg-white border border-[#A9CBF5]/30 text-[#1473E6] font-medium text-base shadow-sm hover:bg-[#FDE68A]/10 transition-colors">
            <LogOut className="w-5 h-5" />
            خروج از حساب
          </button>
        </div> */}
        <div className="flex-1 w-full min-w-0">
          {/* Parallel route slot for tabs */}
          {/* @profile-tabs will be rendered here by Next.js */}
          <div className="flex-1 min-w-0">    <div className="w-full">
      <Tabs defaultValue="orders" className="w-full">
        <TabsList className="grid grid-cols-3 bg-white border border-[#A9CBF5]/30 shadow-sm h-auto p-0 gap-0 w-full rounded-2xl overflow-hidden">
          <TabsTrigger asChild value="orders">
            <Link prefetch href="orders" className="flex flex-col items-center gap-1.5 py-3 text-gray-400 data-[state=active]:bg-secondary data-[state=active]:text-secondary-foreground transition-colors duration-200 border-l border-[#A9CBF5]/30">
              سفارش‌ها
            </Link>
          </TabsTrigger>
          <TabsTrigger asChild value="addresses">
            <Link prefetch href="addresses" className="flex flex-col items-center gap-1.5 py-3 text-gray-400 data-[state=active]:bg-secondary data-[state=active]:text-secondary-foreground transition-colors duration-200 border-l border-[#A9CBF5]/30">
              آدرس‌ها
            </Link>
          </TabsTrigger>
          <TabsTrigger asChild value="settings">
            <Link prefetch href="settings" className="flex flex-col items-center gap-1.5 py-3 text-gray-400 data-[state=active]:bg-secondary data-[state=active]:text-secondary-foreground transition-colors duration-200">
              تنظیمات
            </Link>
          </TabsTrigger>
        </TabsList>
      </Tabs>
      <div className="mt-4">{children}</div>
    </div></div>
        </div>
      </div>

  )
}
