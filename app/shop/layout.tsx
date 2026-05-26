"use client"

import type React from "react"
import Link from "next/link"
export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen bg-luxury-gradient animate-fadeIn">
      {/* Shop Header - Desktop */}
      <div className="hidden md:flex items-center justify-between p-6 border-b">
        <div className="flex items-center gap-4">
          <Link
            href={"/shop/"}
            className="text-black hover:text-gray-700 transition-colors"
          >
            Dashboard
          </Link>
          <Link
            href={`/shop/products`}
            className="text-black hover:text-gray-700 transition-colors"
          >
            Products
          </Link>
          <Link
            href={`/shop/orders`}
            className="text-black hover:text-gray-700 transition-colors"
          >
            Orders
          </Link>
          <Link
            href={`/shop/blog`}
            className="text-black hover:text-gray-700 transition-colors"
          >
            Blog
          </Link>
          <Link
            href={`/shop/settings`}
            className="text-black hover:text-gray-700 transition-colors"
          >
            Settings
          </Link>
        </div>
      </div>

      <div className="flex-1 p-4 md:p-6">{children}</div>
    </div>
  )
}
