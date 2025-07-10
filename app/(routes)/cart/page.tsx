"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks"
import { SwipeableCartItem } from "@/components/swipeable-cart-item"

export default function CartPage() {
  const dispatch = useAppDispatch()
  const { items, total } = useAppSelector((state) => state.cart)
  const [isCheckingOut, setIsCheckingOut] = useState(false)

  const handleCheckout = async () => {
    setIsCheckingOut(true)
    // Simulate checkout process
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setIsCheckingOut(false)
    // Here you would typically redirect to payment or show success
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Your cart is empty</h1>
          <p className="text-gray-600 mb-6">Add some items to get started</p>
          <Link href="/">
            <Button>Continue Shopping</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="flex items-center justify-between p-4">
          <Link href="/" className="flex items-center gap-2">
            <ArrowLeft className="w-5 h-5" />
            <span>Back</span>
          </Link>
          <h1 className="text-lg font-semibold">Shopping Cart</h1>
          <div className="w-16" /> {/* Spacer for centering */}
        </div>
      </div>

      <div className="p-4 pb-32">
        {/* Cart Items */}
        <div className="space-y-4 mb-6">
          {items.map((item) => (
            <SwipeableCartItem key={`${item.id}-${item.size}-${item.color || "default"}`} {...item} />
          ))}
        </div>

        {/* Order Summary */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <h3 className="font-semibold mb-4">Order Summary</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Subtotal ({items.length} items)</span>
                <span>${total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>Free</span>
              </div>
              <div className="border-t pt-2 flex justify-between font-bold">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Fixed Checkout Button */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4">
        <Button className="w-full" size="lg" onClick={handleCheckout} disabled={isCheckingOut}>
          {isCheckingOut ? "Processing..." : `Checkout • $${total.toFixed(2)}`}
        </Button>
      </div>
    </div>
  )
}
