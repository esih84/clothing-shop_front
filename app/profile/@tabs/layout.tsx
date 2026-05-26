import Link from 'next/link'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full">
      <Tabs defaultValue="orders" className="w-full">
        <TabsList className="grid grid-cols-3 bg-white border border-[#E3A7C4]/30 shadow-sm h-auto p-0 gap-0 w-full">
          <TabsTrigger asChild value="orders">
            <Link href="orders" className="flex flex-col items-center gap-1.5 py-3 text-gray-400 data-[state=active]:bg-[#670626] data-[state=active]:text-white transition-colors duration-200 border-l border-[#E3A7C4]/30">
              سفارش‌ها
            </Link>
          </TabsTrigger>
          <TabsTrigger asChild value="addresses">
            <Link href="addresses" className="flex flex-col items-center gap-1.5 py-3 text-gray-400 data-[state=active]:bg-[#670626] data-[state=active]:text-white transition-colors duration-200 border-l border-[#E3A7C4]/30">
              آدرس‌ها
            </Link>
          </TabsTrigger>
          <TabsTrigger asChild value="settings">
            <Link href="settings" className="flex flex-col items-center gap-1.5 py-3 text-gray-400 data-[state=active]:bg-[#670626] data-[state=active]:text-white transition-colors duration-200">
              تنظیمات
            </Link>
          </TabsTrigger>
        </TabsList>
      </Tabs>
      <div className="mt-4">{children}</div>
    </div>
  )
}
