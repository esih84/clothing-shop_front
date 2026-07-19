/**
 * جایگاه‌های مجاز بنر — باید با رجیستری بک‌اند
 * (shop-backend/src/modules/banners/banner-position.ts) همگام بماند.
 */
export const BANNER_POSITIONS = {
  HOME_MAIN: "home_main",
  HOME_SIDE_TOP: "home_side_top",
  HOME_SIDE_BOTTOM: "home_side_bottom",
  BRANDS: "brands",
} as const;

export type BannerPosition =
  (typeof BANNER_POSITIONS)[keyof typeof BANNER_POSITIONS];

export type Banner = {
  id: string;
  title: string;
  description?: string;
  imageUrl: string;
  mobileImageUrl?: string;
  link?: string;
  /** متن دکمه‌ی روی بنر؛ خالی باشد دکمه رندر نمی‌شود */
  buttonText?: string;
  // string می‌ماند تا به داده‌ی قدیمی با جایگاه‌های حذف‌شده حساس نباشد
  position: string;
  order: number;
  isActive: boolean;
  startDate?: string;
  endDate?: string;
  createdAt: string;
  updatedAt: string;
};
