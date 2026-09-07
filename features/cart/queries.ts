"use client";

import { useMemo } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { cartService } from "./cart-api";
import { useAppDispatch, useAppSelector } from "@/shared/store/hooks";
import {
  addToCart as addToRedux,
  removeFromCart as removeFromRedux,
  updateQuantity as updateRedux,
  type CartItem as GuestCartItem,
} from "@/shared/store/slices/cartSlice";
import { useIsLoggedIn } from "@/features/auth/queries";
import { CART_KEY, queryKeys } from "@/features/query-keys";
import { getApiErrorMessage } from "@/shared/api/get-error-message";
import type { Cart, CartLineAvailability } from "@/types/cart";

/** Normalized cart line for display (for both guest and server). */
export interface CartLine {
  /** Item key = productId */
  productId: string;
  /** Only in the server cart; required for update/remove */
  serverItemId?: string;
  name: string;
  /** Payable price (with discount if any). */
  price: number;
  /** Base price; if greater than price it has a discount and should be shown struck through. */
  originalPrice: number;
  quantity: number;
  imageUrl: string;
  /** Stock quantity; for capping the max in the UI. */
  stock?: number;
}

function useServerCart(enabled: boolean) {
  return useQuery<Cart | null>({
    queryKey: CART_KEY,
    enabled,
    staleTime: 1000 * 30,
    // Errors are deliberately not swallowed into `null`: callers (checkout) must be able to
    // tell "the cart is empty" apart from "the cart could not be loaded".
    queryFn: async () => {
      const res = await cartService.getCart();
      return res.data.data;
    },
  });
}

/**
 * Unified cart: guest user → Redux, logged-in user → server cart.
 * Provides one shared API (lines/add/updateQty/remove) for both cases.
 *
 * The server path is pessimistic: it waits for the server response, then updates
 * via refetch. During the request, the corresponding line's control is disabled
 * (isLinePending/isAdding) and errors are shown with a toast.
 */
