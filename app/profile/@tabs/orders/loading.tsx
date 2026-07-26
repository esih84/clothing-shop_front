// profile/@tabs/orders/loading.tsx

import { Package } from "lucide-react";
import { Skeleton } from "@/shared/ui/skeleton";

export default function OrdersLoading() {
  return (
    <div className="space-y-3" style={{ direction: "rtl" }}>
      {[1, 2, 3, 4].map((i) => (
        <div
          key={i}
          className="flex items-center justify-between bg-card rounded-2xl p-4 shadow-sm border border-border"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/15 border border-border flex items-center justify-center flex-shrink-0 animate-pulse">
              <Package className="w-5 h-5 text-secondary/40" />
            </div>
            <div className="space-y-2 text-right">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-3 w-20" />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="h-5 w-16 rounded-full" />
            <Skeleton className="w-4 h-4 rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}
