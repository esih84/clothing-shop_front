// profile/@tabs/addresses/loading.tsx

import { MapPin } from "lucide-react";
import { Skeleton } from "@/shared/ui/skeleton";

export default function AddressesLoading() {
  return (
    <div className="space-y-3" style={{ direction: "rtl" }}>
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="flex items-center justify-between bg-card p-4 rounded-2xl shadow-sm border border-border"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/15 border border-border flex items-center justify-center flex-shrink-0 animate-pulse">
              <MapPin className="w-5 h-5 text-secondary/40" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-3 w-40" />
            </div>
          </div>
          <Skeleton className="w-4 h-4 rounded" />
        </div>
      ))}
      <div className="w-full p-4 rounded-2xl border border-dashed border-border/60 flex items-center justify-center">
        <Skeleton className="h-4 w-32" />
      </div>
    </div>
  );
}
