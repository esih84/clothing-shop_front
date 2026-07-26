"use client";

import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useAppDispatch } from "@/shared/store/hooks";
import { clearCart } from "@/shared/store/slices/cartSlice";
import { CART_KEY } from "@/features/query-keys";

/**
 * After a successful payment the backend has already emptied the server cart. The checkout
 * flow intentionally left the cart cache untouched until payment succeeded (ACID flow), so
 * here we complete that deferred step: refetch the (now empty) server cart and clear the
 * guest Redux cart. Renders nothing.
 */
export default function PaymentSuccessEffect() {
  const qc = useQueryClient();
  const dispatch = useAppDispatch();

  useEffect(() => {
    void qc.invalidateQueries({ queryKey: CART_KEY });
    dispatch(clearCart());
  }, [qc, dispatch]);

  return null;
}
