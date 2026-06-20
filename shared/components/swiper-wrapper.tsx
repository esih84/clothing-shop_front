// components/swiper-wrapper.tsx
"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { OfferCard } from "@/shared/components/offer-card";
import "swiper/css";
import "swiper/css/navigation";
import type { Product } from "@/types/product";

interface SwiperWrapperProps {
  products: Product[];
}

export function SwiperWrapper({ products }: SwiperWrapperProps) {
  return (
    <Swiper
      modules={[Navigation]}
      spaceBetween={12}
      loop={products.length > 4}
      slidesPerView="auto"
      navigation
      className="offers-swiper"
      wrapperClass="items-center"
    >
      {products.map((product) => {
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
          <SwiperSlide key={product.id} style={{ width: "auto" }}>
            <OfferCard
              id={product.id}
              slug={product.slug}
              title={product.name}
              price={finalPrice}
              originalPrice={product.basePrice}
              discount={discountPercent}
              imageUrl={product.images?.[0]?.url || "/placeholder.png"}
            />
          </SwiperSlide>
        );
      })}
    </Swiper>
  );
}
