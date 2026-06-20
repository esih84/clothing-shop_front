import Link from "next/link";
import type { Category } from "@/types/category";

interface CategorySelectorProps {
  categories: Category[];
  limit?: number;
  showHeader?: boolean;
}

// گرادیان‌های برند (آبی/مشکی/زرد) — بدون رنگ‌های مد قدیمی
const cardGradients = [
  "from-[#1473E6] to-[#0B3A78]",
  "from-[#0B3A78] to-[#111827]",
  "from-[#1473E6] to-[#111827]",
  "from-[#F4B400] to-[#1473E6]",
  "from-[#111827] to-[#1473E6]",
  "from-[#1473E6] to-[#0B3A78]",
  "from-[#0B3A78] to-[#111827]",
];

const colsClass: Record<number, string> = {
  1: "sm:grid-cols-1",
  2: "sm:grid-cols-2",
  3: "sm:grid-cols-3",
  4: "sm:grid-cols-4",
  5: "sm:grid-cols-5",
  6: "sm:grid-cols-6",
};

const DEFAULT_COLS = 4;

export function CategorySelector({
  categories,
  limit,
  showHeader = false,
}: CategorySelectorProps) {
  const smCols = colsClass[limit ?? DEFAULT_COLS] ?? "sm:grid-cols-4";
  const display = limit ? categories.slice(0, limit) : categories;

  if (!display.length) return null;

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

          <Link
            prefetch
            href="/categories"
            className="text-xs text-secondary border-b border-secondary/40 pb-0.5 hover:border-secondary transition-colors"
          >
            مشاهده همه
          </Link>
        </div>
      )}

      <div className="mx-3 sm:mx-4 rounded-3xl border bg-white/60 p-2">
        <div className={`grid grid-cols-2 ${smCols} gap-2 h-auto`}>
          {display.map((category, index) => {
            const nameOnTop = index % 2 === 1;

            return (
              <Link
                prefetch
                key={category.id}
                href={`/categories/${category.slug}`}
                className={[
                  "flex flex-col group rounded-2xl border border-transparent hover:border-secondary/30 transition-colors p-1 sm:flex-1",
                  index === 4 ? "hidden sm:flex" : "",
                  "min-w-0",
                ].join(" ")}
              >
                {nameOnTop && (
                  <div className="flex items-center justify-center p-2">
                    <p className="text-[11px] sm:text-xs font-semibold text-primary text-center leading-tight">
                      {category.name}
                    </p>
                  </div>
                )}

                <div
                  className={`relative aspect-[3/4] w-full overflow-hidden rounded-2xl bg-gradient-to-b ${
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
                      <span className="text-[5rem] font-bold text-white leading-none">
                        {category.name.charAt(0)}
                      </span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-colors duration-200" />
                </div>

                {!nameOnTop && (
                  <div className="flex items-center justify-center p-2">
                    <p className="text-[11px] sm:text-xs font-semibold text-primary text-center leading-tight">
                      {category.name}
                    </p>
                  </div>
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
