"use client";

import Link from "next/link";
import { usePathname, useParams } from "next/navigation";
import {
  Bell,
  ChevronRight,
  MoreVertical,
  Search,
  Edit,
  Trash2,
  Filter,
  ArrowRight,
} from "lucide-react";
import { useState, useEffect } from "react";
import { FilterModal } from "./filter-modal";

export function DynamicHeader() {
  const pathname = usePathname();
  const params = useParams();
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [placeholder, setPlaceholder] = useState("جستجو");
  useEffect(() => {
    function handleResize() {
      if (window.innerWidth < 600) {
        setPlaceholder("جستجو در بانگکوسا");
      } else {
        setPlaceholder("جستجو...");
      }
    }
    // Set initially
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  // Check if we're in the shop section
  const isShopSection = pathname.startsWith("/shop");
  const isStorePage = pathname.startsWith("/store");
  const shopId = isShopSection ? (params.shopId as string) : null;
  const storeId = isStorePage ? (params.id as string) : null;
  const isBlogDetail =
    isShopSection && pathname.includes("/blog/") && params.blogId;
  const isOrderDetail =
    isShopSection && pathname.includes("/orders/") && params.orderId;

  // Get page name for shop section
  const getShopPageName = () => {
    if (isBlogDetail) return "Blog Post";
    if (isOrderDetail) return `Order #${params.orderId}`;

    if (pathname.endsWith(`/shop/${shopId}`)) return "Dashboard";
    if (pathname.includes(`/shop/${shopId}/products`)) return "Products";
    if (pathname.includes(`/shop/${shopId}/orders`)) return "Orders";
    if (pathname.includes(`/shop/${shopId}/blog`)) return "Blog";

    return "Shop";
  };

  // Shop data based on shopId
  const shopData = shopId
    ? {
        id: shopId,
        name:
          shopId === "store1"
            ? "بوتیک مد"
            : shopId === "store2"
            ? "استایل شهری"
            : "پارچه‌های روز مد",
        role:
          shopId === "store1"
            ? "مدیر"
            : shopId === "store2"
            ? "کارمند"
            : "صاحب",
      }
    : null;

  // Store page header
  if (isStorePage) {
    return (
      <div className="sticky top-0 z-40 bg-white/90 backdrop-blur-sm border-b">
        <div className="p-4 flex items-center justify-between  mx-auto">
          <div className="flex items-center">
            <Link href="/" className="ml-3">
              <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
            </Link>
            <h1 className="text-base sm:text-lg font-bold truncate">
              پروفایل فروشگاه
            </h1>
          </div>
          <button className="p-1.5 sm:p-2 rounded-full bg-gray-100">
            <MoreVertical className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>
      </div>
    );
  }

  // Blog detail header
  if (isBlogDetail) {
    return (
      <div className="sticky top-0 z-40 bg-white/90 backdrop-blur-sm border-b">
        <div className="p-4 flex items-center justify-between  mx-auto">
          <div className="flex items-center">
            <Link href={`/shop/${shopId}/blog`} className="ml-3">
              <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
            </Link>
            <h1 className="text-base sm:text-lg font-bold truncate">
              {getShopPageName()}
            </h1>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() =>
                document.dispatchEvent(new CustomEvent("edit-blog"))
              }
              className="p-1.5 sm:p-2 rounded-full bg-gray-100"
              aria-label="Edit blog post"
            >
              <Edit className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
            <button
              onClick={() =>
                document.dispatchEvent(new CustomEvent("delete-blog"))
              }
              className="p-1.5 sm:p-2 rounded-full bg-gray-100"
              aria-label="Delete blog post"
            >
              <Trash2 className="w-4 h-4 sm:w-5 sm:h-5 text-red-500" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Order detail header
  if (isOrderDetail) {
    return (
      <div className="sticky top-0 z-40 bg-white/90 backdrop-blur-sm border-b">
        <div className="p-4 flex items-center justify-between  mx-auto">
          <div className="flex items-center">
            <Link href={`/shop/${shopId}/orders`} className="ml-3">
              <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
            </Link>
            <h1 className="text-base sm:text-lg font-bold truncate">
              {getShopPageName()}
            </h1>
          </div>
        </div>
      </div>
    );
  }

  // Shop header
  if (isShopSection && shopData) {
    return (
      <div className="sticky top-0 z-40 bg-white/90 backdrop-blur-sm border-b">
        <div className="p-4 flex items-center justify-between  mx-auto">
          <div className="flex items-center">
            <Link href="/" className="ml-3">
              <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
            </Link>
            <div>
              <h1 className="text-base sm:text-lg font-bold truncate">
                {getShopPageName()}
              </h1>
              <p className="text-xs text-gray-500 truncate">
                {shopData.name} - شما یک {shopData.role} هستید
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Home page header
  if (pathname === "/") {
    return (
      <>
        <FilterModal
          isOpen={isFilterModalOpen}
          onClose={() => setIsFilterModalOpen(false)}
        />

        <header className="sticky top-0 z-40 bg-white border-b border-[#E3A7C4]/30 shadow-sm">
          {/* Top accent line */}
          <div className="h-0.5 bg-gradient-to-l from-[#670626] via-[#E3A7C4] to-[#ffbdc5]" />

          <div className="max-w-7xl mx-auto">
            {/* Brand row */}
            <div className="px-4 md:px-6 pt-3 pb-2 flex items-center justify-between">
              {/* Logo + brand name */}
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 bg-[#670626] flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-sm font-bold leading-none">ب</span>
                </div>
                <div>
                  <h1 className="text-base md:text-xl font-bold text-[#670626] leading-none">
                    بانگکوسا
                  </h1>
                  <p className="text-[10px] text-[#E3A7C4] mt-0.5 hidden sm:block tracking-wide">
                    فروشگاه آنلاین مد
                  </p>
                </div>
              </div>

              {/* Notification bell */}
              <button className="p-2 hover:bg-[#ffbdc5]/30 transition-colors">
                <Bell className="w-5 h-5 text-[#670626]/70" />
              </button>
            </div>

            {/* Search row */}
            <div className="px-4 md:px-6 pb-3">
              <div className="relative">
                <Search className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-[#670626]/40" />
                <input
                  type="text"
                  placeholder={placeholder}
                  className="w-full pr-10 pl-12 py-2.5 bg-[#ffbdc5]/15 border border-[#E3A7C4]/50 text-right text-sm focus:outline-none focus:border-[#670626]/40 transition-colors"
                />
                <button
                  onClick={() => setIsFilterModalOpen(true)}
                  className="absolute left-1 top-1/2 -translate-y-1/2 p-1.5 bg-[#670626] text-white hover:bg-[#670626]/90 transition-colors"
                >
                  <Filter className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </header>
      </>
    );
  }

  // Product detail page header - now matches any direct ID route
  if (pathname.match(/^\/product\/[^/]+$/)) {
    return (
      <div className=" p-4 flex items-center justify-between ">
        <Link href="/" className="flex items-center text-gray-600">
          <ArrowRight className="w-5 h-5 ml-1" />
          <span>بازگشت</span>
        </Link>
        <h1 className="text-xl md:text-3xl font-bold">جزئیات محصول</h1>
        <div className="w-16"></div>
      </div>
    );
  }

  // Wishlist page header
  if (pathname === "/wishlist") {
    return (
      <div className=" p-4 flex items-center justify-between mb-6">
        <Link href="/" className="flex items-center text-gray-600">
          <ArrowRight className="w-5 h-5 ml-1" />
          <span>بازگشت</span>
        </Link>
        <h1 className="text-xl md:text-3xl font-bold">علاقه‌مندی‌ها</h1>
        <div className="w-16"></div>
      </div>
    );
  }

  // Cart page header
  if (pathname === "/cart") {
    return (
      <div className=" p-4 flex items-center justify-between mb-6">
        <Link href="/" className="flex items-center text-gray-600">
          <ArrowRight className="w-5 h-5 ml-1" />
          <span>بازگشت</span>
        </Link>
        <h1 className="text-xl md:text-3xl font-bold">سبد خرید</h1>
        <div className="w-16"></div>
      </div>
    );
  }

  // Profile page header
  if (pathname === "/profile") {
    return (
      <div className=" p-4 flex items-center justify-between mb-6">
        <Link href="/" className="flex items-center text-gray-600">
          <ArrowRight className="w-5 h-5 ml-1" />
          <span>بازگشت</span>
        </Link>
        <h1 className="text-xl md:text-3xl font-bold">پروفایل</h1>
        <div className="w-16"></div>
      </div>
    );
  }

  // Default header for any other routes
  return (
    <div className=" p-4 flex items-center justify-between mb-6">
      <Link href="/" className="flex items-center text-gray-600">
        <ArrowRight className="w-5 h-5 ml-1" />
        <span>بازگشت</span>
      </Link>
      <h1 className="text-xl md:text-3xl font-bold">بانگکوسا</h1>
      <div className="w-16"></div>
    </div>
  );
}
