import { Products } from "@/shared/components/product/products";
import { getProducts } from "@/features/product/product-api";

export default async function ProductsSection() {
  const { data: response } = await getProducts({ page: 1, limit: 10 });
  const products = response?.data ?? [];
  const total = response?.total ?? 0;
  const page = response?.page ?? 1;
  const limit = response?.limit ?? 10;

  const hasMore = page * limit < total;
  if (!products.length) return null;

  return (
    <div className="px-4 py-6 mx-auto">
      <div className="flex items-center gap-2 mb-4 md:mb-6">
        <div className="w-1 h-5 bg-secondary" />
        <h2 className="text-xl md:text-2xl md:font-lg font-bold">
          محصولات ویژه
        </h2>
      </div>

      <Products
        initialProducts={products}
        initialHasMore={hasMore}
        limit={10}
        maxItems={20}
        moreHref="/products"
      />
    </div>
  );
}
