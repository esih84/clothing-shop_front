"use client"

import type React from "react"
import Link from "next/link"
import Image from "next/image"
import { Heart, Star } from "lucide-react"
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks"
import { toggleWishlist } from "@/lib/store/wishlistSlice"

interface OfferCardProps {
  id: string
  title: string
  price: number
  originalPrice: number
  discount: number
  imageUrl: string
  rating?: number
}

export function OfferCard({ id, title, price, originalPrice, discount, imageUrl, rating }: OfferCardProps) {
  const dispatch = useAppDispatch()
  const wishlistItems = useAppSelector((state) => state.wishlist.items)
  const isInWishlist = wishlistItems.some((item) => item.id === id)

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    dispatch(
      toggleWishlist({
        id,
        name: title,
        price,
        imageUrl,
        brand: "Brand",
        location: "In Store",
      }),
    )
  }

  return (
    <Link href={`/product/${id}`} className="min-w-[160px] sm:min-w-[180px] md:min-w-[220px] flex-shrink-0">
      <div className="relative">
        <div className="absolute top-2 left-2 z-10 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
          -{discount}%
        </div>
        <button
          onClick={handleToggleWishlist}
          className="absolute top-2 right-2 z-10 p-1 bg-white/80 rounded-full hover:bg-white transition-colors"
        >
          <Heart className={`w-4 h-4 sm:w-5 sm:h-5 ${isInWishlist ? "fill-red-500 text-red-500" : "text-gray-400"}`} />
        </button>
        <Image
          src={imageUrl || "/placeholder.svg"}
          alt={title}
          width={220}
          height={200}
          className="rounded-xl w-full h-[140px] xs:h-[160px] sm:h-[180px] md:h-[200px] object-cover"
        />
      </div>
      <div className="p-2">
        <div className="flex justify-between items-start mb-1">
          <div>
            <p className="font-bold text-sm sm:text-base">${price.toFixed(2)}</p>
            <p className="text-xs text-gray-500 line-through">${originalPrice.toFixed(2)}</p>
          </div>
          {rating && (
            <div className="flex items-center gap-1">
              <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
              <span className="text-xs text-gray-600">{rating}</span>
            </div>
          )}
        </div>
        <p className="text-xs sm:text-sm text-gray-600 truncate">{title}</p>
      </div>
    </Link>
  )
}
