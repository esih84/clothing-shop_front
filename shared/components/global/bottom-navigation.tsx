"use client"

import Link from "next/link"
import { Home, Heart, ShoppingCart, User } from "lucide-react"
import { usePathname, useRouter } from "next/navigation"
import { useCart } from "@/features/cart/queries"

export function BottomNavigation() {
  const pathname = usePathname()
  const router = useRouter()
  const { count: cartItemCount } = useCart()

  // Hide navigation on product detail pages (direct ID routes)
  if (pathname.match(/^\/product\/[^/]+$/)) {
    return null
  }

  const isActive = (path: string) => {
    if (path === "/" && pathname === "/") return true
    if (path !== "/" && pathname.startsWith(path)) return true
    return false
  }

  return (
    <div className="fixed bottom-4 left-0 right-0 z-40">
      <div className="max-w-md mx-auto px-4">
        <div className="bg-secondary rounded-full shadow-lg">
          <div className="flex justify-around items-center p-2">
            <Link
              href="/"
              className={`flex items-center p-2 rounded-full transition-colors ${
                isActive("/")
                  ? "bg-white text-secondary"
                  : "text-secondary-foreground"
              }`}
            >
              <Home className="w-5 h-5" />
            </Link>

            <Link
              href="/wishlist"
              onMouseEnter={() => router.prefetch("/wishlist")}
              onTouchStart={() => router.prefetch("/wishlist")}
              className={`flex items-center p-2 rounded-full transition-colors ${
                isActive("/wishlist")
                  ? "bg-white text-secondary"
                  : "text-secondary-foreground"
              }`}
            >
              <Heart className="w-5 h-5" />
            </Link>

            <Link
              href="/cart"
              onMouseEnter={() => router.prefetch("/cart")}
              onTouchStart={() => router.prefetch("/cart")}
              className={`flex items-center p-2 rounded-full transition-colors relative ${
                isActive("/cart")
                  ? "bg-white text-secondary"
                  : "text-secondary-foreground"
              }`}
            >
              <ShoppingCart className="w-5 h-5" />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs w-4 h-4 flex items-center justify-center rounded-full font-bold">
                  {cartItemCount}
                </span>
              )}
            </Link>

            <button
              onMouseEnter={() => router.prefetch("/profile")}
              onTouchStart={() => router.prefetch("/profile")}
              className={`flex items-center p-2 rounded-full transition-colors ${
                isActive("/profile")
                  ? "bg-white text-secondary"
                  : "text-secondary-foreground"
              }`}
              onClick={() => router.push("/profile")}
            >
              <User className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
