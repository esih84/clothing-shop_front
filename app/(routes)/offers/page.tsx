import { getDiscountedProducts } from "@/features/product/product-api";
import { ProductCard } from "@/shared/components/product/product-card";
import { getDiscountInfo } from "@/shared/lib/discount";

export const metadata = {
  title: "پیشنهادهای ویژه",
  description: "محصولات تخفیف‌دار",
};

export default async function OffersPage() {
  // The backend returns only products with an active discount.
  const { data: response } = await getDiscountedProducts({ page: 1, limit: 48 });
  const products = response?.data ?? [];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl md:text-3xl font-bold mb-6 text-secondary">
        پیشنهادهای ویژه
      </h1>

      {products.length === 0 ? (
        <div className="text-muted-foreground text-center py-12">
          در حال حاضر محصول تخفیف‌داری وجود ندارد.
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
