"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Loader2, PackageSearch, Percent, Search } from "lucide-react";
import { categoryService } from "@/features/category/category-api";
import { brandService } from "@/features/brand/brand-api";
import { normalizeDigits } from "@/shared/lib/digits";
import type { Category } from "@/types/category";
import type { Brand } from "@/types/brand";

/** Maximum of the slider's price range (Toman) */
const PRICE_MIN = 0;
const PRICE_MAX = 5_000_000;
const PRICE_STEP = 50_000;

/**
 * Read multiple slugs from the URL: the plural key (CSV) + the legacy single key (compat with existing links).
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

// Price range slider (two handles) — RTL: right = min, left = max.
// Uses Pointer Events (+ touch-action:none and data-vaul-no-drag) so dragging is reliable
// on touch inside the mobile drawer; the thumbs are pointer-events-none visuals and the
// track owns the gesture (with capture), and numeric inputs let the range be typed directly.
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
  const draggingRef = useRef<null | 0 | 1>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  const minValue = Math.min(value[0], value[1]);
  const maxValue = Math.max(value[0], value[1]);
  const getPercent = (val: number) =>
    max === min ? 0 : ((val - min) / (max - min)) * 100;

  const clampStep = (raw: number) => {
    const stepped = Math.round(raw / PRICE_STEP) * PRICE_STEP;
    return Math.max(min, Math.min(max, stepped));
  };

  const posToValue = (clientX: number) => {
    const rect = trackRef.current!.getBoundingClientRect();
    let percent = (rect.right - clientX) / rect.width;
    percent = Math.max(0, Math.min(1, percent));
    return clampStep(min + percent * (max - min));
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!trackRef.current) return;
    e.preventDefault();
    const tapped = posToValue(e.clientX);
    // Grab the handle nearest to the tapped position.
    const idx: 0 | 1 =
      Math.abs(tapped - value[0]) <= Math.abs(tapped - value[1]) ? 0 : 1;
    e.currentTarget.setPointerCapture?.(e.pointerId);
    draggingRef.current = idx;
    setDragging(idx);
    const next: [number, number] = [...value] as [number, number];
    next[idx] = tapped;
    onChange(next);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const idx = draggingRef.current;
    if (idx === null) return;
    const next: [number, number] = [...value] as [number, number];
    next[idx] = posToValue(e.clientX);
    onChange(next);
  };

  const endDrag = (e: React.PointerEvent<HTMLDivElement>) => {
    if (draggingRef.current === null) return;
    e.currentTarget.releasePointerCapture?.(e.pointerId);
    draggingRef.current = null;
    setDragging(null);
  };

  // Typed entry — the tuple is normalized to [low, high] on every change.
  const setLow = (digits: string) => {
    const parsed = digits === "" ? min : Number(digits);
    onChange([Math.max(min, Math.min(max, parsed)), maxValue]);
  };
  const setHigh = (digits: string) => {
    const parsed = digits === "" ? max : Number(digits);
    onChange([minValue, Math.max(min, Math.min(max, parsed))]);
  };

  return (
    <div className="w-full px-1 pt-1" data-vaul-no-drag>
      <div
        ref={trackRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        className="relative h-2 mx-2.5 my-5 bg-muted rounded-full touch-none cursor-pointer select-none"
      >
        <div
          className="absolute h-2 bg-secondary rounded-full pointer-events-none"
          style={{
            right: `${getPercent(minValue)}%`,
            width: `${getPercent(maxValue) - getPercent(minValue)}%`,
            top: 0,
          }}
        />
        {[0, 1].map((idx) => (
          <div
            key={idx}
            className={`absolute w-5 h-5 bg-card border-2 border-secondary rounded-full shadow -top-1.5 z-10 pointer-events-none transition-transform ${
              dragging === idx ? "scale-110" : ""
            }`}
            style={{ right: `calc(${getPercent(value[idx])}% - 10px)` }}
          />
        ))}
      </div>

      {/* Numeric entry so the range can always be defined even without dragging. */}
      <div className="flex items-end gap-2 mt-1">
        <div className="flex-1">
          <label className="block text-xs text-muted-foreground mb-1">
            از (تومان)
          </label>
          <input
            type="text"
            inputMode="numeric"
            dir="ltr"
            value={minValue ? minValue.toLocaleString("fa-IR") : ""}
            onChange={(e) => setLow(normalizeDigits(e.target.value))}
            placeholder="۰"
            className="w-full px-3 py-2 rounded-xl bg-muted border border-border text-sm text-foreground text-center focus:outline-none focus:border-secondary/60 focus:bg-card focus:ring-2 focus:ring-secondary/15 transition-all"
          />
        </div>
        <span className="pb-2 text-sm text-muted-foreground">تا</span>
        <div className="flex-1">
          <label className="block text-xs text-muted-foreground mb-1">
            تا (تومان)
          </label>
          <input
            type="text"
            inputMode="numeric"
            dir="ltr"
            value={maxValue ? maxValue.toLocaleString("fa-IR") : ""}
            onChange={(e) => setHigh(normalizeDigits(e.target.value))}
            placeholder={max.toLocaleString("fa-IR")}
            className="w-full px-3 py-2 rounded-xl bg-muted border border-border text-sm text-foreground text-center focus:outline-none focus:border-secondary/60 focus:bg-card focus:ring-2 focus:ring-secondary/15 transition-all"
          />
        </div>
      </div>
    </div>
  );
}

