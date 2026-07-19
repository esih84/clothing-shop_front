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
  // مثل بخش دسته‌بندی: فقط وقتی از ظرفیت بیشترین بریک‌پوینت (دسکتاپ=۵) بیشتر باشد
  // اسلاید/autoplay فعال شود تا در تعداد کم کارت‌ها لرزش/پرش نداشته باشیم.
  const canSlide = products.length > 5;

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
