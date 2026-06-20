/**
 * کلیدهای متمرکز React Query برای کل فروشگاه.
 * هر feature از این‌جا کلید می‌گیرد تا invalidate/کش یکدست بماند.
 */
export const queryKeys = {
  currentUser: ["current-user"] as const,
  cart: ["cart"] as const,
  products: ["products"] as const,
  wishlist: ["wishlist"] as const,
  orders: ["orders"] as const,
} as const;

// نام‌های مستعار پرکاربرد
export const CURRENT_USER_KEY = queryKeys.currentUser;
export const CART_KEY = queryKeys.cart;
