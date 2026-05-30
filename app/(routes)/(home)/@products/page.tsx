import { Products } from "@/components/product/products";
import { useGetProducts } from "@/lib/services/product/useServerProduct";

export default async function ProductsSection() {
  const { data: response } = await useGetProducts({ page: 1, limit: 12 });

  const products = response?.data ?? [];
  const total = response?.total ?? 0;
  const page = response?.page ?? 1;
  const limit = response?.limit ?? 12;

  const hasMore = page * limit < total;

  return (
    <div className="px-4 py-6 mx-auto">
      <div className="flex items-center gap-2 mb-4 md:mb-6">
        <div className="w-1 h-5 bg-[#670626]" />
        <h2 className="text-xl md:text-2xl md:font-lg font-bold">
          محصولات ویژه
        </h2>
      </div>

      <Products initialProducts={products} initialHasMore={hasMore} />
    </div>
  );
}
