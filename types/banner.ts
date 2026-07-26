/**
 * Allowed banner positions — must stay in sync with the backend registry
 * (shop-backend/src/modules/banners/banner-position.ts).
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
  /** Button text on the banner; if empty, the button is not rendered */
  buttonText?: string;
  // Kept as string so it is not sensitive to old data with removed positions
  position: string;
  order: number;
  isActive: boolean;
  startDate?: string;
  endDate?: string;
  createdAt: string;
  updatedAt: string;
};
