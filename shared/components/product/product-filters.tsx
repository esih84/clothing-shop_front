"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Loader2, PackageSearch, Search } from "lucide-react";
import { categoryService } from "@/features/category/category-api";
import { brandService } from "@/features/brand/brand-api";

/** بیشینه‌ی بازه‌ی قیمت اسلایدر (تومان) */
const PRICE_MIN = 0;
const PRICE_MAX = 5_000_000;
const PRICE_STEP = 50_000;

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
  });

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
 * پنل جستجو/فیلتر محصولات — از URL مقداردهی اولیه می‌شود و با اعمال به `/products` می‌رود.
 * در موبایل داخل Drawer (FilterModal) و در لپ‌تاپ/تبلت به‌صورت ستون کناری استفاده می‌شود.
 */
export function ProductFilters({ onApplied }: { onApplied?: () => void }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const spKey = searchParams.toString();

  const { data: categories = [], isLoading: categoriesLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: () => categoryService.findAll(),
    staleTime: 1000 * 60 * 5,
  });

  const { data: brands = [], isLoading: brandsLoading } = useQuery({
    queryKey: ["brands"],
    queryFn: () => brandService.findAll(),
    staleTime: 1000 * 60 * 5,
  });

  const [searchText, setSearchText] = useState(
    () => searchParams.get("search") ?? "",
  );
  const [selectedCategory, setSelectedCategory] = useState<string | null>(
    () => searchParams.get("categorySlug"),
  );
  const [selectedBrand, setSelectedBrand] = useState<string | null>(
    () => searchParams.get("brandSlug"),
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

  // هم‌گام‌سازی با URL هنگام ناوبری (چیپ‌ها/مرتب‌سازی/پاک‌کردن فیلتر).
  useEffect(() => {
    setSearchText(searchParams.get("search") ?? "");
    setSelectedCategory(searchParams.get("categorySlug"));
    setSelectedBrand(searchParams.get("brandSlug"));
    setPriceRange([
      searchParams.get("minPrice")
        ? Number(searchParams.get("minPrice"))
        : PRICE_MIN,
      searchParams.get("maxPrice")
        ? Number(searchParams.get("maxPrice"))
        : PRICE_MAX,
    ]);
    setInStock(searchParams.get("inStock") === "true");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [spKey]);

  const handleReset = () => {
    setSearchText("");
    setSelectedCategory(null);
    setSelectedBrand(null);
    setPriceRange([PRICE_MIN, PRICE_MAX]);
    setInStock(false);
  };

  const handleApply = () => {
    const lo = Math.min(...priceRange);
    const hi = Math.max(...priceRange);

    const params = new URLSearchParams();
    if (searchText.trim()) params.set("search", searchText.trim());
    if (selectedCategory) params.set("categorySlug", selectedCategory);
    if (selectedBrand) params.set("brandSlug", selectedBrand);
    if (lo > PRICE_MIN) params.set("minPrice", String(lo));
    if (hi < PRICE_MAX) params.set("maxPrice", String(hi));
    if (inStock) params.set("inStock", "true");

    // مرتب‌سازی فعلی حفظ شود.
    const sortBy = searchParams.get("sortBy");
    const sortOrder = searchParams.get("sortOrder");
    if (sortBy) params.set("sortBy", sortBy);
    if (sortOrder) params.set("sortOrder", sortOrder);

    router.push(`/products?${params.toString()}`);
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
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setSelectedCategory(null)}
              className={`px-4 py-2 rounded-full text-sm border transition-colors font-medium ${
                selectedCategory === null
                  ? "bg-[#1473E6] text-white border-[#1473E6] shadow"
                  : "bg-gray-100 text-gray-700 border-gray-200 hover:border-[#A9CBF5]"
              }`}
            >
              همه
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.slug)}
                className={`px-4 py-2 rounded-full text-sm border transition-colors font-medium ${
                  selectedCategory === cat.slug
                    ? "bg-[#1473E6] text-white border-[#1473E6] shadow"
                    : "bg-gray-100 text-gray-700 border-gray-200 hover:border-[#A9CBF5]"
                }`}
              >
                {cat.name}
              </button>
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
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setSelectedBrand(null)}
              className={`px-4 py-2 rounded-full text-sm border transition-colors font-medium ${
                selectedBrand === null
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
                onClick={() => setSelectedBrand(b.slug)}
                className={`px-4 py-2 rounded-full text-sm border transition-colors font-medium ${
                  selectedBrand === b.slug
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
