"use client"

import { useState } from "react"
import Image from "next/image"
import { Package, Truck, Calendar, MapPin, CreditCard, Edit } from "lucide-react"
import { OrderStatusModal } from "@/components/modals/order-status-modal"

// Mock function to get order data
const getOrder = (orderId: string) => {
  // In a real app, this would fetch from an API
  return {
    id: orderId,
    customer: {
      name: "John Smith",
      email: "john.smith@example.com",
      phone: "+1 (555) 123-4567",
    },
    date: "May 1, 2025",
    status: "processing",
    shippingAddress: {
      street: "123 Main St",
      city: "Anytown",
      state: "CA",
      zip: "12345",
      country: "USA",
    },
    paymentMethod: "Credit Card (Visa ending in 4242)",
    items: [
      {
        id: "1",
        name: "Men's Casual Jacket",
        price: 89.99,
        quantity: 1,
        imageUrl: "/placeholder.svg?height=80&width=80",
      },
      {
        id: "2",
        name: "Leather Belt",
        price: 29.99,
        quantity: 2,
        imageUrl: "/placeholder.svg?height=80&width=80",
      },
    ],
    subtotal: 149.97,
    shipping: 10.0,
    tax: 12.0,
    total: 171.97,
  }
}

export default function OrderDetailPage({ params }: { params: { shopId: string; orderId: string } }) {
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false)
  const order = getOrder(params.orderId)

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "processing":
        return "bg-blue-100 text-blue-800"
      case "shipped":
        return "bg-purple-100 text-purple-800"
      case "completed":
        return "bg-[#d8f5b4] text-green-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100"
    }
  }

  return (
    <div className="pb-20">
      {/* Order Content */}
      <div className="p-4 space-y-6">
        {/* Status and Date */}
        <div className="flex justify-between items-center">
          <div>
            <span className={`inline-block px-3 py-1 rounded-full text-sm ${getStatusBadgeClass(order.status)}`}>
              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
            </span>
          </div>
          <button onClick={() => setIsStatusModalOpen(true)} className="flex items-center text-sm text-blue-600">
            <Edit className="w-4 h-4 mr-1" />
            Update Status
          </button>
        </div>

        {/* Order Info */}
        <div className="bg-white p-4 rounded-xl shadow-sm space-y-4">
          <div className="flex items-center">
            <Calendar className="w-5 h-5 text-gray-500 mr-2" />
            <div>
              <p className="text-sm text-gray-500">Order Date</p>
              <p className="font-medium">{order.date}</p>
            </div>
          </div>

          <div className="flex items-center">
            <Package className="w-5 h-5 text-gray-500 mr-2" />
            <div>
              <p className="text-sm text-gray-500">Order Status</p>
              <p className="font-medium capitalize">{order.status}</p>
            </div>
          </div>

          <div className="flex items-center">
            <Truck className="w-5 h-5 text-gray-500 mr-2" />
            <div>
              <p className="text-sm text-gray-500">Estimated Delivery</p>
              <p className="font-medium">May 5 - May 8, 2025</p>
            </div>
          </div>
        </div>

        {/* Customer Info */}
        <div className="bg-white p-4 rounded-xl shadow-sm">
          <h2 className="font-bold mb-3">Customer Information</h2>
          <div className="space-y-2">
            <p>{order.customer.name}</p>
            <p className="text-sm text-gray-500">{order.customer.email}</p>
            <p className="text-sm text-gray-500">{order.customer.phone}</p>
          </div>
        </div>

        {/* Shipping Address */}
        <div className="bg-white p-4 rounded-xl shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-bold">Shipping Address</h2>
            <MapPin className="w-5 h-5 text-gray-500" />
          </div>
          <div className="space-y-1 text-sm text-gray-600">
            <p>{order.shippingAddress.street}</p>
            <p>
              {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zip}
            </p>
            <p>{order.shippingAddress.country}</p>
          </div>
        </div>

        {/* Payment Method */}
        <div className="bg-white p-4 rounded-xl shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-bold">Payment Method</h2>
            <CreditCard className="w-5 h-5 text-gray-500" />
          </div>
          <p className="text-sm text-gray-600">{order.paymentMethod}</p>
        </div>

        {/* Order Items */}
        <div className="bg-white p-4 rounded-xl shadow-sm">
          <h2 className="font-bold mb-3">Order Items</h2>
          <div className="space-y-4">
            {order.items.map((item) => (
              <div key={item.id} className="flex items-center">
                <Image
                  src={item.imageUrl || "/placeholder.svg"}
                  alt={item.name}
                  width={60}
                  height={60}
                  className="rounded-lg mr-3"
                />
                <div className="flex-1">
                  <h3 className="font-medium">{item.name}</h3>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Qty: {item.quantity}</span>
                    <span className="font-bold">${item.price.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Order Summary */}
        <div className="bg-white p-4 rounded-xl shadow-sm">
          <h2 className="font-bold mb-3">Order Summary</h2>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Subtotal</span>
              <span>${order.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Shipping</span>
              <span>${order.shipping.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Tax</span>
              <span>${order.tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-bold mt-2 pt-2 border-t">
              <span>Total</span>
              <span>${order.total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Status Modal */}
      <OrderStatusModal
        isOpen={isStatusModalOpen}
        onClose={() => setIsStatusModalOpen(false)}
        currentStatus={order.status}
        orderId={params.orderId}
      />
    </div>
  )
}
