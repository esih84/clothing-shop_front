import { ChevronRight, Package, MapPin } from "lucide-react";

export default function LoadingOrderDetail() {
  return (
    <div
      className="max-w-5xl mx-auto p-4 lg:py-8 space-y-6 animate-pulse"
      style={{ direction: "rtl" }}
    >
      {/* Title */}
      <div className="flex items-center gap-2">
        <ChevronRight className="w-5 h-5 text-muted-foreground/40" />
        <div className="h-6 bg-muted rounded w-44" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Main column: order products */}
        <div className="lg:col-span-2 space-y-6 order-2 lg:order-1">
          <div className="bg-card rounded-lg shadow p-4 border border-border">
            <div className="h-5 bg-muted rounded w-28 mb-3" />
            <ul className="divide-y divide-gray-100">
              {[1, 2, 3].map((i) => (
                <li key={i} className="py-3 flex gap-3">
                  <div className="w-16 h-16 rounded-lg bg-muted border border-border flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="h-4 bg-muted rounded w-3/4" />
                    <div className="mt-2 flex items-center justify-between gap-3">
                      <div className="h-4 bg-muted rounded w-20" />
                      <div className="flex flex-col items-end gap-1">
                        <div className="h-3 bg-muted rounded w-14" />
                        <div className="h-3 bg-muted rounded w-20" />
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Side column: order summary and address */}
        <div className="lg:col-span-1 space-y-6 order-1 lg:order-2">
          {/* Order summary */}
          <div className="bg-card rounded-lg shadow p-4 border border-border">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-primary/15 border border-border flex items-center justify-center flex-shrink-0">
                <Package className="w-5 h-5 text-secondary/40" />
              </div>
              <div className="space-y-2 flex-1">
                <div className="h-4 bg-muted rounded w-24" />
                <div className="h-3 bg-muted rounded w-32" />
              </div>
            </div>
            <div className="h-5 bg-muted rounded-full w-20 mb-3" />
            <div className="flex justify-between gap-3 mb-2">
              <div className="h-4 bg-muted rounded w-16" />
              <div className="h-4 bg-muted rounded w-24" />
            </div>
            <div className="flex justify-between gap-3 mb-2">
              <div className="h-4 bg-muted rounded w-20" />
              <div className="h-4 bg-muted rounded w-24" />
            </div>
          </div>

          {/* Delivery address */}
          <div className="bg-card rounded-lg shadow p-4 border border-border">
            <div className="flex items-center gap-2 mb-3">
              <MapPin className="w-4 h-4 text-secondary/40" />
              <div className="h-5 bg-muted rounded w-24" />
            </div>
            <div className="space-y-2">
              <div className="h-4 bg-muted rounded w-40" />
              <div className="h-4 bg-muted rounded w-28" />
              <div className="h-4 bg-muted rounded w-3/4" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
