import { getCategories, getProducts } from "@/lib/actions";
import { ProductCard } from "@/components/product-card";
import Link from "next/link";

export default async function CategoryPage({ params }: { params: { id: string } }) {
  const categories = await getCategories();
  const products = await getProducts();
  const category = categories.find((c) => c.id === params.id);
  const filtered = products.filter((p) => p.category === category?.name);

  if (!category) {
    return (
      <div className="p-8 text-center text-lg text-gray-500">دسته‌بندی پیدا نشد.</div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-8 flex items-center gap-2">
        <Link href="/" className="text-[#670626] hover:underline">خانه</Link>
        <span className="text-gray-400">/</span>
        <span className="font-bold text-[#670626]">{category.name}</span>
      </div>
      <h1 className="text-2xl md:text-3xl font-bold mb-6 text-[#670626]">{category.name}</h1>
      {filtered.length === 0 ? (
        <div className="text-gray-500 text-center py-12">محصولی در این دسته‌بندی وجود ندارد.</div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5">
          {filtered.map((product) => (
            <ProductCard
              key={product.id}
              id={product.id}
              title={product.title}
              price={product.price}
              imageUrl={product.images?.[0] || "/placeholder.svg"}
              originalPrice={product.originalPrice}
              discount={product.discount}
            />
          ))}
        </div>
      )}
    </div>
  );
}
