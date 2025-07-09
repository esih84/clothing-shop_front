"use client"

import { SwiperSlider } from "@/components/swiper-slider"
import type { Banner } from "@/lib/actions"

interface BannerSliderProps {
  banners: Banner[]
}

export function BannerSlider({ banners }: BannerSliderProps) {
  return (
    <div className="px-4 mb-6 mx-auto">
      <div className="relative rounded-xl overflow-hidden">
        <SwiperSlider
          images={banners.map((banner) => banner.imageUrl || "/placeholder.svg")}
          alt="Banner"
          autoplay={true}
          loop={true}
          aspectRatio="banner"
          pagination={true}
          navigation={false}
          slideClassName="relative"
        />

        {banners.map((banner, index) => (
          <div
            key={index}
            className="absolute inset-0 bg-black/30 flex flex-col justify-end p-3 sm:p-4 z-10 swiper-no-swiping"
            style={{ display: "none" }}
            id={`banner-content-${index}`}
          >
            <h2 className="text-white text-base xs:text-lg sm:text-xl font-semibold">{banner.title}</h2>
            <p className="text-white text-xs sm:text-sm">{banner.subtitle}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
