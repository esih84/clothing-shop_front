"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Loader2, PackageSearch } from "lucide-react";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/shared/ui/drawer";
import { categoryService } from "@/features/category/category-api";

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

/** بیشینه‌ی بازه‌ی قیمت اسلایدر (تومان) */
const PRICE_MIN = 0;
const PRICE_MAX = 5_000_000;
const PRICE_STEP = 50_000;

// اسلایدر بازه‌ی قیمت (دو دسته)
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
    // به‌خاطر RTL: سمت راست = کمینه، سمت چپ = بیشینه
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

export function FilterModal({ isOpen, onClose }: FilterModalProps) {
  const router = useRouter();

  const { data: categories = [], isLoading: categoriesLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: () => categoryService.findAll(),
    staleTime: 1000 * 60 * 5,
  });

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [priceRange, setPriceRange] = useState<[number, number]>([
    PRICE_MIN,
    PRICE_MAX,
  ]);
  const [inStock, setInStock] = useState(false);

  const handleReset = () => {
    setSelectedCategory(null);
    setPriceRange([PRICE_MIN, PRICE_MAX]);
    setInStock(false);
  };

  const handleApplyFilters = () => {
    const lo = Math.min(...priceRange);
    const hi = Math.max(...priceRange);

    const params = new URLSearchParams();
    if (selectedCategory) params.set("categorySlug", selectedCategory);
    if (lo > PRICE_MIN) params.set("minPrice", String(lo));
    if (hi < PRICE_MAX) params.set("maxPrice", String(hi));
    if (inStock) params.set("inStock", "true");

    router.push(`/search?${params.toString()}`);
    onClose();
  };

  return (
    <Drawer open={isOpen} onOpenChange={onClose}>
      <DrawerContent className="h-[90vh] md:h-full w-full max-w-md mx-auto md:mx-0 shadow-2xl bg-white">
        <div className="mx-auto w-full max-w-md">
          <DrawerHeader>
            <DrawerTitle className="flex items-center gap-2 text-2xl font-bold text-[#1473E6]">
              فیلتر محصولات
            </DrawerTitle>
            <DrawerDescription className="text-gray-500 text-right">
              بر اساس دسته‌بندی و قیمت، محصولات را فیلتر کنید
            </DrawerDescription>
          </DrawerHeader>

          <div className="p-4 space-y-8 overflow-y-auto max-h-[60vh] md:max-h-[70vh]">
            {/* دسته‌بندی */}
            <div className="pb-4 border-b border-[#A9CBF5]/20">
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

            {/* قیمت */}
            <div className="pb-4 border-b border-[#A9CBF5]/20">
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
          </div>

          <DrawerFooter className="flex flex-col gap-2 mt-2">
            <button
              className="px-4 py-2 bg-[#1473E6] hover:bg-[#1473E6]/90 text-white rounded-lg text-base font-semibold shadow transition-colors"
              onClick={handleApplyFilters}
            >
              اعمال فیلتر
            </button>
            <DrawerClose asChild>
              <button
                onClick={handleReset}
                className="px-4 py-2 border border-gray-300 rounded-lg text-base font-medium hover:bg-gray-100 transition-colors"
              >
                بازنشانی
              </button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
