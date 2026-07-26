// profile/@tabs/settings/loading.tsx

import { UserRound, Moon } from "lucide-react";
import { Skeleton } from "@/shared/ui/skeleton";

export default function SettingsLoading() {
  return (
    <div
      className="flex flex-col lg:flex-row gap-4 items-start"
      style={{ direction: "rtl" }}
    >
      {/* Main area: profile edit */}
      <div className="flex-1 w-full min-w-0 bg-card rounded-2xl p-4 sm:p-6 shadow-sm border border-border space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/15 border border-border flex items-center justify-center flex-shrink-0 animate-pulse">
            <UserRound className="w-5 h-5 text-secondary/40" />
          </div>
          <div className="space-y-1.5">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-3 w-44" />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="space-y-1.5">
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-[38px] w-full rounded-xl" />
            </div>
          ))}
          <div className="sm:col-span-2 space-y-1.5">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-[38px] w-full rounded-xl" />
          </div>
          <Skeleton className="h-[42px] w-full sm:w-40 rounded-2xl" />
        </div>
      </div>

      {/* Left sidebar: theme + logout */}
      <aside className="w-full lg:w-64 space-y-3 flex-shrink-0">
        <div className="flex items-center justify-between bg-card rounded-2xl p-4 shadow-sm border border-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/15 border border-border flex items-center justify-center flex-shrink-0 animate-pulse">
              <Moon className="w-5 h-5 text-secondary/40" />
            </div>
            <div className="space-y-1.5">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-3 w-24" />
            </div>
          </div>
          <Skeleton className="w-11 h-6 rounded-full" />
        </div>
        <Skeleton className="h-[46px] w-full rounded-2xl" />
      </aside>
    </div>
  );
}
