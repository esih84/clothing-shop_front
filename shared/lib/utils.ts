import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/** قیمت را به‌صورت فارسی همراه واحد «تومان» قالب‌بندی می‌کند. */
export function formatToman(value: number): string {
  return `${Math.round(value).toLocaleString("fa-IR")} تومان`
}
