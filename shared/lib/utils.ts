import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/** Formats a price in Persian with the "Toman" unit. */
export function formatToman(value: number): string {
  return `${Math.round(value).toLocaleString("fa-IR")} تومان`
}

/** Formats a date in the Jalali (Persian) calendar with the Persian month name. */
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
