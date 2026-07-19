// ثبت سفارش دیگر به‌صورت مستقل انجام نمی‌شود؛ ساخت سفارش از روی سبد اکنون بخشی از
// چک‌اوت پرداخت است (features/payment → useCheckout). این فایل فقط نوع ورودی مشترک
// را نگه می‌دارد.

export type CreateOrderInput = {
  shippingAddress?: Record<string, unknown>;
  shippingMethod?: string;
};
