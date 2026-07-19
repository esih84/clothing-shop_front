import { notFound } from "next/navigation";
import { ProductDetails } from "@/shared/components/product/product-details";
import { getProductBySlug, getProducts } from "@/features/product/product-api";
import { getCategories } from "@/features/category/category-api";
import { collectRelatedCategorySlugs } from "@/shared/lib/related-categories";

interface ProductPageProps {
  params: Promise<{ id: string }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params;
  const [{ data: product }, { data: categoryTree }] = await Promise.all([
    getProductBySlug(id),
    getCategories(),
  ]);
  if (!product) {
    notFound();
  }

  // محصولات مرتبط بر اساس دسته‌ی فعلی + والد + فرزندان.
  const relatedSlugs = collectRelatedCategorySlugs(product, categoryTree);
  const { data: relatedResult } = await getProducts(
    relatedSlugs.length
      ? { categorySlugs: relatedSlugs, limit: 21 }
      : { limit: 20 },
  );
  const relatedProducts = (relatedResult?.data ?? [])
    .filter((p) => p.id !== product.id)
    .slice(0, 20);

  const moreHref = relatedSlugs.length
    ? `/products?categorySlugs=${relatedSlugs.join(",")}`
    : "/products";

  return (
    <ProductDetails
      product={product}
      relatedProducts={relatedProducts}
      moreHref={moreHref}
    />
  );
}
