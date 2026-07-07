"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Search, Filter, ArrowRight, X, PawPrint } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { FilterModal } from "./filter-modal";
import { brand } from "@/shared/config/brand";

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
    <div className="sticky top-0 z-40 bg-white/90 backdrop-blur-sm border-b border-border">
      <div className="px-4 py-3 flex items-center justify-between max-w-7xl mx-auto">
        <Link
          prefetch
          href={href}
          className="flex items-center gap-1.5 text-muted-foreground hover:text-secondary transition-colors"
        >
          <ArrowRight className="w-5 h-5" />
          <span className="text-sm font-medium">بازگشت</span>
        </Link>
        <h1 className="text-lg md:text-2xl font-bold text-foreground">
          {title}
        </h1>
        <div className="w-16 flex justify-end">{right}</div>
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
  const router = useRouter();

  const submitSearch = (value: string) => {
    const q = value.trim();
    router.push(q ? `/search?search=${encodeURIComponent(q)}` : "/search");
    onClose();
  };

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
          ${
            isOpen
              ? "fixed top-0 left-0 right-0 z-50 px-4 pt-4 pb-3 bg-white shadow-lg sm:static sm:p-0 sm:shadow-none sm:bg-transparent"
              : "hidden sm:block"
          }
        `}
      >
        {/* Mobile top bar inside overlay */}
        {isOpen && (
          <div className="flex items-center justify-between mb-3 sm:hidden">
            <span className="text-sm font-semibold text-foreground">جستجو</span>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-muted transition-colors"
              aria-label="بستن جستجو"
            >
              <X className="w-5 h-5 text-muted-foreground" />
            </button>
          </div>
        )}

        <form
          className="relative group"
          onSubmit={(e) => {
            e.preventDefault();
            submitSearch(query);
          }}
        >
          <Search className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-secondary transition-colors pointer-events-none" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={`جستجو در ${brand.name}...`}
            dir="rtl"
            className="
              w-full pr-10 pl-10 py-2.5 rounded-2xl
              bg-muted border border-border
              text-sm text-foreground placeholder:text-gray-400
              focus:outline-none focus:border-secondary/60 focus:bg-white focus:ring-2 focus:ring-secondary/15
              transition-all duration-200
            "
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              className="absolute left-3 top-1/2 -translate-y-1/2 p-0.5 rounded-full hover:bg-gray-200 transition-colors"
              aria-label="پاک کردن جستجو"
            >
              <X className="w-3.5 h-3.5 text-gray-400" />
            </button>
          )}
        </form>

        {/* Recent searches — shown only when focused and empty (mobile overlay) */}
        {isOpen && !query && (
          <div className="mt-3 sm:hidden">
            <p className="text-xs text-gray-400 mb-2 px-1">جستجوهای اخیر</p>
            {["غذای سگ", "اسباب‌بازی گربه", "قلاده و بند"].map((item) => (
              <button
                key={item}
                onClick={() => submitSearch(item)}
                className="flex items-center gap-2 w-full px-3 py-2 rounded-xl hover:bg-muted transition-colors text-right"
              >
                <Search className="w-3.5 h-3.5 text-gray-300 flex-shrink-0" />
                <span className="text-sm text-muted-foreground">{item}</span>
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
        <header className="sticky top-0 z-40 bg-white shadow-sm">
          <div className="h-1 bg-gradient-to-l from-primary via-secondary to-primary" />
          <div className="mx-auto px-4 md:px-6 py-3">
            <div className="flex flex-row items-center gap-4 justify-between">
              {/* Brand */}
              <Link href="/" className="flex items-center gap-2 flex-shrink-0">
                <div className="w-9 h-9 rounded-2xl bg-primary flex items-center justify-center shadow-sm">
                  <PawPrint className="w-5 h-5 text-primary-foreground" />
                </div>
                <div className="hidden sm:block">
                  <h1 className="text-lg font-bold text-foreground leading-none">
                    {brand.name}
                  </h1>
                  <p className="text-[10px] text-secondary mt-0.5 tracking-wide">
                    {brand.tagline}
                  </p>
                </div>
              </Link>

              {/* Search — icon on mobile, full bar on sm+ */}
              <div className="flex-1 flex items-center justify-end gap-2">
                {/* Mobile: icon button */}
                <button
                  onClick={openSearch}
                  className="sm:hidden p-2.5 rounded-2xl bg-muted border border-border hover:bg-gray-100 hover:border-secondary/30 transition-all"
                  aria-label="جستجو"
                >
                  <Search className="w-4 h-4 text-muted-foreground" />
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
                <div className="sm:hidden">
                  <SearchBar
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
    "/product": "جزئیات محصول",
    "/wishlist": "علاقه‌مندی‌ها",
    "/cart": "سبد خرید",
    "/checkout": "پرداخت نهایی",
    "/profile": "پروفایل",
    "/categories": "دسته‌بندی‌ها",
    "/blogs": "بلاگ",
    "/orders": "سفارش‌ها",
  };

  const matchedKey = Object.keys(namedPages).find(
    (key) => pathname === key || pathname.startsWith(key + "/"),
  );

  const pageTitle = matchedKey ? namedPages[matchedKey] : brand.name;

  return <BackHeader href="/" title={pageTitle} />;
}
