"use client";

import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/shared/ui/drawer";
import { ProductFilters } from "@/shared/components/product/product-filters";
import type { Category } from "@/types/category";
import type { Brand } from "@/types/brand";

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialCategories?: Category[];
  initialBrands?: Brand[];
}

/**
 * Mobile version of the filter panel — the same `ProductFilters` inside a Drawer.
 * On laptop/tablet, the sidebar on the `/products` page is shown instead.
 */
export function FilterModal({
  isOpen,
  onClose,
  initialCategories,
  initialBrands,
}: FilterModalProps) {
  return (
    <Drawer open={isOpen} onOpenChange={onClose}>
      <DrawerContent className="h-[90vh] md:h-full w-full max-w-md mx-auto md:mx-0 shadow-2xl bg-card">
        <div className="mx-auto w-full max-w-md flex flex-col h-full">
          <DrawerHeader>
            <DrawerTitle className="flex items-center gap-2 text-lg font-bold text-secondary">
              فیلتر محصولات
            </DrawerTitle>
            <DrawerDescription className="text-xs text-muted-foreground text-right">
              بر اساس نام، دسته‌بندی و قیمت، محصولات را فیلتر کنید
            </DrawerDescription>
          </DrawerHeader>

          <div className="p-4 overflow-y-auto flex-1">
            <ProductFilters
              onApplied={onClose}
              initialCategories={initialCategories}
              initialBrands={initialBrands}
            />
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
