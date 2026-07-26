"use client";

import Link from "next/link";
import type { Category } from "@/types/category";
import { AppSlider } from "@/shared/components/app-slider";

// Brand gradients (blue/black/yellow)
const cardGradients = [
  "from-[#1473E6] to-[#0B3A78]",
  "from-[#0B3A78] to-[#111827]",
  "from-[#1473E6] to-[#111827]",
  "from-[#F4B400] to-[#1473E6]",
  "from-[#111827] to-[#1473E6]",
  "from-[#1473E6] to-[#0B3A78]",
  "from-[#0B3A78] to-[#111827]",
];

interface CategorySliderProps {
  categories: Category[];
  showHeader?: boolean;
}

/**
 * Horizontal category slider: mobile 2 cards, tablet 3, desktop 5.
 * If the count exceeds a breakpoint's capacity, Swiper slides automatically
 * (autoplay is enabled only when there are more than 2 items).
 */
export function CategorySlider({
  categories,
  showHeader = true,
}: CategorySliderProps) {
  if (!categories.length) return null;

  // To avoid a large DOM, at most 14 categories in the slider
  const items = categories.slice(0, 14);
  // Enable sliding/autoplay only when it exceeds one row's capacity (largest breakpoint = 7)
  const canSlide = items.length > 7;

  return (
    <div className="py-6">
      {showHeader && (
        <div className="flex items-center justify-between mb-4 px-3 sm:px-4">
          <div className="flex items-center gap-2">
            <div className="w-1 h-5 rounded-full bg-secondary" />
            <h2 className="text-base font-bold tracking-wide">
              دسته‌بندی محصولات
            </h2>
          </div>

          {/* <Link
            prefetch
            href="/categories"
            className="text-xs text-secondary border-b border-secondary/40 pb-0.5 hover:border-secondary transition-colors"
          >
            مشاهده همه
          </Link> */}
        </div>
      )}

      <div className="mx-3 sm:mx-4 rounded-3xl border bg-card/60 p-2">
        <AppSlider
          items={items}
          getKey={(category) => category.id}
          dir="rtl"
          autoplay={canSlide ? 4 : false}
          loop={canSlide}
          spaceBetween={8}
          slidesPerView={3}
          breakpoints={{
            0: { slidesPerView: 3, spaceBetween: 8 },
            640: { slidesPerView: 5, spaceBetween: 8 },
            1024: { slidesPerView: 7, spaceBetween: 8 },
          }}
          className="categories-swiper"
          renderItem={(category, index) => (
            <Link
              prefetch
              href={`/products?categorySlug=${category.slug}`}
              className="flex flex-col group rounded-2xl border border-transparent hover:border-secondary/30 transition-colors p-1 min-w-0"
            >
              <div
                className={`relative aspect-square w-full overflow-hidden rounded-2xl bg-gradient-to-b ${
                  cardGradients[index % cardGradients.length]
                }`}
              >
                {category.imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={category.imageUrl}
                    alt={category.name}
                    loading="lazy"
                    className="absolute inset-0 w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center opacity-[0.12] pointer-events-none select-none">
                    <span className="text-4xl font-bold text-white leading-none">
                      {category.name.charAt(0)}
                    </span>
                  </div>
                )}
                <div className="absolute inset-0 bg-card/0 group-hover:bg-card/10 transition-colors duration-200" />
              </div>

              <div className="flex items-start justify-center pt-1.5 pb-0.5 min-h-[2.4em]">
                <p className="text-[11px] sm:text-xs font-semibold text-secondary text-center leading-tight line-clamp-2">
                  {category.name}
                </p>
              </div>
            </Link>
          )}
        />
      </div>
    </div>
  );
}
