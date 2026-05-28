import { NextResponse } from 'next/server'

// Mock data for demonstration
const orders = [
  {
    id: '۱۲۳۴۵',
    userId: 'user-1',
    status: 'delivered',
    statusColor: 'bg-[#ffbdc5]/40 text-[#670626]',
    date: '۱۲ اردیبهشت ۱۴۰۴',
    totalAmount: 1100000,
    discountAmount: 100000,
    finalAmount: 1000000,
    couponCode: 'OFF100',
    pointsRedeemed: 20,
    shippingAddress: { detail: 'تهران، خیابان آزادی، پلاک ۱۲۳' },
    items: [
      {
        id: 'item1',
        productName: 'تی‌شرت مردانه',
        quantity: 2,
        unitPrice: 250000,
        totalPrice: 500000,
      },
      {
        id: 'item2',
        productName: 'شلوار جین',
        quantity: 1,
        unitPrice: 600000,
        totalPrice: 600000,
      },
    ],
  },
  // ... more orders
]

export async function GET(request: Request) {
  // In real implementation, fetch from DB
  return NextResponse.json(orders)
}

export async function POST(request: Request) {
  // For creating new order (not implemented)
  return NextResponse.json({ message: 'Not implemented' }, { status: 501 })
}
