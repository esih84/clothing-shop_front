import Link from "next/link";
import { SwiperWrapper } from "@/components/swiper-wrapper";
import { productService } from "@/lib/services/product";

export default async function OffersSection() {
  const { data } = await productService.findAll({
    page: 1,
    limit: 10,
    sortBy: "discount",
    sortOrder: "DESC",
  });
  if (data.length === 0) return null;

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
        <SwiperWrapper products={data} />
      </div>
    </div>
  );
}
