"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { cartService } from "./cart-api";
import { useAppDispatch, useAppSelector } from "@/shared/store/hooks";
import { clearCart as clearRedux } from "@/shared/store/slices/cartSlice";
import { CART_KEY } from "@/features/query-keys";

/** ادغام سبد مهمان (Redux) با سبد سرور پس از ورود. */
export function useMergeGuestCart() {
  const dispatch = useAppDispatch();
  const guestItems = useAppSelector((s) => s.cart.items);
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      for (const it of guestItems) {
        try {
          await cartService.addItem(it.id, it.quantity);
        } catch {
          // واریانت نامعتبر/ناموجود را نادیده می‌گیریم
        }
      }
    },
    onSuccess: () => {
      dispatch(clearRedux());
      qc.invalidateQueries({ queryKey: CART_KEY });
    },
  });
}
