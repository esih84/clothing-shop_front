import Link from "next/link";
import { SwiperWrapper } from "@/components/swiper-wrapper";
import { useGetProducts } from "@/lib/services/product/useServerProduct";

export default async function OffersSection() {
  const { data: response } = await useGetProducts({
    page: 1,
    limit: 10,
    sortBy: "discount",
    sortOrder: "DESC",
  });
  const products = response?.data ?? [];

  if (!products.length) return null;

  return (
    <div className="mb-6 mx-auto">
      {/* Section header */}
      <div className="px-4 flex justify-between items-center mb-3">
        <div className="flex items-center gap-2">
          <div className="w-1 h-5 bg-[#670626]" />
          <h3 className="text-base font-bold tracking-wide">پیشنهادات ویژه</h3>
        </div>
        <Link
          href="/offers"
          className="text-xs text-[#670626] border-b border-[#670626]/40 pb-0.5"
        >
          مشاهده همه
        </Link>
      </div>

      <div className="px-4">
        <SwiperWrapper products={products} />
      </div>
    </div>
  );
}
