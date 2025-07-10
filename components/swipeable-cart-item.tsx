"use client"

import { useState } from "react"
import Image from "next/image"
import { Swiper, SwiperSlide } from "swiper/react"
import { Minus, Plus, Trash2 } from "lucide-react"
import { useAppDispatch } from "@/lib/store/hooks"
import { removeFromCart, updateQuantity } from "@/lib/store/cartSlice"
import "swiper/css"

interface SwipeableCartItemProps {
  id: string
  name: string
  price: number
  quantity: number
  imageUrl: string
  size: string
  color?: string
}

export function SwipeableCartItem({ id, name, price, quantity, imageUrl, size, color }: SwipeableCartItemProps) {
  const dispatch = useAppDispatch()
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  const handleRemove = () => {
    setShowDeleteConfirm(true)
  }

  const confirmRemove = () => {
    dispatch(removeFromCart({ id, size, color }))
    setShowDeleteConfirm(false)
  }

  const cancelRemove = () => {
    setShowDeleteConfirm(false)
  }

  const incrementQuantity = () => {
    dispatch(updateQuantity({ id, size, color, quantity: quantity + 1 }))
  }

  const decrementQuantity = () => {
    if (quantity > 1) {
      dispatch(updateQuantity({ id, size, color, quantity: quantity - 1 }))
    }
  }

  // Map color names to tailwind classes
  const getColorClass = (color: string) => {
    const colorMap: Record<string, string> = {
      black: "bg-black",
      white: "bg-white border border-gray-300",
      gray: "bg-gray-400",
      silver: "bg-gray-300",
      blue: "bg-blue-600",
      navy: "bg-blue-900",
      brown: "bg-amber-800",
      green: "bg-green-600",
      red: "bg-red-600",
      pink: "bg-pink-500",
      purple: "bg-purple-600",
    }
    return colorMap[color.toLowerCase()] || "bg-gray-200"
  }

  return (
    <div className="relative mb-4">
      <Swiper
        slidesPerView={1}
        allowTouchMove={true}
        className="cart-item-swiper"
        initialSlide={0}
        onSlideChange={(swiper) => {
          if (swiper.activeIndex === 1) {
            handleRemove()
          }
        }}
      >
        <SwiperSlide>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="flex gap-4">
              <div className="relative w-20 h-20 md:w-24 md:h-24 rounded-lg overflow-hidden flex-shrink-0">
                <Image src={imageUrl || "/placeholder.svg"} alt={name} fill className="object-cover" />
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-sm md:text-base">{name}</h3>
                {(color || size) && (
                  <div className="flex items-center gap-2 mt-1">
                    {color && (
                      <div className="flex items-center gap-1">
                        <div className={`w-3 h-3 rounded-full ${getColorClass(color)}`}></div>
                        <span className="text-xs text-gray-500">{color}</span>
                      </div>
                    )}
                    {color && size && <span className="text-xs text-gray-500">|</span>}
                    {size && (
                      <div className="flex items-center gap-1">
                        <span className="text-xs text-gray-500">Size: {size}</span>
                      </div>
                    )}
                  </div>
                )}
                <div className="flex justify-between items-center mt-3">
                  <span className="font-bold text-base md:text-lg">${price.toFixed(2)}</span>
                  <div className="flex items-center border rounded-full overflow-hidden">
                    <button
                      onClick={decrementQuantity}
                      className="px-3 py-1 md:px-4 md:py-2 bg-gray-100 hover:bg-gray-200 transition-colors"
                      disabled={quantity <= 1}
                    >
                      <Minus className="w-3 h-3 md:w-4 md:h-4" />
                    </button>
                    <span className="px-3 md:px-4 text-sm md:text-base">{quantity}</span>
                    <button
                      onClick={incrementQuantity}
                      className="px-3 py-1 md:px-4 md:py-2 bg-gray-100 hover:bg-gray-200 transition-colors"
                    >
                      <Plus className="w-3 h-3 md:w-4 md:h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div className="bg-red-500 h-full flex items-center justify-center rounded-xl">
            <Trash2 className="text-white w-6 h-6" />
          </div>
        </SwiperSlide>
      </Swiper>

      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden">
            <div className="p-6">
              <h3 className="text-xl font-bold text-center mb-4">Remove From Cart?</h3>
              <div className="bg-gray-50 rounded-xl p-4 mb-6">
                <div className="flex gap-3">
                  <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                    <Image src={imageUrl || "/placeholder.svg"} alt={name} fill className="object-cover" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-sm">{name}</h3>
                    {(color || size) && (
                      <div className="flex items-center gap-2 mt-1">
                        {color && (
                          <div className="flex items-center gap-1">
                            <div className={`w-3 h-3 rounded-full ${getColorClass(color)}`}></div>
                            <span className="text-xs text-gray-500">{color}</span>
                          </div>
                        )}
                        {color && size && <span className="text-xs text-gray-500">|</span>}
                        {size && (
                          <div className="flex items-center gap-1">
                            <span className="text-xs text-gray-500">Size: {size}</span>
                          </div>
                        )}
                      </div>
                    )}
                    <div className="flex justify-between items-center mt-2">
                      <span className="font-bold">${price.toFixed(2)}</span>
                      <span className="text-sm text-gray-500">Qty: {quantity}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={cancelRemove}
                  className="flex-1 py-3 px-4 bg-gray-200 rounded-full font-medium text-gray-800"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmRemove}
                  className="flex-1 py-3 px-4 bg-black text-white rounded-full font-medium"
                >
                  Yes, Remove
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
