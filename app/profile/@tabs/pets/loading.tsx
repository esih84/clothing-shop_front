// profile/@tabs/pets/loading.tsx

import { PawPrint } from "lucide-react";
import { Skeleton } from "@/shared/ui/skeleton";

export default function PetsLoading() {
  return (
    <div className="space-y-3" style={{ direction: "rtl" }}>
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="flex items-center justify-between bg-card p-4 rounded-2xl shadow-sm border border-border"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/15 border border-border flex items-center justify-center flex-shrink-0 animate-pulse">
              <PawPrint className="w-5 h-5 text-secondary/40" />
            </div>
            <Skeleton className="h-4 w-28" />
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
