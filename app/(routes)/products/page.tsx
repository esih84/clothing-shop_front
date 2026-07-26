import { Suspense } from "react";
import Link from "next/link";
import { SlidersHorizontal } from "lucide-react";
import { getProducts, type ProductFilters as ProductFilterParams } from "@/features/product/product-api";
import { getCategories } from "@/features/category/category-api";
import { getBrands } from "@/features/brand/brand-api";
import { ProductSort } from "@/shared/components/product/product-sort";
import { ProductFilters } from "@/shared/components/product/product-filters";
import { MobileFilterButton } from "@/shared/components/product/mobile-filter-button";
import { Products } from "@/shared/components/product/products";

interface ProductsPageProps {
  searchParams: Promise<Record<string, string | undefined>>;
}

type ProductsPromise = ReturnType<typeof getProducts>;

const formatToman = (n: number) => `${n.toLocaleString("fa-IR")} تومان`;

/** Merge the plural key (CSV) and the legacy single key into an array of slugs; empty → undefined. */
function mergeSlugs(csv?: string, single?: string): string[] | undefined {
  const out = new Set<string>();
  if (csv)
    csv
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean)
      .forEach((s) => out.add(s));
  if (single) out.add(single);
  return out.size ? [...out] : undefined;
}

/** Product count — inside Suspense so a skeleton shows during fetch, not an empty page. */
async function ProductsCount({ promise }: { promise: ProductsPromise }) {
  const { data: response } = await promise;
  const total = response?.total ?? 0;
  return (
    <h1 className="text-xl md:text-2xl font-bold text-foreground">
      {total.toLocaleString("fa-IR")} محصول
    </h1>
  );
}

/** The product list itself — inside Suspense; on filter change the skeleton appears immediately. */
async function ProductsSection({
  promise,
  filters,
}: {
  promise: ProductsPromise;
  filters: ProductFilterParams;
}) {
  const { data: response } = await promise;
  const products = response?.data ?? [];
  const total = response?.total ?? 0;
  const page = response?.page ?? 1;
  const limit = response?.limit ?? 10;
  const hasMore = page * limit < total;

  if (products.length === 0) {
    return (
      <div className="text-muted-foreground text-center py-16 rounded-2xl bg-muted/40 border border-border">
        محصولی با این مشخصات پیدا نشد.
      </div>
    );
  }

  return (
    <Products
      filters={filters}
      initialProducts={products}
      initialHasMore={hasMore}
      limit={10}
      gridClassName="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-5"
    />
  );
}

/** Placeholder for the product-count number while loading. */
function CountSkeleton() {
  return <div className="h-7 w-28 rounded-lg bg-muted animate-pulse" />;
}

