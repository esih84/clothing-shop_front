"use client";

import Link from "next/link";
import { usePathname, useParams } from "next/navigation";
import {
  ChevronRight,
  MoreVertical,
  Search,
  Edit,
  Trash2,
  Filter,
  ArrowRight,
  X,
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { FilterModal } from "./filter-modal";

// ─── Shared sub-components ───────────────────────────────────────────────────

function BackHeader({
  href,
  title,
  right,
}: {
  href: string;
  title: string;
  right?: React.ReactNode;
}) {
  return (
    <div className="sticky top-0 z-40 bg-white/90 backdrop-blur-sm border-b border-[#E3A7C4]/30">
      <div className="px-4 py-3 flex items-center justify-between max-w-7xl mx-auto">
        <Link
          href={href}
          className="flex items-center gap-1.5 text-gray-600 hover:text-[#670626] transition-colors"
        >
          <ArrowRight className="w-5 h-5" />
          <span className="text-sm font-medium">بازگشت</span>
        </Link>
        <h1 className="text-lg md:text-2xl font-bold text-gray-800">{title}</h1>
        <div className="w-16 flex justify-end">{right}</div>
      </div>
    </div>
  );
}

function ShopBackHeader({
  href,
  title,
  right,
}: {
  href: string;
  title: string;
  right?: React.ReactNode;
}) {
  return (
    <div className="sticky top-0 z-40 bg-white/90 backdrop-blur-sm border-b">
      <div className="px-4 py-3 flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <Link
            href={href}
            className="p-1.5 rounded-full hover:bg-gray-100 transition-colors"
          >
            <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
          </Link>
          <h1 className="text-base sm:text-lg font-bold truncate">{title}</h1>
        </div>
        {right && <div className="flex items-center gap-1">{right}</div>}
      </div>
    </div>
  );
}

// ─── Search bar component ─────────────────────────────────────────────────────

function SearchBar({
  isOpen,
  onClose,
  inputRef,
}: {
  isOpen: boolean;
  onClose: () => void;
  inputRef: React.RefObject<HTMLInputElement>;
}) {
  const [query, setQuery] = useState("");

  return (
    <>
      {/* Backdrop (mobile only) */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-[2px] z-30 sm:hidden"
          onClick={onClose}
        />
      )}

      {/* Search input — inline on md+, overlay on mobile */}
      <div
        className={`
          transition-all duration-300 ease-in-out overflow-hidden
          sm:flex-1 sm:block sm:opacity-100 sm:max-w-none sm:relative sm:z-auto
          ${isOpen
            ? "fixed top-0 left-0 right-0 z-50 px-4 pt-4 pb-3 bg-white shadow-lg sm:static sm:p-0 sm:shadow-none sm:bg-transparent"
            : "hidden sm:block"
          }
        `}
      >
        {/* Mobile top bar inside overlay */}
        {isOpen && (
          <div className="flex items-center justify-between mb-3 sm:hidden">
            <span className="text-sm font-semibold text-gray-700">جستجو</span>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-gray-100 transition-colors"
              aria-label="بستن جستجو"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        )}

        <div className="relative group">
          <Search className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#670626] transition-colors pointer-events-none" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="جستجو در بانگکوسا..."
            dir="rtl"
            className="
              w-full pr-10 pl-10 py-2.5
              bg-gray-50 border border-gray-200 
              text-sm text-gray-800 placeholder:text-gray-400
              focus:outline-none focus:border-[#670626]/60 focus:bg-white focus:ring-2 focus:ring-[#670626]/10
              transition-all duration-200
            "
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="absolute left-3 top-1/2 -translate-y-1/2 p-0.5 rounded-full hover:bg-gray-200 transition-colors"
              aria-label="پاک کردن جستجو"
            >
              <X className="w-3.5 h-3.5 text-gray-400" />
            </button>
          )}
        </div>

        {/* Recent searches — shown only when focused and empty (mobile overlay) */}
        {isOpen && !query && (
          <div className="mt-3 sm:hidden">
            <p className="text-xs text-gray-400 mb-2 px-1">جستجوهای اخیر</p>
            {["کفش اسپرت", "کیف چرم", "عینک آفتابی"].map((item) => (
              <button
                key={item}
                onClick={() => setQuery(item)}
                className="flex items-center gap-2 w-full px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors text-right"
              >
                <Search className="w-3.5 h-3.5 text-gray-300 flex-shrink-0" />
                <span className="text-sm text-gray-600">{item}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export function DynamicHeader() {
  const pathname = usePathname();
  const params = useParams();
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const isShopSection = pathname.startsWith("/shop");
  const isStorePage = pathname.startsWith("/store");
  const isBlogDetail =
    isShopSection && pathname.includes("/blog/") && params.blogId;
  const isOrderDetail =
    isShopSection && pathname.includes("/orders/") && params.orderId;

  const getShopPageName = () => {
    if (isBlogDetail) return "Blog Post";
    if (isOrderDetail) return `Order #${params.orderId}`;
    if (pathname.endsWith("/shop")) return "Dashboard";
    if (pathname.includes("/shop/products")) return "Products";
    if (pathname.includes("/shop/orders")) return "Orders";
    if (pathname.includes("/shop/blog")) return "Blog";
    return "Shop";
  };

  const openSearch = () => {
    setIsSearchOpen(true);
    // focus after the overlay renders
    setTimeout(() => searchInputRef.current?.focus(), 50);
  };

  // close search on route change
  useEffect(() => {
    setIsSearchOpen(false);
  }, [pathname]);

  // ── Store page ──
  if (isStorePage) {
    return (
      <ShopBackHeader
        href="/"
        title="پروفایل فروشگاه"
        right={
          <button className="p-1.5 sm:p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors">
            <MoreVertical className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        }
      />
    );
  }

  // ── Blog detail ──
  if (isBlogDetail) {
    return (
      <ShopBackHeader
        href="/shop/blog"
        title={getShopPageName()}
        right={
          <>
            <button
              onClick={() =>
                document.dispatchEvent(new CustomEvent("edit-blog"))
              }
              className="p-1.5 sm:p-2 rounded-full bg-[#670626] hover:bg-gray-200 transition-colors"
              aria-label="ویرایش پست"
            >
              <Edit className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
            <button
              onClick={() =>
                document.dispatchEvent(new CustomEvent("delete-blog"))
              }
              className="p-1.5 sm:p-2 rounded-full bg-[#670626] hover:bg-red-50 transition-colors"
              aria-label="حذف پست"
            >
              <Trash2 className="w-4 h-4 sm:w-5 sm:h-5 text-red-500" />
            </button>
          </>
        }
      />
    );
  }

  // ── Order detail ──
  if (isOrderDetail) {
    return <ShopBackHeader href="/shop/orders" title={getShopPageName()} />;
  }

  // ── Home ──
  if (pathname === "/") {
    return (
      <>
        <FilterModal
          isOpen={isFilterModalOpen}
          onClose={() => setIsFilterModalOpen(false)}
        />
        <header className="sticky top-0 z-40 bg-white shadow-sm">
          <div className="h-1 bg-gradient-to-l from-[#670626] via-[#E3A7C4] to-[#ffbdc5]" />
          <div className="mx-auto px-4 md:px-6 py-3">
            <div className="  flex flex-row items-center gap-4 justify-between">
              {/* Brand */}
              <div className="flex items-center gap-2 flex-shrink-0">
                <div className="w-9 h-9 bg-[#670626]  flex items-center justify-center shadow-sm">
                  <span className="text-white text-sm font-bold">ب</span>
                </div>
                <div className="hidden sm:block">
                  <h1 className="text-lg font-bold text-[#670626] leading-none">
                    بانگکوسا
                  </h1>
                  <p className="text-[10px] text-[#E3A7C4] mt-0.5 tracking-wide">
                    فروشگاه آنلاین مد
                  </p>
                </div>
              </div>

              {/* Search — icon on mobile, full bar on sm+ */}
              <div className="flex-1 flex items-center justify-end  gap-2">

                {/* Mobile: icon button */}
                <button
                  onClick={openSearch}
                  className="sm:hidden p-2.5  bg-gray-50 border border-gray-200 hover:bg-gray-100 hover:border-[#670626]/30 transition-all"
                  aria-label="جستجو"
                >
                  <Search className="w-4 h-4 text-gray-500" />
                </button>

                {/* sm+: inline search bar */}
                <div className="hidden max-w-xl sm:flex flex-1 items-center gap-2">
                  <SearchBar
                    isOpen={false}
                    onClose={() => {}}
                    inputRef={searchInputRef}
                  />
                </div>

                {/* Mobile overlay search */}
                <div className="sm:hidden  ">

                <SearchBar
                
                isOpen={isSearchOpen}
                onClose={() => setIsSearchOpen(false)}
                inputRef={searchInputRef}
                />
                </div>

                {/* Filter button */}
                <button
                  onClick={() => setIsFilterModalOpen(true)}
                  className="flex items-center gap-1.5 px-3 sm:px-4 py-2.5 bg-[#670626] text-white text-sm font-medium  hover:bg-[#670626]/90 active:scale-95 transition-all whitespace-nowrap flex-shrink-0 shadow-sm"
                  aria-label="فیلتر محصولات"
                >
                  <Filter className="w-4 h-4" />
                  <span className="hidden sm:inline">فیلتر</span>
                </button>

              </div>
            </div>
          </div>
        </header>
      </>
    );
  }

  // ── Named pages ──
  const namedPages: Record<string, string> = {
    "/product": "جزئیات محصول",
    "/wishlist": "علاقه‌مندی‌ها",
    "/cart": "سبد خرید",
    "/checkout": "پرداخت نهایی",
    "/profile": "پروفایل",
  };

  const matchedKey = Object.keys(namedPages).find(
    (key) => pathname === key || pathname.startsWith(key + "/")
  );

  const pageTitle = matchedKey ? namedPages[matchedKey] : "بانگکوسا";

  return <BackHeader href="/" title={pageTitle} />;
}
