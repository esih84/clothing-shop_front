"use client";

import { useMemo } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { cartService } from "./cart-api";
import { useAppDispatch, useAppSelector } from "@/shared/store/hooks";
import {
  addToCart as addToRedux,
  removeFromCart as removeFromRedux,
  updateQuantity as updateRedux,
  type CartItem as GuestCartItem,
} from "@/shared/store/slices/cartSlice";
import { useIsLoggedIn } from "@/features/auth/queries";
import { CART_KEY } from "@/features/query-keys";
import type { Cart } from "@/types/cart";

/** خط سبد به‌صورت نرمال‌شده برای نمایش (هم برای مهمان و هم سرور). */
export interface CartLine {
  /** کلید آیتم = productId */
  productId: string;
  /** فقط در سبد سرور؛ برای update/remove لازم است */
  serverItemId?: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl: string;
}

function useServerCart(enabled: boolean) {
  return useQuery<Cart | null>({
    queryKey: CART_KEY,
    enabled,
    staleTime: 1000 * 30,
    queryFn: async () => {
      try {
        const res = await cartService.getCart();
        return res.data.data;
      } catch {
        return null;
      }
    },
  });
}

/**
 * سبد یکپارچه: کاربر مهمان → Redux، کاربر واردشده → سبد سرور.
 * یک API مشترک (lines/add/updateQty/remove) برای هر دو حالت می‌دهد.
 */
export function useCart() {
  const isLoggedIn = useIsLoggedIn();
  const dispatch = useAppDispatch();
  const guestItems = useAppSelector((s) => s.cart.items);
  const qc = useQueryClient();
  const { data: serverCart } = useServerCart(isLoggedIn);

  const invalidate = () => qc.invalidateQueries({ queryKey: CART_KEY });

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
          price: product?.basePrice ?? 0,
          quantity: it.quantity,
          imageUrl: image,
        };
      });
    }
    return guestItems.map((it) => ({
      productId: it.id,
      name: it.name,
      price: it.price,
      quantity: it.quantity,
      imageUrl: it.imageUrl,
    }));
  }, [isLoggedIn, serverCart, guestItems]);

  const add = async (item: GuestCartItem) => {
    if (isLoggedIn) {
      await cartService.addItem(item.id, item.quantity);
      invalidate();
    } else {
      dispatch(addToRedux(item));
    }
  };

  const remove = async (line: CartLine) => {
    if (isLoggedIn) {
      if (line.serverItemId) {
        await cartService.removeItem(line.serverItemId);
        invalidate();
      }
    } else {
      dispatch(removeFromRedux({ id: line.productId }));
    }
  };

  const updateQty = async (line: CartLine, quantity: number) => {
    if (quantity < 1) return remove(line);
    if (isLoggedIn) {
      if (line.serverItemId) {
        await cartService.updateItem(line.serverItemId, quantity);
        invalidate();
      }
    } else {
      dispatch(updateRedux({ id: line.productId, quantity }));
    }
  };

  const subtotal = lines.reduce((acc, l) => acc + l.price * l.quantity, 0);
  const count = lines.reduce((acc, l) => acc + l.quantity, 0);

  return { isLoggedIn, lines, add, updateQty, remove, subtotal, count };
}
