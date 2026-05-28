import React from 'react'
import { ChevronLeft, Package } from 'lucide-react'
import Link from 'next/link'
import { Order } from '@/lib/order'

export interface OrderItem {
  id: string
  productName: string
  quantity: number
  unitPrice: number
  totalPrice: number
  variantId?: string
  variantDetails?: Record<string, unknown>
}

export interface OrderDetailProps {
  order: Order
}

const OrderDetail: React.FC<OrderDetailProps> = ({ order }) => {
  if (!order) return null
  return (
    <div className="max-w-xl mx-auto p-4 space-y-6" style={{ direction: 'rtl' }}>
      <div className="flex items-center gap-2 mb-4">
        <Link href="/profile/orders" className="text-gray-400 hover:text-[#E3A7C4]">
          <ChevronLeft className="w-5 h-5" />
        </Link>
        <h2 className="font-bold text-lg text-gray-800">جزئیات سفارش #{order.id}</h2>
      </div>
      <div className="bg-white rounded-lg shadow p-4 border border-[#E3A7C4]/30">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 bg-[#ffbdc5]/20 border border-[#E3A7C4]/30 flex items-center justify-center flex-shrink-0">
            <Package className="w-5 h-5 text-[#670626]" />
          </div>
          <div className="text-right">
            <p className="font-medium text-gray-800 text-sm">سفارش #{order.id}</p>
            <p className="text-xs text-gray-500 mt-0.5">{order.date}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 mb-2">
          <span className={`text-xs font-medium px-2 py-0.5 ${order.statusColor}`}>
            {order.status}
          </span>
        </div>
        <div className="text-sm text-gray-700 mb-2">مبلغ کل: <span className="font-bold">{order.totalAmount} تومان</span></div>
        {order.discountAmount > 0 && (
          <div className="text-sm text-gray-700 mb-2">تخفیف: <span className="font-bold">{order.discountAmount} تومان</span></div>
        )}
        <div className="text-sm text-gray-700 mb-2">مبلغ نهایی: <span className="font-bold">{order.finalAmount} تومان</span></div>
        {order.couponCode && (
          <div className="text-sm text-gray-700 mb-2">کد تخفیف: <span className="font-medium">{order.couponCode}</span></div>
        )}
        {order.pointsRedeemed > 0 && (
          <div className="text-sm text-gray-700 mb-2">امتیاز مصرف شده: <span className="font-medium">{order.pointsRedeemed}</span></div>
        )}
        {order.shippingAddress && typeof order.shippingAddress.detail === 'string' && (
          <div className="text-sm text-gray-700 mb-2">آدرس: <span className="font-medium">{order.shippingAddress.detail}</span></div>
        )}
      </div>
      <div className="bg-white rounded-lg shadow p-4 border border-[#E3A7C4]/30">
        <h3 className="font-semibold text-base mb-3">محصولات سفارش</h3>
        <ul className="divide-y divide-gray-100">
          {order.items?.map((item) => (
            <li key={item.id} className="py-2 flex items-center gap-3">
              <div className="flex-1 text-right">
                <div className="font-medium text-gray-800">{item.productName}</div>
                <div className="text-xs text-gray-500">تعداد: {item.quantity}</div>
                <div className="text-xs text-gray-400">قیمت واحد: {item.unitPrice} تومان</div>
              </div>
              <div className="font-bold text-sm text-[#670626]">{item.totalPrice} تومان</div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default OrderDetail
