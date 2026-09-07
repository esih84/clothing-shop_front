"use client";

import * as DialogPrimitive from "@radix-ui/react-dialog";
import { CheckCircle2, ChevronLeft, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import {
  Dialog,
  DialogClose,
  DialogDescription,
  DialogPortal,
  DialogTitle,
} from "@/shared/ui/dialog";
import { formatToman } from "@/shared/lib/utils";
import { getDiscountInfo } from "@/shared/lib/discount";
import type { Product } from "@/types/product";

interface AddedToCartDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Admin-curated suggestions. When empty the panel stays a plain confirmation. */
  products?: Product[];
}

/**
 * Non-modal confirmation panel shown after a product is added to the cart.
 * Mobile: fixed above the sticky add-to-cart bar. Desktop: bottom-left corner.
 *
 * The panel never covers the whole viewport: the header (including the go-to-cart link) stays
 * pinned and only the suggestion list scrolls.
 */
export function AddedToCartDialog({
  open,
  onOpenChange,
  products = [],
}: AddedToCartDialogProps) {
  const hasSuggestions = products.length > 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange} modal={false}>
      <DialogPortal>
        <DialogPrimitive.Content
          onInteractOutside={(e) => e.preventDefault()}
          onOpenAutoFocus={(e) => e.preventDefault()}
          className="fixed z-50 flex max-h-[70vh] flex-col overflow-hidden inset-x-3 bottom-[calc(env(safe-area-inset-bottom)+5.25rem)] lg:inset-x-auto lg:left-6 lg:bottom-6 lg:w-[28rem] lg:max-h-[calc(100vh-3rem)] rounded-2xl border border-border bg-card shadow-lg data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:slide-in-from-bottom-4 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 duration-300"
        >
          <DialogDescription className="sr-only">
            کالا به سبد خرید اضافه شد
          </DialogDescription>

          {/* Header row (RTL): X on the right, title next to it, go-to-cart link on the left */}
          <div className="flex shrink-0 items-center justify-between gap-3 p-4">
            <div className="flex items-center gap-2">
              <DialogClose className="shrink-0 rounded-md p-1 text-muted-foreground transition-colors hover:text-foreground">
                <X className="h-5 w-5" />
                <span className="sr-only">بستن</span>
              </DialogClose>

              <DialogTitle className="flex items-center gap-1.5 text-sm font-bold text-green-600 lg:text-base">
                <CheckCircle2 className="h-5 w-5 fill-green-600 text-white lg:h-6 lg:w-6" />
                کالا اضافه شد!
              </DialogTitle>
            </div>

            <Link
              href="/cart"
              onClick={() => onOpenChange(false)}
              className="flex shrink-0 items-center gap-1 rounded-xl bg-muted/50 px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted lg:px-4 lg:py-2.5"
            >
              برو به سبد خرید
              <ChevronLeft className="h-4 w-4" />
            </Link>
          </div>

          {hasSuggestions && (
            <>
              <p className="shrink-0 border-t border-border px-4 pb-2 pt-3 text-sm font-bold text-foreground lg:text-base">
                خرید رو کامل‌تر کن
              </p>

              {/* The only scrollable region — the header above stays pinned.
                  The cap is in px, not vh, so the list always ends on a whole number of rows:
                  a row is 88px on mobile (h-16 image + py-3) and 104px on lg (h-20 image).
                  17rem = three mobile rows plus a sliver of the fourth, which is what tells the
                  user there is more to scroll; 28rem fits four of the taller desktop rows.
                  `flex-1 min-h-0` still shrinks it further on very short viewports. */}
              <div className="min-h-0 flex-1 max-h-[17rem] lg:max-h-[28rem] divide-y divide-border overflow-y-auto overflow-x-hidden overscroll-contain px-4 pb-4">
                {products.map((product) => (
                  <SuggestionRow
                    key={product.id}
                    product={product}
                    onNavigate={() => onOpenChange(false)}
                  />
                ))}
              </div>
            </>
          )}
        </DialogPrimitive.Content>
      </DialogPortal>
    </Dialog>
  );
}

function SuggestionRow({
  product,
  onNavigate,
}: {
  product: Product;
  onNavigate: () => void;
}) {
  const primaryImage =
    product.images?.find((img) => img.isPrimary) ?? product.images?.[0];
  const { hasDiscount, finalPrice, originalPrice } = getDiscountInfo(product);

  // The row's `-mx-4 px-4` cancels the list's own padding so the hover fill and the divider
  // run edge to edge, the way a list row should.
  return (
    <Link
      prefetch
      href={`/product/${product.slug}`}
      onClick={onNavigate}
      className="-mx-4 flex items-center gap-3 px-4 py-3 transition-colors hover:bg-muted/40 active:opacity-70"
    >
      <div className="min-w-0 flex-1">
        <p className="line-clamp-2 text-xs leading-5 text-foreground lg:text-sm lg:leading-6">
          {product.name}
        </p>
        <div className="mt-1.5 flex items-center gap-2">
          <span className="text-sm font-bold text-secondary lg:text-base">
            {formatToman(finalPrice)}
          </span>
          {hasDiscount && (
            <span className="text-[10px] text-muted-foreground line-through lg:text-xs">
              {formatToman(originalPrice)}
            </span>
          )}
        </div>
      </div>

      <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl border border-border bg-primary/15 lg:h-20 lg:w-20">
        {primaryImage ? (
          <Image
            src={primaryImage.thumbnailUrl ?? primaryImage.url}
            alt={primaryImage.altText ?? product.name}
            fill
            sizes="(min-width: 1024px) 80px, 64px"
            className="object-cover"
          />
        ) : null}
      </div>
    </Link>
  );
}
