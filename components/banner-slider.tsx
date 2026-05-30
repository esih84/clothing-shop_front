// components/banner-slider.tsx
"use client";

import Link from "next/link";
import type { Banner } from "@/types/banner";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import Image from "next/image";
import "swiper/css";
import "swiper/css/pagination";

interface BannerSliderProps {
  banners: Banner[];
  mainPositions: string[];
  sidePositions: string[];
}

export function BannerSlider({
  banners,
  mainPositions,
  sidePositions,
}: BannerSliderProps) {
  const mainBanners = banners.filter((b) => mainPositions.includes(b.position));

  const sideBanners = banners.filter((b) => sidePositions.includes(b.position));

  if (!mainBanners.length && !sideBanners.length) return null;

  return (
    <div className="px-4 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
        {/* اسلایدر اصلی */}
        <div className="relative md:col-span-2 md:row-span-2 overflow-hidden rounded-xl">
          {mainBanners.length > 0 && (
            <Swiper
              modules={[Autoplay, Pagination]}
              autoplay={{ delay: 5000, disableOnInteraction: false }}
              pagination={{ clickable: true }}
              loop
              className="w-full h-[200px] sm:h-[250px] md:h-[350px] lg:h-[450px]"
            >
              {mainBanners.map((banner, idx) => (
                <SwiperSlide key={banner.id}>
                  <div className="relative w-full h-full">
                    <Image
                      src={banner.imageUrl || "/placeholder.svg"}
                      alt={banner.title}
                      fill
                      className="object-cover"
                      priority={idx === 0}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent z-10" />
                    <div className="absolute bottom-6 right-6 z-20 text-white">
                      <h2 className="text-xl font-bold">{banner.title}</h2>
                      {banner.description && (
                        <p className="text-sm opacity-80">
                          {banner.description}
                        </p>
                      )}
                      <Link
                        href={banner.link || "#"}
                        className="mt-3 inline-block bg-white text-black text-sm px-4 py-2 rounded-lg"
                      >
                        مشاهده
                      </Link>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          )}
        </div>

        {/* بنرهای کناری */}
        <div className="flex flex-col gap-2">
          {sideBanners.slice(0, 2).map((banner) => (
            <Link
              key={banner.id}
              href={banner.link || "#"}
              className="relative flex-1 overflow-hidden rounded-xl min-h-[140px]"
            >
              <Image
                src={banner.imageUrl || "/placeholder.svg"}
                alt={banner.title}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-black/40" />
              <div className="absolute bottom-4 right-4 text-white z-10">
                <h3 className="text-sm font-bold">{banner.title}</h3>
                {banner.description && (
                  <p className="text-xs opacity-80">{banner.description}</p>
                )}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
