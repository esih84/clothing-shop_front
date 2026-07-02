// components/swiper-wrapper.tsx
"use client";

import { AppSlider } from "@/shared/components/app-slider";
import { OfferCard } from "@/shared/components/offer-card";
import type { Product } from "@/types/product";

interface SwiperWrapperProps {
  products: Product[];
}

export function SwiperWrapper({ products }: SwiperWrapperProps) {
  return (
    <AppSlider
      items={products}
      getKey={(product) => product.id}
      navigation
      loop={products.length > 4}
      spaceBetween={12}
      slidesPerView="auto"
      className="offers-swiper"
      wrapperClassName="items-center"
      slideClassName="!w-auto"
      renderItem={(product) => {
        // پیدا کردن تخفیف فعال (اگر وجود داشته باشد)
        const activeDiscount = product.discounts?.find((d) => d.isActive);

        let finalPrice = product.basePrice;
        let discountPercent = 0;

        if (activeDiscount) {
          if (activeDiscount.type === "percentage") {
            discountPercent = activeDiscount.value;
            finalPrice =
              product.basePrice -
              (product.basePrice * activeDiscount.value) / 100;
          } else {
            finalPrice = product.basePrice - activeDiscount.value;
            discountPercent = Math.round(
              (activeDiscount.value / product.basePrice) * 100,
            );
          }
        }

        return (
          <OfferCard
            id={product.id}
            slug={product.slug}
            title={product.name}
            price={finalPrice}
            originalPrice={product.basePrice}
            discount={discountPercent}
            imageUrl={product.images?.[0]?.url || "/placeholder.png"}
          />
        );
      }}
    />
  );
}
