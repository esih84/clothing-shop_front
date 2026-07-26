"use client";

import * as DialogPrimitive from "@radix-ui/react-dialog";
import { CheckCircle2, ChevronLeft, X } from "lucide-react";
import Link from "next/link";
import {
  Dialog,
  DialogClose,
  DialogDescription,
  DialogPortal,
  DialogTitle,
} from "@/shared/ui/dialog";

interface AddedToCartDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

/**
 * Non-modal confirmation panel shown after a product is added to the cart.
 * Mobile: fixed above the sticky add-to-cart bar. Desktop: bottom-left corner.
 * More sections (services, suggestions, ...) can be appended below the header row.
 */
export function AddedToCartDialog({ open, onOpenChange }: AddedToCartDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange} modal={false}>
      <DialogPortal>
        <DialogPrimitive.Content
          onInteractOutside={(e) => e.preventDefault()}
          onOpenAutoFocus={(e) => e.preventDefault()}
          className="fixed z-50 inset-x-3 bottom-[calc(env(safe-area-inset-bottom)+5.25rem)] lg:inset-x-auto lg:left-6 lg:bottom-6 lg:w-96 rounded-2xl border border-border bg-card p-4 shadow-lg data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:slide-in-from-bottom-4 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 duration-300"
        >
          <DialogDescription className="sr-only">
            کالا به سبد خرید اضافه شد
          </DialogDescription>

          {/* Header row (RTL): X on the right, title next to it, go-to-cart link on the left */}
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <DialogClose className="shrink-0 rounded-md p-1 text-muted-foreground transition-colors hover:text-foreground">
                <X className="h-5 w-5" />
                <span className="sr-only">بستن</span>
              </DialogClose>

              <DialogTitle className="flex items-center gap-1.5 text-sm font-bold text-green-600">
                <CheckCircle2 className="h-5 w-5 fill-green-600 text-white" />
                کالا اضافه شد!
              </DialogTitle>
            </div>

            <Link
              href="/cart"
              onClick={() => onOpenChange(false)}
              className="flex shrink-0 items-center gap-1 rounded-xl bg-muted/50 px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted"
            >
              برو به سبد خرید
              <ChevronLeft className="h-4 w-4" />
            </Link>
          </div>
        </DialogPrimitive.Content>
      </DialogPortal>
    </Dialog>
  );
}
