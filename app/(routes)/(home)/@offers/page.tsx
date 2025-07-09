"use client"

import Link from "next/link"
import { Swiper, SwiperSlide } from "swiper/react"
import { Navigation } from "swiper/modules"
import { OfferCard } from "@/components/offer-card"
import { getDiscountedProducts } from "@/lib/actions"
import "swiper/css"
import "swiper/css/navigation"

export default async function OffersSection() {
  const discountedProducts = await getDiscountedProducts()

  if (discountedProducts.length === 0) {
    return null
  }

  return (
    <div className="px-4 mb-6 mx-auto">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg sm:text-xl md:text-lg font-medium">Special Offers</h3>
        <Link href="/offers" className="text-xs sm:text-sm text-gray-500">
          See all
        </Link>
      </div>

      <div className="relative">
        <div className="h-full hidden w-[200px] bg-white md:flex justify-center items-center font-bold text-red-500 text-2xl z-20 absolute left-0 top-0">
          <h1>offers</h1>
        </div>

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
          {discountedProducts.map((product) => (
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




      </div>
    </div>
  )
}
