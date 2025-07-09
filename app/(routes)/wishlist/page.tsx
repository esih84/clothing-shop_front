"use client"

import { useAppSelector, useAppDispatch } from "@/lib/store/hooks"
import { removeFromWishlist } from "@/lib/store/wishlistSlice"
import { MapPin, Trash2, Heart } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export default function WishlistPage() {
  const wishlistItems = useAppSelector((state) => state.wishlist.items)
  const dispatch = useAppDispatch()

  const handleRemoveItem = (id: string) => {
    dispatch(removeFromWishlist({ id }))
  }

  return (
    <div className="pb-20 pt-16 mx-auto max-w-6xl">
      <div className="space-y-3 sm:space-y-4 px-4 mt-4">
        {wishlistItems.length > 0 ? (
          wishlistItems.map((item) => (
            <div
              key={item.id}
              className="wishlist-item bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100"
            >
              <div className="flex p-3 sm:p-4 md:p-6 items-center">
                <div className="mr-3 sm:mr-4 md:mr-6">
                  <Image
                    src={item.imageUrl || "/placeholder.svg"}
                    alt={item.name}
                    width={120}
                    height={120}
                    className="wishlist-item-image rounded-xl object-cover w-[60px] h-[60px] sm:w-[80px] sm:h-[80px] md:w-[100px] md:h-[100px] lg:w-[120px] lg:h-[120px]"
                  />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-sm sm:text-base md:text-lg lg:text-xl">{item.name}</h3>
                      <div className="flex items-center text-gray-500 text-xs sm:text-sm md:text-base mt-1">
                        <MapPin className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                        <span>{item.location || "In Store"}</span>
                      </div>
                    </div>
                    <button onClick={() => handleRemoveItem(item.id)} className="p-1">
                      <Trash2 className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-gray-400" />
                    </button>
                  </div>
                  <div className="flex justify-between items-center mt-2 md:mt-4">
                    <p className="text-sm sm:text-base md:text-lg lg:text-xl font-bold">${item.price.toFixed(2)}</p>
                    <Link href={`/product/${item.id}`}>
                      <button className="bg-[#d8f5b4] px-3 sm:px-4 md:px-6 py-1.5 sm:py-2 md:py-3 rounded-full font-medium text-xs sm:text-sm md:text-base">
                        View Item
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="bg-red-100 p-4 rounded-full mb-4">
              <Heart className="w-8 h-8 md:w-10 md:h-10 text-red-500" />
            </div>
            <h2 className="text-xl md:text-2xl font-medium mb-2">Your wishlist is empty</h2>
            <p className="text-gray-500 text-center mb-6 text-base md:text-lg">
              Looks like you haven't added anything to your wishlist yet.
            </p>
            <Link
              href="/"
              className="bg-red-500 text-white px-6 py-3 md:px-8 md:py-4 rounded-full font-medium inline-block text-base md:text-lg"
            >
              Start wishing
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
