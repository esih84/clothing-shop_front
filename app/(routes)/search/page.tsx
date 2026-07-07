import Link from "next/link";
import { SlidersHorizontal } from "lucide-react";
import { getProducts } from "@/features/product/product-api";
import { getCategories } from "@/features/category/category-api";
import { ProductCard } from "@/shared/components/product/product-card";
import { ProductSort } from "@/shared/components/product/product-sort";

interface SearchPageProps {
  searchParams: Promise<Record<string, string | undefined>>;
}

const formatToman = (n: number) => `${n.toLocaleString("fa-IR")} تومان`;

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const sp = await searchParams;

  const filters = {
    search: sp.search || undefined,
    categorySlug: sp.categorySlug || undefined,
    minPrice: sp.minPrice ? Number(sp.minPrice) : undefined,
    maxPrice: sp.maxPrice ? Number(sp.maxPrice) : undefined,
    inStock: sp.inStock === "true" ? true : undefined,
    sortBy: sp.sortBy || undefined,
    sortOrder: (sp.sortOrder as "ASC" | "DESC" | undefined) || undefined,
    page: 1,
    limit: 24,
  };

  const [{ data: response }, { data: categories }] = await Promise.all([
    getProducts(filters),
    getCategories(),
  ]);
  const products = response?.data ?? [];
  const total = response?.total ?? 0;

  const activeCategory = filters.categorySlug
    ? categories?.find((c) => c.slug === filters.categorySlug)
    : undefined;

  // برچسب‌های فیلتر فعال
  const activeChips: string[] = [];
  if (activeCategory) activeChips.push(`دسته: ${activeCategory.name}`);
  if (filters.search) activeChips.push(`جستجو: «${filters.search}»`);
  if (filters.minPrice)
    activeChips.push(`از ${formatToman(filters.minPrice)}`);
  if (filters.maxPrice) activeChips.push(`تا ${formatToman(filters.maxPrice)}`);
  if (filters.inStock) activeChips.push("فقط موجود");

  const heading = activeCategory
    ? activeCategory.name
    : filters.search
    ? `جستجو: «${filters.search}»`
    : "همه‌ی محصولات";

  return (
    <div className="max-w-6xl mx-auto px-4 py-8" dir="rtl">
      <div className="mb-6 flex items-center gap-2 text-sm">
        <Link href="/" className="text-secondary hover:underline">
          خانه
        </Link>
        <span className="text-gray-400">/</span>
        <span className="font-bold text-secondary">{heading}</span>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <h1 className="text-xl md:text-2xl font-bold text-foreground">
          {total.toLocaleString("fa-IR")} محصول
        </h1>
        <ProductSort />
      </div>

      {/* برچسب‌های فیلتر فعال */}
      {activeChips.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 mb-6">
          <span className="inline-flex items-center gap-1.5 text-xs text-gray-500">
            <SlidersHorizontal className="w-3.5 h-3.5" />
            فیلترها:
          </span>
          {activeChips.map((chip) => (
            <span
              key={chip}
              className="text-xs bg-[#FDE68A]/40 text-[#1473E6] px-3 py-1 rounded-full border border-[#A9CBF5]/30"
            >
              {chip}
            </span>
          ))}
          <Link
            href="/search"
            className="text-xs text-gray-500 hover:text-red-500 underline underline-offset-4"
          >
            پاک کردن فیلترها
          </Link>
        </div>
      )}

      {products.length === 0 ? (
        <div className="text-gray-500 text-center py-16 rounded-2xl bg-muted/40 border border-border">
          محصولی با این مشخصات پیدا نشد.
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              id={product.id}
              slug={product.slug}
              title={product.name}
              price={product.basePrice}
              imageUrl={product.images?.[0]?.url || "/placeholder.svg"}
            />
          ))}
        </div>
      )}
    </div>
  );
}
