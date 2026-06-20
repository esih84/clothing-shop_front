"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";

const OPTIONS: { label: string; sortBy: string; sortOrder: "ASC" | "DESC" }[] = [
  { label: "جدیدترین", sortBy: "createdAt", sortOrder: "DESC" },
  { label: "ارزان‌ترین", sortBy: "basePrice", sortOrder: "ASC" },
  { label: "گران‌ترین", sortBy: "basePrice", sortOrder: "DESC" },
  { label: "نام (الفبا)", sortBy: "name", sortOrder: "ASC" },
];

export function ProductSort() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const current = `${searchParams.get("sortBy") ?? "createdAt"}:${
    searchParams.get("sortOrder") ?? "DESC"
  }`;

  const onChange = (value: string) => {
    const [sortBy, sortOrder] = value.split(":");
    const params = new URLSearchParams(searchParams.toString());
    params.set("sortBy", sortBy);
    params.set("sortOrder", sortOrder);
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <select
      value={current}
      onChange={(e) => onChange(e.target.value)}
      dir="rtl"
      className="rounded-2xl border border-border bg-white px-3 py-2 text-sm text-foreground focus:outline-none focus:border-secondary/60 focus:ring-2 focus:ring-secondary/15 transition-all"
      aria-label="مرتب‌سازی"
    >
      {OPTIONS.map((o) => (
        <option key={`${o.sortBy}:${o.sortOrder}`} value={`${o.sortBy}:${o.sortOrder}`}>
          {o.label}
        </option>
      ))}
    </select>
  );
}
