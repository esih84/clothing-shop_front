"use client"

import Link from 'next/link'
import { Tabs, TabsList, TabsTrigger } from '@/shared/ui/tabs'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full" dir="rtl">
      <Tabs defaultValue="orders" className="w-full">
        <TabsList className="grid grid-cols-4 bg-card border border-border shadow-sm h-auto p-0 gap-0 w-full rounded-2xl overflow-hidden">
          <TabsTrigger asChild value="orders">
            <Link prefetch href="orders" className="flex flex-col items-center gap-1.5 py-3 text-muted-foreground data-[state=active]:bg-secondary data-[state=active]:text-secondary-foreground transition-colors duration-200 border-l border-border">
              سفارش‌ها
            </Link>
          </TabsTrigger>
          <TabsTrigger asChild value="addresses">
            <Link prefetch href="addresses" className="flex flex-col items-center gap-1.5 py-3 text-muted-foreground data-[state=active]:bg-secondary data-[state=active]:text-secondary-foreground transition-colors duration-200 border-l border-border">
              آدرس‌ها
            </Link>
          </TabsTrigger>
          <TabsTrigger asChild value="pets">
            <Link prefetch href="pets" className="flex flex-col items-center gap-1.5 py-3 text-muted-foreground data-[state=active]:bg-secondary data-[state=active]:text-secondary-foreground transition-colors duration-200 border-l border-border">
              پت‌ها
            </Link>
          </TabsTrigger>
          <TabsTrigger asChild value="settings">
            <Link prefetch href="settings" className="flex flex-col items-center gap-1.5 py-3 text-muted-foreground data-[state=active]:bg-secondary data-[state=active]:text-secondary-foreground transition-colors duration-200">
              تنظیمات
            </Link>
          </TabsTrigger>
        </TabsList>
      </Tabs>
      <div className="mt-4">{children}</div>
    </div>
  )
}
