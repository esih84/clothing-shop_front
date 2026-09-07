/**
 * Centralized React Query keys for the whole storefront.
 * Each feature gets its keys from here so invalidation/caching stays consistent.
 */
export const queryKeys = {
  currentUser: ["current-user"] as const,
  cart: ["cart"] as const,
  products: ["products"] as const,
  /** Header autocomplete for one (debounced) query string. */
  productSuggest: (query: string) => ["products", "suggest", query] as const,
  wishlist: ["wishlist"] as const,
  orders: ["orders"] as const,
  addresses: ["addresses"] as const,
  pets: ["pets"] as const,
  reviews: ["reviews"] as const,
  /** All review data for one product — list, summary, own review and own votes. */
  productReviews: (productId: string) => ["reviews", productId] as const,
  productReviewList: (productId: string, sort: string) =>
    ["reviews", productId, "list", sort] as const,
  productReviewSummary: (productId: string) =>
    ["reviews", productId, "summary"] as const,
  myProductReview: (productId: string) =>
    ["reviews", productId, "mine"] as const,
  myProductReviewVotes: (productId: string) =>
    ["reviews", productId, "my-votes"] as const,
} as const;

// Commonly used aliases
export const CURRENT_USER_KEY = queryKeys.currentUser;
export const CART_KEY = queryKeys.cart;
