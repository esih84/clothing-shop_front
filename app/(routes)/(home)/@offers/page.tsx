import Link from "next/link";
import { SwiperWrapper } from "@/shared/components/swiper-wrapper";
import { getDiscountedProducts } from "@/features/product/product-api";
import { getSiteSettings } from "@/features/settings/settings-api";

export default async function OffersSection() {
  const { home } = await getSiteSettings();

  // The backend returns only products with an active discount.
  const { data: response } = await getDiscountedProducts({
    page: 1,
    limit: 10,
  });
  const products = response?.data ?? [];

  // If there are no discounted products, the section is not shown at all.
  if (!products.length) return null;

  return (
    <div className="mb-6 mx-auto">
      {/* Section header */}
      <div className="px-3 sm:px-4 flex justify-between items-center mb-3">
        <div className="flex items-center gap-2">
          <div className="w-1 h-5 rounded-full bg-secondary" />
          <h3 className="text-base font-bold tracking-wide">{home.offersTitle}</h3>
        </div>
        <Link
          href="/offers"
          className="text-xs text-secondary border-b border-secondary/40 pb-0.5 hover:border-secondary transition-colors"
        >
          {home.viewAllLabel}
        </Link>
      </div>

      {/* Card layout similar to the categories section */}
      <div className="mx-3 sm:mx-4 rounded-3xl border bg-card/60 p-3">
        <SwiperWrapper products={products} />
      </div>
    </div>
  );
}
