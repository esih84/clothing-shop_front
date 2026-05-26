"use client"

import Link from "next/link"
import { useState, useRef } from "react"
import {
  Home,
  Heart,
  ShoppingCart,
  User,
  Package,
  FileText,
  LayoutDashboard,
  ShoppingBag,
  Settings,
} from "lucide-react"
import { usePathname, useRouter } from "next/navigation"
import { useAppSelector } from "@/lib/store/hooks"

export function BottomNavigation() {
  const pathname = usePathname()
  const router = useRouter()
  const cartItems = useAppSelector((state) => state.cart.items)




  // Hide navigation on product detail pages (direct ID routes)
  if (pathname.match(/^\/product\/[^/]+$/)) {
    return null
  }

const prefetch = (href: string) => router.prefetch(href)
  // Check if we're in the shop section
  const isShopSection = pathname.startsWith("/shop")

  const isActive = (path: string) => {
    if (path === "/" && pathname === "/") return true
    if (path !== "/" && pathname.startsWith(path)) return true
    return false
  }




  const handleProfileClick = () => {

      router.push("/profile")
    
  }




  const cartItemCount = cartItems.reduce((total, item) => total + item.quantity, 0)

  // Render shop-specific navigation when in shop routes
  if (isShopSection ) {
    return (
      <div className="fixed bottom-4 left-0 right-0 z-40 sm:hidden">
        <div className="max-w-md mx-auto px-4">
          <div className="bg-[#670626] rounded-full shadow-lg">
            <div className="flex justify-around items-center p-2">
              <Link
                href={`/shop`}
                className={`flex items-center p-2 rounded-full ${
                  pathname === `/shop` ? "bg-white text-[#670626]" : "text-white"
                }`}
              >
                <LayoutDashboard className="w-5 h-5" />
              </Link>

              <Link
                href={`/shop/products`}
                className={`flex items-center p-2 rounded-full ${
                  pathname.includes(`/shop/products`) ? "bg-white text-[#670626]" : "text-white"
                }`}
              >
                <Package className="w-5 h-5" />
              </Link>

              <Link
                href={`/shop/orders`}
                className={`flex items-center p-2 rounded-full ${
                  pathname.includes(`/shop/orders`) ? "bg-white text-[#670626]" : "text-white"
                }`}
              >
                <ShoppingBag className="w-5 h-5" />
              </Link>

              <Link
                href={`/shop/blog`}
                className={`flex items-center p-2 rounded-full ${
                  pathname.includes(`/shop/blog`) ? "bg-white text-[#670626]" : "text-white"
                }`}
              >
                <FileText className="w-5 h-5" />
              </Link>

              <Link
                href={`/shop/settings`}
                className={`flex items-center p-2 rounded-full ${
                  pathname.includes(`/shop/settings`) ? "bg-white text-[#670626]" : "text-white"
                }`}
              >
                <Settings className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Regular navigation for non-shop routes
  return (
    <>
      <div className="fixed bottom-4 left-0 right-0 z-40">
        <div className="max-w-md mx-auto px-4">
          <div className="bg-[#670626] rounded-full shadow-lg">
            <div className="flex justify-around items-center p-2">
              <Link
                href="/"
                className={`flex items-center p-2 rounded-full ${isActive("/") ? "bg-white text-[#670626]" : "text-white"}`}
              >
                <Home className="w-5 h-5" />
              </Link>

              <Link
                href="/wishlist"
                  onMouseEnter={() => router.prefetch("/wishlist")}
                  onTouchStart={() => router.prefetch("/wishlist")}
                className={`flex items-center p-2 rounded-full ${
                  isActive("/wishlist") ? "bg-white text-[#670626]" : "text-white"
                }`}
              >
                <Heart className="w-5 h-5" />
              </Link>

              <Link
                href="/cart"
                  onMouseEnter={() => router.prefetch("/cart")}
                  onTouchStart={() => router.prefetch("/cart")}
                className={`flex items-center p-2 rounded-full ${
                  isActive("/cart") ? "bg-white text-[#670626]" : "text-white"
                } relative`}
              >
                <ShoppingCart className="w-5 h-5" />
                {cartItemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-[#ffbdc5] text-[#670626] text-xs w-4 h-4 flex items-center justify-center rounded-full font-bold">
                    {cartItemCount}
                  </span>
                )}
              </Link>

              <button
                onMouseEnter={() => router.prefetch("/profile")}
                onTouchStart={() => router.prefetch("/profile")}
                className={`flex items-center p-2 rounded-full ${
                  isActive("/profile") ? "bg-white text-[#670626]" : "text-white"
                }`}
                onClick={handleProfileClick}

              >
                <User className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

    </>
  )
}