/** Product grid skeleton — shown immediately after applying a filter. */
function ProductsGridSkeleton() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-5">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="rounded-2xl border border-border bg-card p-3">
          <div className="aspect-square rounded-xl bg-muted animate-pulse" />
          <div className="mt-3 h-4 w-3/4 rounded bg-muted animate-pulse" />
          <div className="mt-2 h-4 w-1/2 rounded bg-muted animate-pulse" />
        </div>
      ))}
    </div>
  );
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const sp = await searchParams;

  const categorySlugs = mergeSlugs(sp.categorySlugs, sp.categorySlug);
  const brandSlugs = mergeSlugs(sp.brandSlugs, sp.brandSlug);

  const filters = {
    search: sp.search || undefined,
    categorySlugs,
    brandSlugs,
    minPrice: sp.minPrice ? Number(sp.minPrice) : undefined,
    maxPrice: sp.maxPrice ? Number(sp.maxPrice) : undefined,
    inStock: sp.inStock === "true" ? true : undefined,
    hasDiscount: sp.hasDiscount === "true" ? true : undefined,
    sortBy: sp.sortBy || undefined,
    sortOrder: (sp.sortOrder as "ASC" | "DESC" | undefined) || undefined,
  };

  // We start fetching products here (without await) so it runs in parallel with categories/brands,
  // but it is consumed inside <Suspense> so the loading skeleton appears immediately on filter change.
  const productsPromise = getProducts({ ...filters, page: 1, limit: 10 });

  const [{ data: categories }, { data: brands }] = await Promise.all([
    getCategories(),
    getBrands(),
  ]);

  // Names of the selected categories/brands (for the chips and the title)
  const activeCategoryNames = (categorySlugs ?? [])
    .map((slug) => categories?.find((c) => c.slug === slug)?.name)
    .filter((n): n is string => !!n);
  const activeBrandNames = (brandSlugs ?? [])
    .map((slug) => brands?.find((b) => b.slug === slug)?.name)
    .filter((n): n is string => !!n);

  // Active filter labels
  const activeChips: string[] = [];
  activeCategoryNames.forEach((name) => activeChips.push(`دسته: ${name}`));
  activeBrandNames.forEach((name) => activeChips.push(`برند: ${name}`));
  if (filters.search) activeChips.push(`جستجو: «${filters.search}»`);
  if (filters.minPrice) activeChips.push(`از ${formatToman(filters.minPrice)}`);
  if (filters.maxPrice) activeChips.push(`تا ${formatToman(filters.maxPrice)}`);
  if (filters.inStock) activeChips.push("فقط موجود");
  if (filters.hasDiscount) activeChips.push("تخفیف‌دار");

  const heading =
    activeCategoryNames.length === 1
      ? activeCategoryNames[0]
      : activeBrandNames.length === 1 && activeCategoryNames.length === 0
      ? activeBrandNames[0]
      : activeCategoryNames.length > 1 || activeBrandNames.length > 1
      ? "محصولات فیلترشده"
      : filters.search
      ? `جستجو: «${filters.search}»`
      : "همه‌ی محصولات";

  // Unique key: on filter change the Suspense boundaries remount and the skeleton is shown immediately;
  // the infinite list also restarts from the server data.
  const productsKey = JSON.stringify(filters);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8" dir="rtl">
      <div className="mb-6 flex items-center gap-2 text-sm">
        <Link href="/" className="text-secondary hover:underline">
          خانه
        </Link>
        <span className="text-muted-foreground">/</span>
        <span className="font-bold text-secondary">{heading}</span>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Filter sidebar — laptop/tablet only */}
        <aside className="hidden lg:block w-72 shrink-0">
          <div className="sticky top-24 flex max-h-[calc(100vh-7rem)] flex-col rounded-2xl border border-border bg-card">
            <h2 className="flex items-center gap-2 text-lg font-bold text-foreground px-5 pt-5 pb-4 border-b border-border">
              <SlidersHorizontal className="w-4 h-4 text-secondary" />
              فیلترها
            </h2>
            <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5">
              <ProductFilters
                initialCategories={categories ?? []}
                initialBrands={brands ?? []}
              />
            </div>
          </div>
        </aside>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <Suspense key={`count:${productsKey}`} fallback={<CountSkeleton />}>
              <ProductsCount promise={productsPromise} />
            </Suspense>
            <div className="flex items-center gap-2">
              {/* Mobile filter button → Drawer */}
              <MobileFilterButton
                initialCategories={categories ?? []}
                initialBrands={brands ?? []}
              />
              <ProductSort />
            </div>
          </div>

          {/* Active filter labels */}
          {activeChips.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 mb-6">
              <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                <SlidersHorizontal className="w-3.5 h-3.5" />
                فیلترها:
              </span>
              {activeChips.map((chip) => (
                <span
                  key={chip}
                  className="text-xs bg-primary/20 text-secondary px-3 py-1 rounded-full border border-border"
                >
                  {chip}
                </span>
              ))}
              <Link
                href="/products"
                className="text-xs text-muted-foreground hover:text-red-500 underline underline-offset-4"
              >
                پاک کردن فیلترها
              </Link>
            </div>
          )}

          <Suspense key={productsKey} fallback={<ProductsGridSkeleton />}>
            <ProductsSection promise={productsPromise} filters={filters} />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
