import type { Metadata } from "next";
import { getCategoryBySlug } from "@/features/category/category-api";
import { getProducts } from "@/features/product/product-api";
import { ProductCard } from "@/shared/components/product/product-card";
import { getDiscountInfo } from "@/shared/lib/discount";
import { categoryUrl } from "@/shared/lib/urls";
import Link from "next/link";

/**
 * Legacy category route. The canonical landing page for a category is
 * `/products?categorySlug=<slug>` (it has the filters, sorting and infinite scroll), so this page
 * is kept working for old inbound links but is marked noindex and canonicalises there.
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id: slug } = await params;
  const { data: category } = await getCategoryBySlug(slug);

  return {
    title: category?.name ?? "دسته‌بندی",
    robots: { index: false, follow: true },
    alternates: { canonical: categoryUrl(slug) },
  };
}

// The route param is actually the category slug (category-selector links to /categories/[slug])
export default async function CategoryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: slug } = await params;
  const { data: category } = await getCategoryBySlug(slug);

  if (!category) {
    return (
      <div className="p-8 text-center text-lg text-muted-foreground">
        دسته‌بندی پیدا نشد.
      </div>
    );
  }

  const { data: response } = await getProducts({
    categoryId: category.id,
    page: 1,
    limit: 24,
  });
  const products = response?.data ?? [];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-8 flex items-center gap-2">
        <Link href="/" className="text-secondary hover:underline">
          خانه
        </Link>
        <span className="text-muted-foreground">/</span>
        <span className="font-bold text-secondary">{category.name}</span>
      </div>
      <h1 className="text-2xl md:text-3xl font-bold mb-6 text-secondary">
        {category.name}
      </h1>
      {products.length === 0 ? (
        <div className="text-muted-foreground text-center py-12">
          محصولی در این دسته‌بندی وجود ندارد.
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5">
          {products.map((product) => {
            const { hasDiscount, finalPrice, originalPrice, percent } =
              getDiscountInfo(product);
            return (
              <ProductCard
                key={product.id}
                id={product.id}
                slug={product.slug}
                title={product.name}
                price={finalPrice}
                originalPrice={hasDiscount ? originalPrice : undefined}
                discount={hasDiscount ? percent : undefined}
                imageUrl={product.images?.[0]?.url || "/placeholder.svg"}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
