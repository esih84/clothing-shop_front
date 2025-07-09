"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Swiper, SwiperSlide } from "swiper/react"
import { FreeMode } from "swiper/modules"

interface Category {
  id: string
  name: string
  slug: string
  imageUrl: string
}

interface CategorySelectorProps {
  categories: Category[]
}

export function CategorySelector({ categories }: CategorySelectorProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div className="py-4 px-4">
      <h2 className="text-xl font-bold mb-4">Categories</h2>
      <Swiper modules={[FreeMode]} spaceBetween={12} slidesPerView="auto" freeMode={true} className="categories-swiper">
        {categories.map((category) => (
          <SwiperSlide key={category.id} className="!w-auto">
            <Link href={`/category/${category.slug}`}>
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 md:w-20 md:h-20 bg-gray-100 rounded-full overflow-hidden mb-2">
                  <Image
                    src={category.imageUrl || "/placeholder.svg?height=80&width=80"}
                    alt={category.name}
                    width={80}
                    height={80}
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="text-sm md:text-base font-medium text-center">{category.name}</span>
              </div>
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  )
}
