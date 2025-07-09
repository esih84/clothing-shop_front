"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import { Swiper, SwiperSlide } from "swiper/react"
import { Navigation, Pagination, Autoplay, Thumbs } from "swiper/modules"
import type { Swiper as SwiperType } from "swiper"
import "swiper/css"
import "swiper/css/navigation"
import "swiper/css/pagination"
import "swiper/css/thumbs"

interface SwiperSliderProps {
  images: string[]
  alt: string
  autoplay?: boolean
  loop?: boolean
  thumbs?: boolean
  navigation?: boolean
  pagination?: boolean
  className?: string
  slideClassName?: string
  aspectRatio?: "square" | "video" | "banner" | "auto"
  onSlideChange?: (index: number) => void
}

export function SwiperSlider({
  images,
  alt,
  autoplay = false,
  loop = true,
  thumbs = false,
  navigation = true,
  pagination = true,
  className = "",
  slideClassName = "",
  aspectRatio = "square",
  onSlideChange,
}: SwiperSliderProps) {
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperType | null>(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const swiperRef = useRef<SwiperType | null>(null)

  // Determine aspect ratio class
  const getAspectRatioClass = () => {
    switch (aspectRatio) {
      case "square":
        return "aspect-square"
      case "video":
        return "aspect-video"
      case "banner":
        return "h-[120px] xs:h-[150px] sm:h-[180px] md:h-[250px] lg:h-[400px]"
      case "auto":
        return "h-auto"
      default:
        return "aspect-square"
    }
  }

  useEffect(() => {
    if (onSlideChange) {
      onSlideChange(activeIndex)
    }
  }, [activeIndex, onSlideChange])

  return (
    <div className={`relative ${className}`}>
      <Swiper
        modules={[Navigation, Pagination, Autoplay, Thumbs]}
        spaceBetween={0}
        slidesPerView={1}
        navigation={navigation}
        pagination={pagination ? { clickable: true } : false}
        loop={loop}
        autoplay={autoplay ? { delay: 5000, disableOnInteraction: false } : false}
        thumbs={thumbs ? { swiper: thumbsSwiper } : undefined}
        onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
        onSwiper={(swiper) => (swiperRef.current = swiper)}
        className={`w-full ${getAspectRatioClass()}`}
      >
        {images.map((image, index) => (
          <SwiperSlide key={index} className={slideClassName}>
            <Image
              src={image || "/placeholder.svg"}
              alt={`${alt} - Image ${index + 1}`}
              fill
              className="object-cover"
              priority={index === 0}
            />
          </SwiperSlide>
        ))}
      </Swiper>

      {thumbs && images.length > 1 && (
        <div className="mt-2">
          <Swiper
            modules={[Thumbs]}
            spaceBetween={10}
            slidesPerView={4}
            watchSlidesProgress={true}
            onSwiper={setThumbsSwiper}
            className="thumbs-swiper"
          >
            {images.map((image, index) => (
              <SwiperSlide key={index} className="cursor-pointer">
                <div className="relative h-20 w-full">
                  <Image
                    src={image || "/placeholder.svg"}
                    alt={`${alt} - Thumbnail ${index + 1}`}
                    fill
                    className={`object-cover border-2 rounded ${
                      activeIndex === index ? "border-black" : "border-transparent"
                    }`}
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      )}
    </div>
  )
}
