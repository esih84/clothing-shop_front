import OrderDetail from '@/shared/components/order/order-detail'
import { getOrderDetails } from '@/features/order/order-api'
export default async function OrderDetailPage({ params}: { params: Promise<{ id: string }> }) {
    const { id } = await params;
  console.log('Fetching order detail for id:', id)
  const { data: order, error } = await getOrderDetails(id)
  if (!order) {
    return <div className="p-6 text-center text-muted-foreground">سفارش مورد نظر یافت نشد.</div>
  }

  return <OrderDetail order={order} />
}
