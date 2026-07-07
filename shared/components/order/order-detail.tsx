import React from 'react'
import { ChevronLeft, Package } from 'lucide-react'
import Link from 'next/link'
import { Order } from '@/types/order'

export interface OrderDetailProps {
  order: Order
}

const statusInfo: Record<string, { label: string; className: string }> = {
  pending: { label: 'در انتظار', className: 'bg-yellow-100 text-yellow-700' },
  confirmed: { label: 'تأیید شده', className: 'bg-blue-100 text-blue-700' },
  processing: { label: 'در حال پردازش', className: 'bg-blue-100 text-blue-700' },
  shipped: { label: 'ارسال شده', className: 'bg-indigo-100 text-indigo-700' },
  delivered: { label: 'تحویل شده', className: 'bg-green-100 text-green-700' },
  cancelled: { label: 'لغو شده', className: 'bg-red-100 text-red-700' },
  refunded: { label: 'مرجوع شده', className: 'bg-gray-100 text-gray-700' },
}

const OrderDetail: React.FC<OrderDetailProps> = ({ order }) => {
  if (!order) return null
  const status = statusInfo[order.status] ?? {
    label: order.status,
    className: 'bg-gray-100 text-gray-700',
  }
  const orderLabel = order.orderNumber ?? `#${order.id.slice(0, 8)}`
  return (
    <div className="max-w-xl mx-auto p-4 space-y-6" style={{ direction: 'rtl' }}>
      <div className="flex items-center gap-2 mb-4">
        <Link href="/profile/orders" className="text-gray-400 hover:text-[#A9CBF5]">
          <ChevronLeft className="w-5 h-5" />
        </Link>
        <h2 className="font-bold text-lg text-gray-800" dir="ltr">جزئیات سفارش {orderLabel}</h2>
      </div>
      <div className="bg-white rounded-lg shadow p-4 border border-[#A9CBF5]/30">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 bg-[#FDE68A]/20 border border-[#A9CBF5]/30 flex items-center justify-center flex-shrink-0">
            <Package className="w-5 h-5 text-[#1473E6]" />
          </div>
          <div className="text-right">
            <p className="font-medium text-gray-800 text-sm" dir="ltr">سفارش {orderLabel}</p>
            <p className="text-xs text-gray-500 mt-0.5">
              {new Date(order.createdAt).toLocaleDateString('fa-IR')}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 mb-2">
          <span
            className={`text-xs font-medium px-2 py-0.5 rounded-full ${status.className}`}
          >
            {status.label}
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
      <div className="bg-white rounded-lg shadow p-4 border border-[#A9CBF5]/30">
        <h3 className="font-semibold text-base mb-3">محصولات سفارش</h3>
        <ul className="divide-y divide-gray-100">
          {order.items?.map((item) => (
            <li key={item.id} className="py-2 flex items-center gap-3">
              <div className="flex-1 text-right">
                <div className="font-medium text-gray-800">{item.productName}</div>
                <div className="text-xs text-gray-500">تعداد: {item.quantity}</div>
                <div className="text-xs text-gray-400">قیمت واحد: {item.unitPrice} تومان</div>
              </div>
              <div className="font-bold text-sm text-[#1473E6]">{item.totalPrice} تومان</div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default OrderDetail
