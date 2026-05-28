export enum OrderStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  PROCESSING = 'processing',
  SHIPPED = 'shipped',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled',
  REFUNDED = 'refunded',
}

export interface OrderItem {
  id: string
  orderId: string
  variantId?: string
  productName: string
  variantDetails?: Record<string, unknown>
  quantity: number
  unitPrice: number
  totalPrice: number
}

export interface Order {
  id: string
  userId: string
  user?: any
  items: OrderItem[]
  totalAmount: number
  discountAmount: number
  finalAmount: number
  couponCode?: string
  pointsRedeemed: number
  status: OrderStatus
  statusColor?: string
  date: string
  shippingAddress?: Record<string, unknown>
  createdAt: string
  updatedAt: string
}

// Mock data for demonstration
const orders: Order[] = [
  {
    id: '12345',
    userId: 'user-1',
    status: OrderStatus.DELIVERED,
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
        orderId: '12345',
        productName: 'تی‌شرت مردانه',
        quantity: 2,
        unitPrice: 250000,
        totalPrice: 500000,
      },
      {
        id: 'item2',
        orderId: '12345',
        productName: 'شلوار جین',
        quantity: 1,
        unitPrice: 600000,
        totalPrice: 600000,
      },
    ],
    createdAt: '2024-05-01T10:00:00Z',
    updatedAt: '2024-05-02T10:00:00Z',
  },
  // ... more orders
]

export async function getUserOrders(userId: string): Promise<Order[]> {
  // In real implementation, fetch from DB or API
  return orders.filter((o) => o.userId === userId)
}

export async function getOrderDetail(orderId: string): Promise<Order | undefined> {
  // In real implementation, fetch from DB or API
  return orders.find((o) => o.id === orderId)
}