export function useCart() {
  const isLoggedIn = useIsLoggedIn();
  const dispatch = useAppDispatch();
  const guestItems = useAppSelector((s) => s.cart.items);
  const qc = useQueryClient();
  const {
    data: serverCart,
    isPending: isServerCartPending,
    isError: isServerCartError,
  } = useServerCart(isLoggedIn);

  const onError = (err: unknown) => {
    toast.error(getApiErrorMessage(err));
  };
  // The mutation response already carries the full updated cart, so we write it straight into
  // the cache instead of triggering a second GET /cart round-trip.
  const setCart = (res: { data: { data: Cart } }) => {
    qc.setQueryData(CART_KEY, res.data.data);
  };

  const addMutation = useMutation({
    mutationFn: (item: GuestCartItem) =>
      cartService.addItem(item.id, item.quantity),
    onSuccess: setCart,
    onError,
  });

  const updateMutation = useMutation({
    mutationFn: ({ line, quantity }: { line: CartLine; quantity: number }) =>
      cartService.updateItem(line.serverItemId!, quantity),
    onSuccess: setCart,
    onError,
  });

  const removeMutation = useMutation({
    mutationFn: (line: CartLine) => cartService.removeItem(line.serverItemId!),
    onSuccess: setCart,
    onError,
  });

  const lines: CartLine[] = useMemo(() => {
    if (isLoggedIn) {
      return (serverCart?.items ?? []).map((it) => {
        const product = it.product;
        const image =
          product?.images?.find((im) => im.isPrimary)?.url ??
          product?.images?.[0]?.url ??
          "/placeholder.svg";
        return {
          productId: it.productId,
          serverItemId: it.id,
          name: product?.name ?? "محصول",
          price: product?.discountedPrice ?? product?.basePrice ?? 0,
          originalPrice: product?.basePrice ?? 0,
          quantity: it.quantity,
          imageUrl: image,
          stock: product?.stock,
        };
      });
    }
    return guestItems.map((it) => ({
      productId: it.id,
      name: it.name,
      price: it.price,
      originalPrice: it.originalPrice ?? it.price,
      quantity: it.quantity,
      imageUrl: it.imageUrl,
      stock: it.stock,
    }));
  }, [isLoggedIn, serverCart, guestItems]);

  const add = async (item: GuestCartItem) => {
    if (isLoggedIn) {
      // mutateAsync so callers can await success (e.g. to show a confirmation)
      await addMutation.mutateAsync(item);
    } else {
      dispatch(addToRedux(item));
    }
  };

  const remove = async (line: CartLine) => {
    if (isLoggedIn) {
      if (line.serverItemId) removeMutation.mutate(line);
    } else {
      dispatch(removeFromRedux({ id: line.productId }));
    }
  };

  const updateQty = async (line: CartLine, quantity: number) => {
    if (quantity < 1) return remove(line);
    if (isLoggedIn) {
      if (line.serverItemId) updateMutation.mutate({ line, quantity });
    } else {
      dispatch(updateRedux({ id: line.productId, quantity }));
    }
  };

  // Id of the product currently being updated/removed on the server (to disable that line's control).
  const pendingProductId =
    (updateMutation.isPending
      ? updateMutation.variables?.line.productId
      : undefined) ??
    (removeMutation.isPending ? removeMutation.variables?.productId : undefined);

  /** true if a server operation for this line is in progress (pessimistic → the control must be disabled). */
  const isLinePending = (line: CartLine) =>
    isLoggedIn && line.productId === pendingProductId;

  const subtotal = lines.reduce((acc, l) => acc + l.price * l.quantity, 0);
  const count = lines.reduce((acc, l) => acc + l.quantity, 0);

  // The guest cart is synchronous, so only the server cart can be "not known yet".
  const isCartLoading = isLoggedIn && isServerCartPending;
  /**
   * true once `lines` reflects reality — i.e. the server cart has either arrived or failed.
   * Checkout needs this to avoid treating a still-loading cart as an empty one.
   */
  const isCartSettled = !isCartLoading;

  return {
    isLoggedIn,
    lines,
    add,
    updateQty,
    remove,
    subtotal,
    count,
    /** true if adding to the cart is in progress (for the button state). */
    isAdding: addMutation.isPending,
    isLinePending,
    isCartLoading,
    isCartSettled,
    /** true if loading the server cart failed (distinct from an empty cart). */
    isCartError: isLoggedIn && isServerCartError,
  };
}

/**
 * Live availability for the given cart lines.
 *
 * The guest cart stores each product's stock in localStorage at the moment it was added and never
 * refreshes it, so an item can look perfectly fine in the cart long after it went out of stock or
 * was deactivated — and the customer would only discover it when the order is placed, right after
 * entering their OTP. This asks the server what is actually orderable so the cart and checkout
 * pages can say so up front.
 */
export function useCartAvailability(lines: CartLine[]) {
  const items = useMemo(
    () => lines.map((l) => ({ productId: l.productId, quantity: l.quantity })),
    [lines],
  );
  // Keyed by the line contents so the answer is refetched whenever the cart changes.
  const signature = items.map((i) => `${i.productId}:${i.quantity}`).join(",");

  const { data } = useQuery<CartLineAvailability[]>({
    queryKey: [...queryKeys.cartAvailability, signature],
    enabled: items.length > 0,
    staleTime: 1000 * 30,
    queryFn: async () => {
      const res = await cartService.validate(items);
      return res.data.data;
    },
  });

  return useMemo(() => {
    const byProduct = new Map((data ?? []).map((a) => [a.productId, a]));
    // Unknown (still loading, or the check failed) counts as available: the server rejects a bad
    // line at order time anyway, and blocking checkout on a failed check would be worse.
    const unavailable = lines.filter(
      (l) => byProduct.get(l.productId)?.available === false,
    );
    return {
      availabilityByProduct: byProduct,
      unavailableLines: unavailable,
      hasUnavailable: unavailable.length > 0,
      isAvailable: (line: CartLine) =>
        byProduct.get(line.productId)?.available !== false,
    };
  }, [data, lines]);
}
