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
import { ProfileModal } from "./profile-modal"
import { useAppSelector } from "@/lib/store/hooks"

export function BottomNavigation() {
  const pathname = usePathname()
  const router = useRouter()
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false)
  const longPressTimer = useRef<NodeJS.Timeout | null>(null)
  const cartItems = useAppSelector((state) => state.cart.items)

  // Hide navigation on product detail pages (direct ID routes)
  if (pathname.match(/^\/product\/[^/]+$/)) {
    return null
  }

  // Check if we're in the shop section
  const isShopSection = pathname.startsWith("/shop")
  const shopId = isShopSection ? pathname.split("/")[2] : null

  const isActive = (path: string) => {
    if (path === "/" && pathname === "/") return true
    if (path !== "/" && pathname.startsWith(path)) return true
    return false
  }

  const handleProfileMouseDown = () => {
    longPressTimer.current = setTimeout(() => {
      setIsProfileModalOpen(true)
    }, 500) // 500ms long press
  }

  const handleProfileMouseUp = () => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current)
      longPressTimer.current = null
    }
  }

  const handleProfileClick = () => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current)
      longPressTimer.current = null
    }
    if (!isProfileModalOpen) {
      router.push("/profile")
    }
  }

  const handleTouchStart = () => {
    longPressTimer.current = setTimeout(() => {
      setIsProfileModalOpen(true)
    }, 500)
  }

  const handleTouchEnd = () => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current)
      longPressTimer.current = null
    }
  }

  const cartItemCount = cartItems.reduce((total, item) => total + item.quantity, 0)

  // Render shop-specific navigation when in shop routes
  if (isShopSection && shopId) {
    return (
      <div className="fixed bottom-4 left-0 right-0 z-40 sm:hidden">
        <div className="max-w-md mx-auto px-4">
          <div className="bg-black rounded-full shadow-lg">
            <div className="flex justify-around items-center p-2">
              <Link
                href={`/shop/${shopId}`}
                className={`flex items-center p-2 rounded-full ${
                  pathname === `/shop/${shopId}` ? "bg-white text-black" : "text-white"
                }`}
              >
                <LayoutDashboard className="w-5 h-5" />
              </Link>

              <Link
                href={`/shop/${shopId}/products`}
                className={`flex items-center p-2 rounded-full ${
                  pathname.includes(`/shop/${shopId}/products`) ? "bg-white text-black" : "text-white"
                }`}
              >
                <Package className="w-5 h-5" />
              </Link>

              <Link
                href={`/shop/${shopId}/orders`}
                className={`flex items-center p-2 rounded-full ${
                  pathname.includes(`/shop/${shopId}/orders`) ? "bg-white text-black" : "text-white"
                }`}
              >
                <ShoppingBag className="w-5 h-5" />
              </Link>

              <Link
                href={`/shop/${shopId}/blog`}
                className={`flex items-center p-2 rounded-full ${
                  pathname.includes(`/shop/${shopId}/blog`) ? "bg-white text-black" : "text-white"
                }`}
              >
                <FileText className="w-5 h-5" />
              </Link>

              <Link
                href={`/shop/${shopId}/settings`}
                className={`flex items-center p-2 rounded-full ${
                  pathname.includes(`/shop/${shopId}/settings`) ? "bg-white text-black" : "text-white"
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
          <div className="bg-black rounded-full shadow-lg">
            <div className="flex justify-around items-center p-2">
              <Link
                href="/"
                className={`flex items-center p-2 rounded-full ${isActive("/") ? "bg-white text-black" : "text-white"}`}
              >
                <Home className="w-5 h-5" />
              </Link>

              <Link
                href="/wishlist"
                className={`flex items-center p-2 rounded-full ${
                  isActive("/wishlist") ? "bg-white text-black" : "text-white"
                }`}
              >
                <Heart className="w-5 h-5" />
              </Link>

              <Link
                href="/cart"
                className={`flex items-center p-2 rounded-full ${
                  isActive("/cart") ? "bg-white text-black" : "text-white"
                } relative`}
              >
                <ShoppingCart className="w-5 h-5" />
                {cartItemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">
                    {cartItemCount}
                  </span>
                )}
              </Link>

              <button
                className={`flex items-center p-2 rounded-full ${
                  isActive("/profile") ? "bg-white text-black" : "text-white"
                }`}
                onClick={handleProfileClick}
                onMouseDown={handleProfileMouseDown}
                onMouseUp={handleProfileMouseUp}
                onMouseLeave={handleProfileMouseUp}
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
              >
                <User className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <ProfileModal isOpen={isProfileModalOpen} onClose={() => setIsProfileModalOpen(false)} />
    </>
  )
}
