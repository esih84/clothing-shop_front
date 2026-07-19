import Link from "next/link";
import { SwiperWrapper } from "@/shared/components/swiper-wrapper";
import { getDiscountedProducts } from "@/features/product/product-api";

export default async function OffersSection() {
  // بک‌اند فقط محصولات دارای تخفیف فعال را برمی‌گرداند.
  const { data: response } = await getDiscountedProducts({
    page: 1,
    limit: 10,
  });
  const products = response?.data ?? [];

  // اگر محصول تخفیف‌داری نبود، بخش کلاً نمایش داده نمی‌شود.
  if (!products.length) return null;

  return (
    <div className="mb-6 mx-auto">
      {/* Section header */}
      <div className="px-3 sm:px-4 flex justify-between items-center mb-3">
        <div className="flex items-center gap-2">
          <div className="w-1 h-5 rounded-full bg-[#1473E6]" />
          <h3 className="text-base font-bold tracking-wide">پیشنهادات ویژه</h3>
        </div>
        <Link
          href="products?hasDiscount=true"
          className="text-xs text-[#1473E6] border-b border-[#1473E6]/40 pb-0.5 hover:border-[#1473E6] transition-colors"
        >
          مشاهده همه
        </Link>
      </div>

      {/* کارت‌بندی مشابه بخش دسته‌بندی */}
      <div className="mx-3 sm:mx-4 rounded-3xl border bg-white/60 p-3">
        <SwiperWrapper products={products} />
      </div>
    </div>
  );
}