/**
 * A category node together with its subcategories (recursive, multi-select) — subcategories are nested and
 * shown slightly indented under the parent so the hierarchy is clear.
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
            ? "bg-secondary text-white font-semibold shadow"
            : "text-foreground hover:bg-muted"
        }`}
      >
        <span
          className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border ${
            isSelected ? "border-white bg-card/20" : "border-border"
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
        <div className="mr-3 border-r border-border/80 pr-1 space-y-0.5">
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
 * Product search/filter panel — initialized from the URL and, on apply, navigates to `/products`.
 * Used inside a Drawer (FilterModal) on mobile and as a sidebar on laptop/tablet.
 */
export function ProductFilters({
  onApplied,
  initialCategories,
  initialBrands,
}: {
  onApplied?: () => void;
  /** Categories/brands fetched on the server — as initialData so the client does not re-fetch. */
  initialCategories?: Category[];
  initialBrands?: Brand[];
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const spKey = searchParams.toString();

  // By seeding initialData from the server data, React Query does not re-fetch within staleTime
  // (fixes a duplicate fetch on every reload). If there is no server data, it fetches client-side as usual.
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

  // Sync with the URL on navigation (chips/sorting/clearing filters).
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

    // Keep the current sorting.
    const sortBy = searchParams.get("sortBy");
    const sortOrder = searchParams.get("sortOrder");
    if (sortBy) params.set("sortBy", sortBy);
    if (sortOrder) params.set("sortOrder", sortOrder);

    // If the query equals the current URL, router.push has no effect (the "button does nothing" bug).
    // In that case we refresh to update the server data so applying the filter always gives feedback.
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
      {/* Search */}
      <div>
        <h3 className="font-bold text-secondary text-sm mb-3">جستجو</h3>
        <div className="relative">
          <Search className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
          <input
            type="text"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleApply();
            }}
            placeholder="نام محصول..."
            dir="rtl"
            className="w-full pr-10 pl-3 py-2.5 rounded-2xl bg-muted border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-secondary/60 focus:bg-card focus:ring-2 focus:ring-secondary/15 transition-all"
          />
        </div>
      </div>
      {/* Availability */}
      <div>
        <label className="flex items-center gap-2 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={inStock}
            onChange={(e) => setInStock(e.target.checked)}
            className="w-4 h-4 rounded border-border accent-secondary"
          />
          <span className="flex items-center gap-1.5 text-sm text-foreground">
            <PackageSearch className="w-4 h-4 text-secondary" />
            فقط کالاهای موجود
          </span>
        </label>
      </div>

      {/* Discounted */}
      <div>
        <label className="flex items-center gap-2 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={hasDiscount}
            onChange={(e) => setHasDiscount(e.target.checked)}
            className="w-4 h-4 rounded border-border accent-secondary"
          />
          <span className="flex items-center gap-1.5 text-sm text-foreground">
            <Percent className="w-4 h-4 text-secondary" />
            فقط کالاهای تخفیف‌دار
          </span>
        </label>
      </div>
      {/* Price */}
      <div>
        <h3 className="font-bold text-secondary text-sm mb-1">محدوده‌ی قیمت</h3>
        <PriceSlider
          min={PRICE_MIN}
          max={PRICE_MAX}
          value={priceRange}
          onChange={setPriceRange}
        />
      </div>

      {/* Category */}
      <div className="pb-1">
        <h3 className="font-bold text-secondary text-sm mb-3">دسته‌بندی</h3>
        {categoriesLoading ? (
          <div className="flex justify-center py-4">
            <Loader2 className="w-5 h-5 text-secondary animate-spin" />
          </div>
        ) : categories.length === 0 ? (
          <p className="text-sm text-muted-foreground">دسته‌بندی‌ای یافت نشد.</p>
        ) : (
          <div className="max-h-72 overflow-y-auto pl-1 space-y-0.5">
            <button
              type="button"
              onClick={() => setSelectedCategories([])}
              className={`w-full rounded-xl py-2 px-3 text-sm text-right transition-colors ${
                selectedCategories.length === 0
                  ? "bg-secondary text-white font-semibold shadow"
                  : "text-foreground hover:bg-muted"
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

      {/* Brand */}
      <div className="pb-1">
        <h3 className="font-bold text-secondary text-sm mb-3">برند</h3>
        {brandsLoading ? (
          <div className="flex justify-center py-4">
            <Loader2 className="w-5 h-5 text-secondary animate-spin" />
          </div>
        ) : brands.length === 0 ? (
          <p className="text-sm text-muted-foreground">برندی یافت نشد.</p>
        ) : (
          <div className="flex flex-wrap gap-2 max-h-56 overflow-y-auto pl-1">
            <button
              type="button"
              onClick={() => setSelectedBrands([])}
              className={`px-4 py-2 rounded-full text-sm border transition-colors font-medium ${
                selectedBrands.length === 0
                  ? "bg-secondary text-white border-secondary shadow"
                  : "bg-muted text-foreground border-border hover:border-border"
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
                    ? "bg-secondary text-white border-secondary shadow"
                    : "bg-muted text-foreground border-border hover:border-border"
                }`}
              >
                {b.name}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex flex-col gap-2 pt-2">
        <button
          type="button"
          onClick={handleApply}
          className="px-4 py-2.5 bg-secondary hover:bg-secondary/90 text-white rounded-2xl text-sm font-semibold shadow transition-colors"
        >
          اعمال فیلتر
        </button>
        <button
          type="button"
          onClick={handleReset}
          className="px-4 py-2.5 border border-border rounded-2xl text-sm font-medium hover:bg-muted transition-colors"
        >
          بازنشانی
        </button>
      </div>
    </div>
  );
}
