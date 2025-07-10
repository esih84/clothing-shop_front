"use client"

import { Swiper, SwiperSlide } from "swiper/react"
import { Navigation } from "swiper/modules"
import { OfferCard } from "@/components/offer-card"
import "swiper/css"
import "swiper/css/navigation"

interface Product {
  id: string
  title: string
  price: number
  originalPrice?: number
  discount?: number
  images: string[]
}

interface SwiperWrapperProps {
  products: Product[]
}

export function SwiperWrapper({ products }: SwiperWrapperProps) {
  return (
    <Swiper
      modules={[Navigation]}
      spaceBetween={12}
      slidesPerView="auto"
      navigation={{
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
      }}
      className="offers-swiper pl-6 md:pl-[200px]"
      wrapperClass="items-center"
    >
      {products.map((product) => (
        <SwiperSlide key={product.id} style={{ width: "auto" }}>
          <OfferCard
            id={product.id}
            title={product.title}
            price={product.price}
            originalPrice={product.originalPrice || product.price}
            discount={product.discount || 0}
            imageUrl={product.images[0]}
          />
        </SwiperSlide>
      ))}
    </Swiper>
  )
}
