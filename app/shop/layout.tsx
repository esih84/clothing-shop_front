"use client"

import type React from "react"

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="pb-20">
      {/* Shop content - header is now handled by DynamicHeader */}
      {children}
    </div>
  )
}
