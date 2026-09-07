"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { cartService } from "./cart-api";
import { useAppDispatch, useAppSelector } from "@/shared/store/hooks";
import { removeManyFromCart } from "@/shared/store/slices/cartSlice";
import { CART_KEY } from "@/features/query-keys";
import type { Cart } from "@/types/cart";

/**
 * Merge the guest cart (Redux) with the server cart after login.
 *
 * The guest cart is only emptied for the lines the server actually accepted. The backend
 * silently skips products that are inactive or out of stock, so clearing everything
 * unconditionally used to leave the customer with no cart at all — locally *and* on the
 * server — which then stalled checkout. Whatever was skipped stays in the guest cart and
 * is reported to the customer.
 */
export function useMergeGuestCart() {
  const dispatch = useAppDispatch();
  const guestItems = useAppSelector((s) => s.cart.items);
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      if (guestItems.length === 0) {
        return { cart: null as Cart | null, sentIds: [] as string[] };
      }
      // One bulk request instead of a sequential add per item; the backend caps at stock and
      // skips unavailable items, then returns the fully merged cart.
      const sentIds = guestItems.map((it) => it.id);
      const res = await cartService.merge(
        guestItems.map((it) => ({ productId: it.id, quantity: it.quantity })),
      );
      return { cart: res.data.data, sentIds };
    },
    onSuccess: ({ cart, sentIds }) => {
      if (!cart) return; // Nothing was sent — never touch the guest cart.

      // Seed the cache from the merge response so no extra GET /cart round-trip is needed.
      qc.setQueryData(CART_KEY, cart);

      const accepted = new Set((cart.items ?? []).map((it) => it.productId));
      const merged = sentIds.filter((id) => accepted.has(id));
      if (merged.length) dispatch(removeManyFromCart({ ids: merged }));

      const dropped = guestItems.filter((it) => !accepted.has(it.id));
      if (dropped.length) {
        toast.error(
          dropped.length === 1
            ? `«${dropped[0].name}» ناموجود است و به سبد خرید شما منتقل نشد.`
            : `${dropped.length} کالا ناموجود است و به سبد خرید شما منتقل نشد.`,
        );
      }
    },
  });
}
