import type React from "react"
import Link from "next/link"
import { ChevronLeft } from "lucide-react"

export default function ShopLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: { shopId: string }
}) {
  return (
    <div className="flex flex-col min-h-screen bg-luxury-gradient animate-fadeIn">
      {/* Shop Header - Desktop */}
      <div className="hidden md:flex items-center justify-between p-6 border-b">
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center text-black hover:text-gray-700 transition-colors">
            
            
          </Link>
          <h1 className="font-serif text-2xl font-medium">Shop Dashboard</h>
          <Link href={`/shop/${params.shopId}`} className="text-black hover:text-gray-700 transition-colors">
            Dashboard
          </Link>
          <Link href={`/shop/${params.shopId}/products`} className="text-black hover:text-gray-700 transition-colors">
            Products
          </Link>
          <Link href={`/shop/${params.shopId}/orders`} className="text-black hover:text-gray-700 transition-colors">
            Orders
          </Link>
          <Link href={`/shop/${params.shopId}/blog`} className="text-black hover:text-gray-700 transition-colors">
            Blog
          </Link>
          <Link href={`/shop/${params.shopId}/settings`} className="text-black hover:text-gray-700 transition-colors">
            Settings
          </Link>
        </div>
      </div>

      {/* Mobile Header */}
      <div className="md:hidden flex items-center p-4 border-b">
        <Link href="/" className="flex items-center text-black hover:text-gray-700 transition-colors">
          <ChevronLeft className="w-5 h-5 mr-1" />
          <span>Back</span>
        </Link>
        <h1 className="font-serif text-xl font-  </div>

 tent */}
      <div className="flex-1 p-4 md:p-6">{children}</div>
    </div>
  )
