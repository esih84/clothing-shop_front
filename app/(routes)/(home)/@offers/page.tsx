import Link from "next/link";
import { SwiperWrapper } from "@/components/swiper-wrapper";
import { getDiscountedProducts } from "@/lib/actions";

export default async function OffersSection() {
  const discountedProducts = await getDiscountedProducts();

  if (discountedProducts.length === 0) {
    return null;
  }

  return (
    <div className="px-4 mb-6 mx-auto">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg sm:text-xl md:text-lg font-medium">
          Special Offers
        </h3>
        <Link href="/offers" className="text-xs sm:text-sm text-gray-500">
          See all
        </Link>
      </div>

      <div className="relative">
        <div className="h-full hidden w-[200px] bg-white md:flex justify-center items-center font-bold text-red-500 text-2xl z-20 absolute left-0 top-0">
          <h1>offers</h1>
        </div>

        <SwiperWrapper products={discountedProducts} />
      </div>
    </div>
  );
}
