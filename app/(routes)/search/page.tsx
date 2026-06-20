import Link from "next/link";
import { getProducts } from "@/features/product/product-api";
import { ProductCard } from "@/shared/components/product/product-card";
import { ProductSort } from "@/shared/components/product/product-sort";

interface SearchPageProps {
  searchParams: Promise<Record<string, string | undefined>>;
}

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

  const { data: response } = await getProducts(filters);
  const products = response?.data ?? [];
  const total = response?.total ?? 0;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8" dir="rtl">
      <div className="mb-6 flex items-center gap-2 text-sm">
        <Link href="/" className="text-secondary hover:underline">
          خانه
        </Link>
        <span className="text-gray-400">/</span>
        <span className="font-bold text-secondary">
          {sp.search ? `جستجو: «${sp.search}»` : "همه‌ی محصولات"}
        </span>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <h1 className="text-xl md:text-2xl font-bold text-foreground">
          {total.toLocaleString("fa-IR")} محصول
        </h1>
        <ProductSort />
      </div>

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
