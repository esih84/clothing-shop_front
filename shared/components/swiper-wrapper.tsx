// components/swiper-wrapper.tsx
"use client";

import { AppSlider } from "@/shared/components/app-slider";
import { OfferCard } from "@/shared/components/offer-card";
import type { Product } from "@/types/product";
import { getDiscountInfo } from "@/shared/lib/discount";

interface SwiperWrapperProps {
  products: Product[];
}

export function SwiperWrapper({ products }: SwiperWrapperProps) {
  return (
    <AppSlider
      items={products}
      getKey={(product) => product.id}
      dir="rtl"
      navigation
      loop={products.length > 4}
      spaceBetween={12}
      slidesPerView="auto"
      className="offers-swiper"
      wrapperClassName="items-center"
      slideClassName="!w-auto"
      renderItem={(product) => {
        // اطلاعات تخفیف از فیلدهای محاسبه‌شده‌ی بک‌اند
        const { finalPrice, originalPrice, percent } = getDiscountInfo(product);

        return (
          <OfferCard
            id={product.id}
            slug={product.slug}
            title={product.name}
            price={finalPrice}
            originalPrice={originalPrice}
            discount={percent}
            imageUrl={product.images?.[0]?.url || "/placeholder.png"}
          />
        );
      }}
    />
  );
}
