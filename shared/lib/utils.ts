import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/** قیمت را به‌صورت فارسی همراه واحد «تومان» قالب‌بندی می‌کند. */
export function formatToman(value: number): string {
  return `${Math.round(value).toLocaleString("fa-IR")} تومان`
}

/** تاریخ را به تقویم جلالی (شمسی) با نام ماه فارسی قالب‌بندی می‌کند. */
export function formatJalaliDate(value: string | number | Date): string {
  const date = new Date(value)
  if (isNaN(date.getTime())) return ""
  return new Intl.DateTimeFormat("fa-IR", {
    calendar: "persian",
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date)
}
