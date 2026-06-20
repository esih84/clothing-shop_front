import { getCategoryBySlug } from "@/features/category/category-api";
import { getProducts } from "@/features/product/product-api";
import { ProductCard } from "@/shared/components/product/product-card";
import Link from "next/link";

// پارامتر مسیر در واقع slug دسته است (category-selector به /categories/[slug] لینک می‌دهد)
export default async function CategoryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: slug } = await params;
  const { data: category } = await getCategoryBySlug(slug);

  if (!category) {
    return (
      <div className="p-8 text-center text-lg text-gray-500">
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
        <span className="text-gray-400">/</span>
        <span className="font-bold text-secondary">{category.name}</span>
      </div>
      <h1 className="text-2xl md:text-3xl font-bold mb-6 text-secondary">
        {category.name}
      </h1>
      {products.length === 0 ? (
        <div className="text-gray-500 text-center py-12">
          محصولی در این دسته‌بندی وجود ندارد.
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
