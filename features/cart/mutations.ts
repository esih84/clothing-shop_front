"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { cartService } from "./cart-api";
import { useAppDispatch, useAppSelector } from "@/shared/store/hooks";
import { clearCart as clearRedux } from "@/shared/store/slices/cartSlice";
import { CART_KEY } from "@/features/query-keys";

/** Merge the guest cart (Redux) with the server cart after login. */
export function useMergeGuestCart() {
  const dispatch = useAppDispatch();
  const guestItems = useAppSelector((s) => s.cart.items);
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      if (guestItems.length === 0) return null;
      // One bulk request instead of a sequential add per item; the backend caps at stock and
      // skips unavailable items, then returns the fully merged cart.
      const res = await cartService.merge(
        guestItems.map((it) => ({ productId: it.id, quantity: it.quantity })),
      );
      return res.data.data;
    },
    onSuccess: (cart) => {
      dispatch(clearRedux());
      // Seed the cache from the merge response so no extra GET /cart round-trip is needed.
      if (cart) qc.setQueryData(CART_KEY, cart);
    },
  });
}
