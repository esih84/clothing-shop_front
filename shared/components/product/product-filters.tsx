"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Loader2, PackageSearch, Percent, Search } from "lucide-react";
import { categoryService } from "@/features/category/category-api";
import { brandService } from "@/features/brand/brand-api";
import type { Category } from "@/types/category";
import type { Brand } from "@/types/brand";

/** بیشینه‌ی بازه‌ی قیمت اسلایدر (تومان) */
const PRICE_MIN = 0;
const PRICE_MAX = 5_000_000;
const PRICE_STEP = 50_000;

/**
 * خواندن چند slug از URL: کلید جمع (CSV) + کلید تکیِ قدیمی (سازگاری با لینک‌های موجود).
 */
function readSlugs(
  params: URLSearchParams | { get: (k: string) => string | null },
  pluralKey: string,
  singularKey: string,
): string[] {
  const out = new Set<string>();
  const csv = params.get(pluralKey);
  if (csv)
    csv
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean)
      .forEach((s) => out.add(s));
  const single = params.get(singularKey);
  if (single) out.add(single);
  return [...out];
}

// اسلایدر بازه‌ی قیمت (دو دسته) — RTL: سمت راست = کمینه، سمت چپ = بیشینه
function PriceSlider({
  min,
  max,
  value,
  onChange,
}: {
  min: number;
  max: number;
  value: [number, number];
  onChange: (val: [number, number]) => void;
}) {
  const [dragging, setDragging] = useState<null | 0 | 1>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  const minValue = Math.min(value[0], value[1]);
  const maxValue = Math.max(value[0], value[1]);
  const getPercent = (val: number) => ((val - min) / (max - min)) * 100;

  const handleDrag = (idx: 0 | 1, clientX: number) => {
    if (!trackRef.current) return;
    const rect = trackRef.current.getBoundingClientRect();
    let percent = (rect.right - clientX) / rect.width;
    percent = Math.max(0, Math.min(1, percent));
    const raw = min + percent * (max - min);
    const stepped = Math.round(raw / PRICE_STEP) * PRICE_STEP;
    const newRange: [number, number] = [...value] as [number, number];
    newRange[idx] = stepped;
    onChange(newRange);
  };

  const handleThumbDown =
    (idx: 0 | 1) => (e: React.MouseEvent | React.TouchEvent) => {
      setDragging(idx);
      e.stopPropagation();
    };

  useEffect(() => {
    if (dragging === null) return;
    const handleMove = (e: MouseEvent | TouchEvent) => {
      let clientX = (e as MouseEvent).clientX;
      if ((e as TouchEvent).touches)
        clientX = (e as TouchEvent).touches[0].clientX;
      handleDrag(dragging, clientX);
    };
    const handleUp = () => setDragging(null);
    window.addEventListener("mousemove", handleMove);
    window.addEventListener("touchmove", handleMove);
    window.addEventListener("mouseup", handleUp);
    window.addEventListener("touchend", handleUp);
    return () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("touchmove", handleMove);
      window.removeEventListener("mouseup", handleUp);
      window.removeEventListener("touchend", handleUp);
    };
    // فقط با شروع/پایان درگ لیسنرها را ببند/بازکن؛ در هر درگ تنها همان thumb تغییر
    // می‌کند، پس بستن value در شروع درگ کافی است و نیازی به وابستگی handleDrag نیست.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dragging]);

  return (
    <div className="w-full px-2 py-4">
      <div ref={trackRef} className="relative h-2 bg-gray-200 rounded-full">
        <div
          className="absolute h-2 bg-[#1473E6] rounded-full"
          style={{
            right: `${getPercent(minValue)}%`,
            width: `${getPercent(maxValue) - getPercent(minValue)}%`,
            top: 0,
          }}
        />
        {[0, 1].map((idx) => (
          <div
            key={idx}
            className={`absolute w-5 h-5 bg-white border-2 border-[#1473E6] rounded-full shadow -top-1.5 z-10 cursor-pointer transition-transform ${
              dragging === idx ? "scale-110" : ""
            }`}
            style={{ right: `calc(${getPercent(value[idx])}% - 10px)` }}
            onMouseDown={handleThumbDown(idx as 0 | 1)}
            onTouchStart={handleThumbDown(idx as 0 | 1)}
          />
        ))}
      </div>
      <div className="flex justify-between mt-4 text-sm">
        <span>
          از <b>{minValue.toLocaleString("fa-IR")}</b> تومان
        </span>
        <span>
          تا <b>{maxValue.toLocaleString("fa-IR")}</b> تومان
        </span>
      </div>
    </div>
  );
}

/**
 * یک گره‌ی دسته‌بندی به‌همراه زیردسته‌هایش (بازگشتی، چند‌انتخابی) — زیردسته‌ها تودرتو و
 * کمی تورفته زیر دسته‌ی والد نمایش داده می‌شوند تا سلسله‌مراتب مشخص باشد.
 */
function CategoryNode({
  category,
  selected,
  onToggle,
}: {
  category: Category;
  selected: string[];
  onToggle: (slug: string) => void;
}) {
  const isSelected = selected.includes(category.slug);
  const children = category.children ?? [];

  return (
    <div className="space-y-0.5">
      <button
        type="button"
        onClick={() => onToggle(category.slug)}
        className={`flex w-full items-center gap-2 rounded-xl py-2 px-3 text-sm text-right transition-colors ${
          isSelected
            ? "bg-[#1473E6] text-white font-semibold shadow"
            : "text-gray-700 hover:bg-gray-100"
        }`}
      >
        <span
          className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border ${
            isSelected ? "border-white bg-white/20" : "border-gray-300"
          }`}
        >
          {isSelected && (
            <svg viewBox="0 0 12 12" className="h-3 w-3 fill-white">
              <path
                d="M10 3L4.5 8.5 2 6"
                stroke="white"
                strokeWidth="1.6"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
        </span>
        <span className="flex-1">{category.name}</span>
      </button>
      {children.length > 0 && (
        <div className="mr-3 border-r border-gray-200/80 pr-1 space-y-0.5">
          {children.map((child) => (
            <CategoryNode
              key={child.id}
              category={child}
              selected={selected}
              onToggle={onToggle}
            />
          ))}
        </div>
      )}
    </div>
  );
}

/**
 * پنل جستجو/فیلتر محصولات — از URL مقداردهی اولیه می‌شود و با اعمال به `/products` می‌رود.
 * در موبایل داخل Drawer (FilterModal) و در لپ‌تاپ/تبلت به‌صورت ستون کناری استفاده می‌شود.
 */
export function ProductFilters({
  onApplied,
  initialCategories,
  initialBrands,
}: {
  onApplied?: () => void;
  /** دسته‌ها/برندهای گرفته‌شده در سرور — به‌عنوان initialData تا کلاینت دوباره fetch نکند. */
  initialCategories?: Category[];
  initialBrands?: Brand[];
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const spKey = searchParams.toString();

  // با seed کردن initialData از داده‌ی سرور، React Query در staleTime دوباره fetch نمی‌کند
  // (رفع fetch تکراری در هر ری‌لود). اگر داده‌ی سرور نبود، طبق روال کلاینت‌ساید می‌گیرد.
  const { data: categories = [], isLoading: categoriesLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: () => categoryService.findAll(),
    staleTime: 1000 * 60 * 5,
    initialData: initialCategories,
  });

  const { data: brands = [], isLoading: brandsLoading } = useQuery({
    queryKey: ["brands"],
    queryFn: () => brandService.findAll(),
    staleTime: 1000 * 60 * 5,
    initialData: initialBrands,
  });

  const [searchText, setSearchText] = useState(
    () => searchParams.get("search") ?? "",
  );
  const [selectedCategories, setSelectedCategories] = useState<string[]>(() =>
    readSlugs(searchParams, "categorySlugs", "categorySlug"),
  );
  const [selectedBrands, setSelectedBrands] = useState<string[]>(() =>
    readSlugs(searchParams, "brandSlugs", "brandSlug"),
  );
  const toggleCategory = (slug: string) =>
    setSelectedCategories((prev) =>
      prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug],
    );
  const toggleBrand = (slug: string) =>
    setSelectedBrands((prev) =>
      prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug],
    );
  const [priceRange, setPriceRange] = useState<[number, number]>(() => [
    searchParams.get("minPrice")
      ? Number(searchParams.get("minPrice"))
      : PRICE_MIN,
    searchParams.get("maxPrice")
      ? Number(searchParams.get("maxPrice"))
      : PRICE_MAX,
  ]);
  const [inStock, setInStock] = useState(
    () => searchParams.get("inStock") === "true",
  );
  const [hasDiscount, setHasDiscount] = useState(
    () => searchParams.get("hasDiscount") === "true",
  );

  // هم‌گام‌سازی با URL هنگام ناوبری (چیپ‌ها/مرتب‌سازی/پاک‌کردن فیلتر).
  useEffect(() => {
    setSearchText(searchParams.get("search") ?? "");
    setSelectedCategories(
      readSlugs(searchParams, "categorySlugs", "categorySlug"),
    );
    setSelectedBrands(readSlugs(searchParams, "brandSlugs", "brandSlug"));
    setPriceRange([
      searchParams.get("minPrice")
        ? Number(searchParams.get("minPrice"))
        : PRICE_MIN,
      searchParams.get("maxPrice")
        ? Number(searchParams.get("maxPrice"))
        : PRICE_MAX,
    ]);
    setInStock(searchParams.get("inStock") === "true");
    setHasDiscount(searchParams.get("hasDiscount") === "true");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [spKey]);

  const handleReset = () => {
    setSearchText("");
    setSelectedCategories([]);
    setSelectedBrands([]);
    setPriceRange([PRICE_MIN, PRICE_MAX]);
    setInStock(false);
    setHasDiscount(false);
  };

  const handleApply = () => {
    const lo = Math.min(...priceRange);
    const hi = Math.max(...priceRange);

    const params = new URLSearchParams();
    if (searchText.trim()) params.set("search", searchText.trim());
    if (selectedCategories.length)
      params.set("categorySlugs", selectedCategories.join(","));
    if (selectedBrands.length)
      params.set("brandSlugs", selectedBrands.join(","));
    if (lo > PRICE_MIN) params.set("minPrice", String(lo));
    if (hi < PRICE_MAX) params.set("maxPrice", String(hi));
    if (inStock) params.set("inStock", "true");
    if (hasDiscount) params.set("hasDiscount", "true");

    // مرتب‌سازی فعلی حفظ شود.
    const sortBy = searchParams.get("sortBy");
    const sortOrder = searchParams.get("sortOrder");
    if (sortBy) params.set("sortBy", sortBy);
    if (sortOrder) params.set("sortOrder", sortOrder);

    // اگر کوئری با URL فعلی یکی باشد، router.push بی‌اثر است (باگ «دکمه عمل نمی‌کند»).
    // در آن حالت با refresh داده‌ی سرور را تازه می‌کنیم تا اعمالِ فیلتر همیشه بازخورد بدهد.
    const query = params.toString();
    if (query === searchParams.toString()) {
      router.refresh();
    } else {
      router.push(query ? `/products?${query}` : "/products");
    }
    onApplied?.();
  };

  return (
    <div className="space-y-7">
      {/* جستجو */}
      <div>
        <h3 className="font-semibold text-[#1473E6] text-base mb-3">جستجو</h3>
        <div className="relative">
          <Search className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          <input
            type="text"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleApply();
            }}
            placeholder="نام محصول..."
            dir="rtl"
            className="w-full pr-10 pl-3 py-2.5 rounded-2xl bg-muted border border-border text-sm text-foreground placeholder:text-gray-400 focus:outline-none focus:border-secondary/60 focus:bg-white focus:ring-2 focus:ring-secondary/15 transition-all"
          />
        </div>
      </div>
      {/* موجودی */}
      <div>
        <label className="flex items-center gap-2 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={inStock}
            onChange={(e) => setInStock(e.target.checked)}
            className="w-4 h-4 rounded border-gray-300 accent-[#1473E6]"
          />
          <span className="flex items-center gap-1.5 text-gray-700">
            <PackageSearch className="w-4 h-4 text-[#1473E6]" />
            فقط کالاهای موجود
          </span>
        </label>
      </div>

      {/* تخفیف‌دار */}
      <div>
        <label className="flex items-center gap-2 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={hasDiscount}
            onChange={(e) => setHasDiscount(e.target.checked)}
            className="w-4 h-4 rounded border-gray-300 accent-[#1473E6]"
          />
          <span className="flex items-center gap-1.5 text-gray-700">
            <Percent className="w-4 h-4 text-[#1473E6]" />
            فقط کالاهای تخفیف‌دار
          </span>
        </label>
      </div>
      {/* قیمت */}
      <div>
        <h3 className="font-semibold text-[#1473E6] text-base mb-1">
          محدوده‌ی قیمت
        </h3>
        <PriceSlider
          min={PRICE_MIN}
          max={PRICE_MAX}
          value={priceRange}
          onChange={setPriceRange}
        />
      </div>

      {/* دسته‌بندی */}
      <div className="pb-1">
        <h3 className="font-semibold text-[#1473E6] text-base mb-3">
          دسته‌بندی
        </h3>
        {categoriesLoading ? (
          <div className="flex justify-center py-4">
            <Loader2 className="w-5 h-5 text-[#1473E6] animate-spin" />
          </div>
        ) : categories.length === 0 ? (
          <p className="text-sm text-gray-400">دسته‌بندی‌ای یافت نشد.</p>
        ) : (
          <div className="max-h-72 overflow-y-auto pl-1 space-y-0.5">
            <button
              type="button"
              onClick={() => setSelectedCategories([])}
              className={`w-full rounded-xl py-2 px-3 text-sm text-right transition-colors ${
                selectedCategories.length === 0
                  ? "bg-[#1473E6] text-white font-semibold shadow"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              همه‌ی دسته‌ها
            </button>
            {categories.map((cat) => (
              <CategoryNode
                key={cat.id}
                category={cat}
                selected={selectedCategories}
                onToggle={toggleCategory}
              />
            ))}
          </div>
        )}
      </div>

      {/* برند */}
      <div className="pb-1">
        <h3 className="font-semibold text-[#1473E6] text-base mb-3">برند</h3>
        {brandsLoading ? (
          <div className="flex justify-center py-4">
            <Loader2 className="w-5 h-5 text-[#1473E6] animate-spin" />
          </div>
        ) : brands.length === 0 ? (
          <p className="text-sm text-gray-400">برندی یافت نشد.</p>
        ) : (
          <div className="flex flex-wrap gap-2 max-h-56 overflow-y-auto pl-1">
            <button
              type="button"
              onClick={() => setSelectedBrands([])}
              className={`px-4 py-2 rounded-full text-sm border transition-colors font-medium ${
                selectedBrands.length === 0
                  ? "bg-[#1473E6] text-white border-[#1473E6] shadow"
                  : "bg-gray-100 text-gray-700 border-gray-200 hover:border-[#A9CBF5]"
              }`}
            >
              همه
            </button>
            {brands.map((b) => (
              <button
                key={b.id}
                type="button"
                onClick={() => toggleBrand(b.slug)}
                className={`px-4 py-2 rounded-full text-sm border transition-colors font-medium ${
                  selectedBrands.includes(b.slug)
                    ? "bg-[#1473E6] text-white border-[#1473E6] shadow"
                    : "bg-gray-100 text-gray-700 border-gray-200 hover:border-[#A9CBF5]"
                }`}
              >
                {b.name}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* اقدام‌ها */}
      <div className="flex flex-col gap-2 pt-2">
        <button
          type="button"
          onClick={handleApply}
          className="px-4 py-2.5 bg-[#1473E6] hover:bg-[#1473E6]/90 text-white rounded-2xl text-base font-semibold shadow transition-colors"
        >
          اعمال فیلتر
        </button>
        <button
          type="button"
          onClick={handleReset}
          className="px-4 py-2.5 border border-gray-300 rounded-2xl text-base font-medium hover:bg-gray-100 transition-colors"
        >
          بازنشانی
        </button>
      </div>
    </div>
  );
}
