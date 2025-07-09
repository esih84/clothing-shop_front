"use client"

import { useState } from "react"
import { Heart, Minus, Plus, Trash2 } from "lucide-react"
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks"
import { addToCart, updateQuantity, removeFromCart } from "@/lib/store/cartSlice"
import { toggleWishlist } from "@/lib/store/wishlistSlice"
import type { Product } from "@/lib/actions"

interface ProductActionsProps {
  product: Product
}

export function ProductActions({ product }: ProductActionsProps) {
  const [selectedSize, setSelectedSize] = useState(product.sizes[0] || "M")
  const [quantity, setQuantity] = useState(1)
  const dispatch = useAppDispatch()
  const cartItems = useAppSelector((state) => state.cart.items)
  const wishlistItems = useAppSelector((state) => state.wishlist.items)
  const isInWishlist = wishlistItems.some((item) => item.id === product.id)

  // Find if this product with the selected size is already in the cart
  const cartItem = cartItems.find((item) => item.id === product.id && item.size === selectedSize)
  const isInCart = !!cartItem

  const handleToggleWishlist = () => {
    dispatch(
      toggleWishlist({
        id: product.id,
        name: product.title,
        price: product.price,
        imageUrl: product.images[0],
        brand: product.brand.name,
        location: product.store.name,
      }),
    )
  }

  const handleAddToCart = () => {
    dispatch(
      addToCart({
        id: product.id,
        name: product.title,
        size: selectedSize,
        price: product.price,
        quantity: quantity,
        imageUrl: product.images[0],
      }),
    )
  }

  const handleUpdateQuantity = (newQuantity: number) => {
    if (newQuantity < 1) return

    if (isInCart) {
      dispatch(updateQuantity({ id: product.id, quantity: newQuantity }))
    }
    setQuantity(newQuantity)
  }

  const handleRemoveFromCart = () => {
    dispatch(removeFromCart({ id: product.id }))
    setQuantity(1)
  }

  const incrementQuantity = () => {
    const newQuantity = isInCart ? (cartItem?.quantity || 0) + 1 : quantity + 1
    if (isInCart) {
      dispatch(updateQuantity({ id: product.id, quantity: newQuantity }))
    } else {
      setQuantity(newQuantity)
    }
  }

  const decrementQuantity = () => {
    if (isInCart && cartItem?.quantity === 1) {
      handleRemoveFromCart()
      return
    }

    const newQuantity = isInCart ? (cartItem?.quantity || 0) - 1 : quantity - 1
    if (newQuantity >= 1) {
      if (isInCart) {
        dispatch(updateQuantity({ id: product.id, quantity: newQuantity }))
      } else {
        setQuantity(newQuantity)
      }
    }
  }

  return (
    <>
      <button onClick={handleToggleWishlist}>
        <Heart className={`w-5 h-5 sm:w-6 sm:h-6 ${isInWishlist ? "fill-red-500 text-red-500" : ""}`} />
      </button>

      {/* Fixed Button Area */}
      <div className="fixed bottom-0 left-0 right-0 bg-white p-4 border-t z-40">
        <div className="max-w-2xl mx-auto">
          {isInCart ? (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button onClick={decrementQuantity} className="bg-gray-100 p-2 sm:p-3 rounded-full">
                  {cartItem?.quantity <= 1 ? (
                    <Trash2 className="w-4 h-4 sm:w-5 sm:h-5 text-red-500" />
                  ) : (
                    <Minus className="w-4 h-4 sm:w-5 sm:h-5" />
                  )}
                </button>
                <span className="text-lg sm:text-xl font-bold w-8 sm:w-10 text-center">{cartItem?.quantity || 0}</span>
                <button onClick={incrementQuantity} className="bg-indigo-600 p-2 sm:p-3 rounded-full text-white">
                  <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              </div>
              <div className="text-lg sm:text-xl font-bold">
                ${(product.price * (cartItem?.quantity || 0)).toFixed(2)}
              </div>
            </div>
          ) : (
            <button
              onClick={handleAddToCart}
              className="w-full bg-indigo-600 text-white py-3 sm:py-4 rounded-lg font-bold text-base sm:text-lg"
            >
              Add to Cart
            </button>
          )}
        </div>
      </div>
    </>
  )
}
