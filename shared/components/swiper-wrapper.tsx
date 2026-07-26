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
  // Like the categories section: only when it exceeds the largest breakpoint's capacity (desktop = 5)
  // enable sliding/autoplay, so we don't get jitter/jumps with few cards.
  const canSlide = products.length >= 5;

  return (
    <AppSlider
      items={products}
      getKey={(product) => product.id}
      dir="rtl"
      autoplay={canSlide ? 3.5 : false}
      loop={canSlide}
      spaceBetween={8}
      slidesPerView={2}
      breakpoints={{
        0: { slidesPerView: 2, spaceBetween: 8 },
        640: { slidesPerView: 3, spaceBetween: 8 },
        1024: { slidesPerView: 5, spaceBetween: 8 },
      }}
      className="offers-swiper"
      wrapperClassName="items-stretch"
      renderItem={(product) => {
        // Discount info from the backend's computed fields
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
