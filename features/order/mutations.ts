// Placing an order is no longer done independently; building an order from the cart is now part of
// the checkout payment flow (features/payment → useCheckout). This file only keeps the
// shared input type.

export type CreateOrderInput = {
  shippingAddress?: Record<string, unknown>;
  shippingMethod?: string;
};
