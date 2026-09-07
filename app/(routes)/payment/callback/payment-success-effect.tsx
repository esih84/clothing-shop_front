"use client";

import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useAppDispatch } from "@/shared/store/hooks";
import { clearCart } from "@/shared/store/slices/cartSlice";
import { CART_KEY } from "@/features/query-keys";

/**
 * The backend empties the server cart when the order is created, so by the time payment
 * succeeds there is nothing left to consume. This just brings the client in line: refetch the
 * (now empty) server cart and clear anything left in the guest Redux cart. Renders nothing.
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
