"use client";

import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/shared/ui/drawer";
import { ProductFilters } from "@/shared/components/product/product-filters";

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * نسخه‌ی موبایل پنل فیلتر — همان `ProductFilters` داخل Drawer.
 * در لپ‌تاپ/تبلت به‌جای این، ستون کناری در صفحه‌ی `/products` نشان داده می‌شود.
 */
export function FilterModal({ isOpen, onClose }: FilterModalProps) {
  return (
    <Drawer open={isOpen} onOpenChange={onClose}>
      <DrawerContent className="h-[90vh] md:h-full w-full max-w-md mx-auto md:mx-0 shadow-2xl bg-white">
        <div className="mx-auto w-full max-w-md flex flex-col h-full">
          <DrawerHeader>
            <DrawerTitle className="flex items-center gap-2 text-2xl font-bold text-[#1473E6]">
              فیلتر محصولات
            </DrawerTitle>
            <DrawerDescription className="text-gray-500 text-right">
              بر اساس نام، دسته‌بندی و قیمت، محصولات را فیلتر کنید
            </DrawerDescription>
          </DrawerHeader>

          <div className="p-4 overflow-y-auto flex-1">
            <ProductFilters onApplied={onClose} />
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
