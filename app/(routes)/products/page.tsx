import Link from "next/link";
import { SlidersHorizontal } from "lucide-react";
import { getProducts } from "@/features/product/product-api";
import { getCategories } from "@/features/category/category-api";
import { getBrands } from "@/features/brand/brand-api";
import { ProductSort } from "@/shared/components/product/product-sort";
import { ProductFilters } from "@/shared/components/product/product-filters";
import { MobileFilterButton } from "@/shared/components/product/mobile-filter-button";
import { Products } from "@/shared/components/product/products";

interface ProductsPageProps {
  searchParams: Promise<Record<string, string | undefined>>;
}

const formatToman = (n: number) => `${n.toLocaleString("fa-IR")} تومان`;

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const sp = await searchParams;

  const filters = {
    search: sp.search || undefined,
    categorySlug: sp.categorySlug || undefined,
    brandSlug: sp.brandSlug || undefined,
    minPrice: sp.minPrice ? Number(sp.minPrice) : undefined,
    maxPrice: sp.maxPrice ? Number(sp.maxPrice) : undefined,
    inStock: sp.inStock === "true" ? true : undefined,
    sortBy: sp.sortBy || undefined,
    sortOrder: (sp.sortOrder as "ASC" | "DESC" | undefined) || undefined,
  };

  const [{ data: response }, { data: categories }, { data: brands }] =
    await Promise.all([
      getProducts({ ...filters, page: 1, limit: 10 }),
      getCategories(),
      getBrands(),
    ]);

  const products = response?.data ?? [];
  const total = response?.total ?? 0;
  const page = response?.page ?? 1;
  const limit = response?.limit ?? 10;
  const hasMore = page * limit < total;

  const activeCategory = filters.categorySlug
    ? categories?.find((c) => c.slug === filters.categorySlug)
    : undefined;

  const activeBrand = filters.brandSlug
    ? brands?.find((b) => b.slug === filters.brandSlug)
    : undefined;

  // برچسب‌های فیلتر فعال
  const activeChips: string[] = [];
  if (activeCategory) activeChips.push(`دسته: ${activeCategory.name}`);
  if (activeBrand) activeChips.push(`برند: ${activeBrand.name}`);
  if (filters.search) activeChips.push(`جستجو: «${filters.search}»`);
  if (filters.minPrice) activeChips.push(`از ${formatToman(filters.minPrice)}`);
  if (filters.maxPrice) activeChips.push(`تا ${formatToman(filters.maxPrice)}`);
  if (filters.inStock) activeChips.push("فقط موجود");

  const heading = activeCategory
    ? activeCategory.name
    : activeBrand
    ? activeBrand.name
    : filters.search
    ? `جستجو: «${filters.search}»`
    : "همه‌ی محصولات";

  // کلید یکتا تا با تغییر فیلتر، لیست بی‌نهایت از نو با داده‌ی سرور شروع شود.
  const productsKey = JSON.stringify(filters);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8" dir="rtl">
      <div className="mb-6 flex items-center gap-2 text-sm">
        <Link href="/" className="text-secondary hover:underline">
          خانه
        </Link>
        <span className="text-gray-400">/</span>
        <span className="font-bold text-secondary">{heading}</span>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* ستون کناری فیلتر — فقط لپ‌تاپ/تبلت */}
        <aside className="hidden lg:block w-72 shrink-0">
          <div className="sticky top-24 rounded-2xl border border-border bg-white p-5">
            <h2 className="flex items-center gap-2 text-lg font-bold text-foreground mb-4">
              <SlidersHorizontal className="w-4 h-4 text-secondary" />
              فیلترها
            </h2>
            <ProductFilters />
          </div>
        </aside>

        {/* محتوا */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <h1 className="text-xl md:text-2xl font-bold text-foreground">
              {total.toLocaleString("fa-IR")} محصول
            </h1>
            <div className="flex items-center gap-2">
              {/* دکمه‌ی فیلتر موبایل → Drawer */}
              <MobileFilterButton />
              <ProductSort />
            </div>
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
                href="/products"
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
            <Products
              key={productsKey}
              filters={filters}
              initialProducts={products}
              initialHasMore={hasMore}
              limit={10}
              gridClassName="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-5"
            />
          )}
        </div>
      </div>
    </div>
  );
}
