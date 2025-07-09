"use client"

import Link from "next/link"
import { usePathname, useParams } from "next/navigation"
import { Bell, ChevronLeft, MoreVertical, Search, Edit, Trash2, Filter,ArrowLeft } from "lucide-react"
import { useState,useEffect  } from "react"
import { FilterModal } from "./filter-modal"

export function DynamicHeader() {
  const pathname = usePathname()
  const params = useParams()
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false)
  const [placeholder, setPlaceholder] = useState("Search");
  useEffect(() => {
    function handleResize() {
      if (window.innerWidth < 600) {
        setPlaceholder("Search in Bungkusa"); // small screen placeholder
      } else {
        setPlaceholder("search..."); // large screen placeholder
      }
    }
    // Set initially
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  // Check if we're in the shop section
  const isShopSection = pathname.startsWith("/shop")
  const isStorePage = pathname.startsWith("/store")
  const shopId = isShopSection ? (params.shopId as string) : null
  const storeId = isStorePage ? (params.id as string) : null
  const isBlogDetail = isShopSection && pathname.includes("/blog/") && params.blogId
  const isOrderDetail = isShopSection && pathname.includes("/orders/") && params.orderId

  // Get page name for shop section
  const getShopPageName = () => {
    if (isBlogDetail) return "Blog Post"
    if (isOrderDetail) return `Order #${params.orderId}`

    if (pathname.endsWith(`/shop/${shopId}`)) return "Dashboard"
    if (pathname.includes(`/shop/${shopId}/products`)) return "Products"
    if (pathname.includes(`/shop/${shopId}/orders`)) return "Orders"
    if (pathname.includes(`/shop/${shopId}/blog`)) return "Blog"

    return "Shop"
  }

  // Shop data based on shopId
  const shopData = shopId
    ? {
        id: shopId,
        name: shopId === "store1" ? "Fashion Boutique" : shopId === "store2" ? "Urban Styles" : "Trendy Threads",
        role: shopId === "store1" ? "Manager" : shopId === "store2" ? "Employee" : "Owner",
      }
    : null

  // Store page header
  if (isStorePage) {
    return (
      <div className="sticky top-0 z-40 bg-white/90 backdrop-blur-sm border-b">
        <div className="p-4 flex items-center justify-between  mx-auto">
          <div className="flex items-center">
            <Link href="/" className="mr-3">
              <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
            </Link>
            <h1 className="text-base sm:text-lg font-bold truncate">Store Profile</h1>
          </div>
          <button className="p-1.5 sm:p-2 rounded-full bg-gray-100">
            <MoreVertical className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>
      </div>
    )
  }

  // Blog detail header
  if (isBlogDetail) {
    return (
      <div className="sticky top-0 z-40 bg-white/90 backdrop-blur-sm border-b">
        <div className="p-4 flex items-center justify-between  mx-auto">
          <div className="flex items-center">
            <Link href={`/shop/${shopId}/blog`} className="mr-3">
              <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
            </Link>
            <h1 className="text-base sm:text-lg font-bold truncate">{getShopPageName()}</h1>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => document.dispatchEvent(new CustomEvent("edit-blog"))}
              className="p-1.5 sm:p-2 rounded-full bg-gray-100"
              aria-label="Edit blog post"
            >
              <Edit className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
            <button
              onClick={() => document.dispatchEvent(new CustomEvent("delete-blog"))}
              className="p-1.5 sm:p-2 rounded-full bg-gray-100"
              aria-label="Delete blog post"
            >
              <Trash2 className="w-4 h-4 sm:w-5 sm:h-5 text-red-500" />
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Order detail header
  if (isOrderDetail) {
    return (
      <div className="sticky top-0 z-40 bg-white/90 backdrop-blur-sm border-b">
        <div className="p-4 flex items-center justify-between  mx-auto">
          <div className="flex items-center">
            <Link href={`/shop/${shopId}/orders`} className="mr-3">
              <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
            </Link>
            <h1 className="text-base sm:text-lg font-bold truncate">{getShopPageName()}</h1>
          </div>
        </div>
      </div>
    )
  }

  // Shop header
  if (isShopSection && shopData) {
    return (
      <div className="sticky top-0 z-40 bg-white/90 backdrop-blur-sm border-b">
        <div className="p-4 flex items-center justify-between  mx-auto">
          <div className="flex items-center">
            <Link href="/" className="mr-3">
              <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
            </Link>
            <div>
              <h1 className="text-base sm:text-lg font-bold truncate">{getShopPageName()}</h1>
              <p className="text-xs text-gray-500 truncate">
                {shopData.name} - You are a {shopData.role}
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Home page header
  if (pathname === "/") {
    return (
      <>
        <FilterModal isOpen={isFilterModalOpen} onClose={() => setIsFilterModalOpen(false)} />

        <div className="p-4 flex items-center flex-col md:flex-row md:justify-between max-w-full md:p-0 md:my-6 ">
          <h1 className=" hidden md:block md:text-4xl font-bold">Bungkusa</h1>
         {/*<Bell className="w-5 h-5 sm:w-6 sm:h-6" />*/}
        <div className="w-full  md:w-1/3 mx-4">
          <div className="relative ">
            <Search className="w-4 h-4 sm:w-5 sm:h-5 absolute left-3 md:left-3.5 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder={placeholder}
              className="w-10/12 md:w-full pl-10 pr-12 py-2 md:py-4 rounded-full bg-white border border-gray-200"
            />
          <button
            className="absolute right-1  md:right-4 top-1/2 transform -translate-y-1/2 p-1.5 sm:p-2 rounded-full"
            onClick={() => setIsFilterModalOpen(true)}
          >
            <Filter className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />
          </button>
          </div>
        </div>
        </div>

      </>
    )
  }

  // Product detail page header - now matches any direct ID route
  if (pathname.match(/^\/product\/[^/]+$/)) {
    return (
      <div className=" p-4 flex items-center justify-between mb-6">
        <Link href="/" className="flex items-center text-gray-600">
          <ArrowLeft className="w-5 h-5 mr-1" />
          <span>Back</span>
        </Link>
        <h1 className="text-xl md:text-3xl font-bold">Product detail</h1>
        <div className="w-16"></div> {/* Spacer for centering */}
      </div>
    )
  }

  // Wishlist page header
  if (pathname === "/wishlist") {
    return (
      <div className=" p-4 flex items-center justify-between mb-6">
        <Link href="/" className="flex items-center text-gray-600">
          <ArrowLeft className="w-5 h-5 mr-1" />
          <span>Back</span>
        </Link>
        <h1 className="text-xl md:text-3xl font-bold">wishlist</h1>
        <div className="w-16"></div> {/* Spacer for centering */}
      </div>
    )
  }

  // Cart page header
  if (pathname === "/cart") {
    return (
      <div className=" p-4 flex items-center justify-between mb-6">
        <Link href="/" className="flex items-center text-gray-600">
          <ArrowLeft className="w-5 h-5 mr-1" />
          <span>Back</span>
        </Link>
        <h1 className="text-xl md:text-3xl font-bold">My Cart</h1>
        <div className="w-16"></div> {/* Spacer for centering */}
      </div>
    )
  }

  // Profile page header
  if (pathname === "/profile") {
    return (
       <div className=" p-4 flex items-center justify-between mb-6">
        <Link href="/" className="flex items-center text-gray-600">
          <ArrowLeft className="w-5 h-5 mr-1" />
          <span>Back</span>
        </Link>
        <h1 className="text-xl md:text-3xl font-bold">Profile</h1>
        <div className="w-16"></div> {/* Spacer for centering */}
      </div>
    )
  }

  // Default header for any other routes
  return (
      <div className=" p-4 flex items-center justify-between mb-6">
        <Link href="/" className="flex items-center text-gray-600">
          <ArrowLeft className="w-5 h-5 mr-1" />
          <span>Back</span>
        </Link>
        <h1 className="text-xl md:text-3xl font-bold">Bungkusa</h1>
        <div className="w-16"></div> {/* Spacer for centering */}
      </div>
  )
}
