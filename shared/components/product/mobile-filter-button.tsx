"use client";

import { useState } from "react";
import { SlidersHorizontal } from "lucide-react";
import { FilterModal } from "@/shared/components/global/filter-modal";
import type { Category } from "@/types/category";
import type { Brand } from "@/types/brand";

/** Mobile/tablet-only filter button that opens the filter Drawer (hidden on desktop). */
export function MobileFilterButton({
  initialCategories,
  initialBrands,
}: {
  initialCategories?: Category[];
  initialBrands?: Brand[];
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="lg:hidden inline-flex items-center gap-1.5 rounded-2xl border border-border bg-card px-3 py-2 text-sm font-medium text-foreground hover:border-secondary/60 transition-colors"
        aria-label="فیلتر محصولات"
      >
        <SlidersHorizontal className="w-4 h-4" />
        فیلتر
      </button>
      <FilterModal
        isOpen={open}
        onClose={() => setOpen(false)}
        initialCategories={initialCategories}
        initialBrands={initialBrands}
      />
    </>
  );
}
