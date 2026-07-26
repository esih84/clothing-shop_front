/**
 * Centralized React Query keys for the whole storefront.
 * Each feature gets its keys from here so invalidation/caching stays consistent.
 */
export const queryKeys = {
  currentUser: ["current-user"] as const,
  cart: ["cart"] as const,
  products: ["products"] as const,
  wishlist: ["wishlist"] as const,
  orders: ["orders"] as const,
  addresses: ["addresses"] as const,
  pets: ["pets"] as const,
} as const;

// Commonly used aliases
export const CURRENT_USER_KEY = queryKeys.currentUser;
export const CART_KEY = queryKeys.cart;
