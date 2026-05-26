// components/banner-slider.tsx
"use client"

import Link from "next/link"
import type { Banner } from "@/lib/actions"
import { use } from "react"
import { Swiper, SwiperSlide } from "swiper/react"
import { Autoplay, Pagination } from "swiper/modules"
import Image from "next/image"
import "swiper/css"
import "swiper/css/pagination"

interface BannerSliderProps {
  bannersData: Promise<Banner[]>
}

export function BannerSlider({ bannersData }: BannerSliderProps) {
  const banners = use(bannersData)
  if (!banners.length) return null

  const [main, ...rest] = banners

  return (
    <div className="px-4 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
        {/* Main banner with slide text */}
        <div className="relative md:col-span-2 md:row-span-2 overflow-hidden">
          <Swiper
            modules={[Autoplay, Pagination]}
            autoplay={{ delay: 5000, disableOnInteraction: false }}
            pagination={{ clickable: true }}
            loop
            className="w-full h-[200px] sm:h-[250px] md:h-[350px] lg:h-[450px]"
          >
            {[main, ...rest.slice(0, 2)].map((banner, idx) => (
              <SwiperSlide key={banner.id}>
                <div className="relative w-full h-full">
                  <Image
                    src={banner.imageUrl || "/placeholder.svg"}
                    alt={banner.title}
                    fill
                    className="object-cover"
                    priority={idx === 0}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#670626]/80 to-transparent z-10" />
                  <div className="absolute bottom-4 right-4 z-20 text-white">
                    <span className="text-xs bg-white/20 px-2 py-1 rounded-full">پیشنهاد ویژه</span>
                    <h2 className="text-lg font-bold mt-1">{banner.title}</h2>
                    <p className="text-sm opacity-80">{banner.subtitle}</p>
                    <Link
                      href="/shop"
                      className="mt-2 inline-block bg-white text-[#670626] text-sm px-4 py-1.5 rounded-full font-medium"
                    >
                      خرید کنید
                    </Link>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {/* Secondary banners */}
        {rest.slice(0, 2).map((banner, idx) => (
          <div key={idx} className="relative overflow-hidden min-h-[120px] md:min-h-0 bg-[#670626]">
            <Image
              src={banner.imageUrl || "/placeholder.svg?height=160&width=300"}
              alt={banner.title}
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#670626]/85 via-[#670626]/20 to-transparent flex flex-col justify-end p-4">
              <h3 className="text-white text-sm md:text-base font-bold leading-tight mb-0.5">{banner.title}</h3>
              <p className="text-white/70 text-xs">{banner.subtitle}</p></div>
          </div>
        ))}
      </div>
    </div>
  )
}
