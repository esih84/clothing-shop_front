import { Products } from "@/components/product/products";
import { productService } from "@/lib/services/product";

export default async function ProductsSection() {
  const { data, total, page, limit } = await productService.findAll({
    page: 1,
    limit: 12,
  });

  const hasMore = page * limit < total;

  return (
    <div className="px-4 py-6 mx-auto">
      <div className="flex items-center gap-2 mb-4 md:mb-6">
        <div className="w-1 h-5 bg-[#670626]" />
        <h2 className="text-xl md:text-2xl md:font-lg font-bold">
          محصولات ویژه
        </h2>
      </div>

      <Products initialProducts={data} initialHasMore={hasMore} />
    </div>
  );
}
