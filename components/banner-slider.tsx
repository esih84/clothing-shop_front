"use client"

import Image from "next/image"
import Link from "next/link"
import type { Banner } from "@/lib/actions"
import { use } from "react"

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
        {/* Main large banner — spans 2 cols on desktop */}
        <div className="relative overflow-hidden min-h-[200px] md:min-h-[320px] md:col-span-2 md:row-span-2 bg-[#670626]">
          <Image
            src={main.imageUrl || "/placeholder.svg?height=320&width=600"}
            alt={main.title}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#670626]/90 via-[#670626]/30 to-transparent flex flex-col justify-end p-5">
            <span className="text-[#ffbdc5] text-[11px] font-semibold tracking-widest uppercase mb-1">
              پیشنهاد ویژه
            </span>
            <h2 className="text-white text-xl md:text-2xl font-bold mb-1 leading-snug">
              {main.title}
            </h2>
            <p className="text-white/75 text-sm mb-4">{main.subtitle}</p>
            <Link
              href="/shop"
              className="self-start bg-white text-[#670626] text-sm font-bold px-5 py-2 hover:bg-[#ffbdc5] transition-colors"
            >
              خرید کنید
            </Link>
          </div>
        </div>

        {/* Secondary banners stacked */}
        {rest.slice(0, 2).map((banner, idx) => (
          <div
            key={idx}
            className="relative overflow-hidden min-h-[120px] md:min-h-0 bg-[#670626]"
          >
            <Image
              src={banner.imageUrl || "/placeholder.svg?height=160&width=300"}
              alt={banner.title}
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#670626]/85 via-[#670626]/20 to-transparent flex flex-col justify-end p-4">
              <h3 className="text-white text-sm md:text-base font-bold leading-tight mb-0.5">
                {banner.title}
              </h3>
              <p className="text-white/70 text-xs">{banner.subtitle}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
