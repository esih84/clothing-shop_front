"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { Search, Filter, ArrowRight } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { FilterModal } from "./filter-modal";
import { SearchBox } from "./search-box";
import { useSiteSettings } from "@/shared/config/site-settings-provider";

// ─── Shared sub-components ───────────────────────────────────────────────────

function BackHeader({
  fallbackHref = "/",
  title,
  right,
}: {
  fallbackHref?: string;
  title: string;
  right?: React.ReactNode;
}) {
  const router = useRouter();

  const goBack = () => {
    // Navigate to the previous page when there is history within the app,
    // otherwise fall back to a sensible default (home).
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
    } else {
      router.push(fallbackHref);
    }
  };

  return (
    <div className="sticky top-0 z-40 bg-card/90 backdrop-blur-sm border-b border-border">
      <div className="px-4 py-3 flex items-center justify-between max-w-7xl mx-auto">
        <button
          type="button"
          onClick={goBack}
          className="flex items-center gap-1.5 text-muted-foreground hover:text-secondary transition-colors"
        >
          <ArrowRight className="w-5 h-5" />
          <span className="text-sm font-medium">بازگشت</span>
        </button>
        {/* Deliberately not an <h1>: this header renders on top of pages that already have their
            own heading (product name, category name, ...). Two <h1>s per page is an SEO defect. */}
        <p className="text-lg md:text-2xl font-bold text-foreground">{title}</p>
        <div className="w-16 flex justify-end">{right}</div>
      </div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export function DynamicHeader() {
  const { brand, cart, wishlist, orders } = useSiteSettings();
  const pathname = usePathname();
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const openSearch = () => {
    setIsSearchOpen(true);
    // focus after the overlay renders
    setTimeout(() => searchInputRef.current?.focus(), 50);
  };

  // close search on route change
  useEffect(() => {
    setIsSearchOpen(false);
  }, [pathname]);

  // ── Home ──
  if (pathname === "/") {
    return (
      <>
        <FilterModal
          isOpen={isFilterModalOpen}
          onClose={() => setIsFilterModalOpen(false)}
        />
        <header className="sticky top-0 z-40 bg-card shadow-sm">
          <div className="h-1 bg-gradient-to-l from-primary via-secondary to-primary" />
          <div className="mx-auto px-4 md:px-6 py-3">
            <div className="flex flex-row items-center gap-4 justify-between">
              {/* Brand */}
              <Link href="/" className="flex items-center gap-2 flex-shrink-0">
                <Image
                  src={brand.logoUrl}
                  alt={brand.name}
                  width={366}
                  height={200}
                  priority
                  className="h-9 sm:h-11 lg:h-12 xl:h-14 w-auto object-contain"
                />
              </Link>

              {/* Search — icon on mobile, full bar on sm+ */}
              <div className="flex-1 flex items-center justify-end gap-2">
                {/* Mobile: icon button */}
                <button
                  onClick={openSearch}
                  className="sm:hidden p-2.5 rounded-2xl bg-muted border border-border hover:bg-muted hover:border-secondary/30 transition-all"
                  aria-label="جستجو"
                >
                  <Search className="w-4 h-4 text-muted-foreground" />
                </button>

                {/* sm+: inline search bar */}
                <div className="hidden max-w-xl sm:flex flex-1 items-center gap-2">
                  <SearchBox
                    isOpen={false}
                    onClose={() => {}}
                    inputRef={searchInputRef}
                  />
                </div>

                {/* Mobile overlay search */}
                <div className="sm:hidden">
                  <SearchBox
                    isOpen={isSearchOpen}
                    onClose={() => setIsSearchOpen(false)}
                    inputRef={searchInputRef}
                  />
                </div>

                {/* Filter button */}
                <button
                  onClick={() => setIsFilterModalOpen(true)}
                  className="flex items-center gap-1.5 px-3 sm:px-4 py-2.5 rounded-2xl bg-secondary text-secondary-foreground text-sm font-medium hover:bg-secondary/90 active:scale-95 transition-all whitespace-nowrap flex-shrink-0 shadow-sm"
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
    "/products": "محصولات",
    "/offers": "پیشنهادهای ویژه",
    "/product": "جزئیات محصول",
    "/wishlist": wishlist.title,
    "/cart": cart.title,
    "/checkout": "پرداخت نهایی",
    "/profile": "پروفایل",
    "/categories": "دسته‌بندی‌ها",
    "/blogs": "بلاگ",
    "/orders": orders.title,
  };

  const matchedKey = Object.keys(namedPages).find(
    (key) => pathname === key || pathname.startsWith(key + "/"),
  );

  const pageTitle = matchedKey ? namedPages[matchedKey] : brand.name;

  return <BackHeader title={pageTitle} />;
}
