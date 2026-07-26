/**
 * Central brand configuration for the store.
 * To change the name/slogan/contact info, edit only this file.
 */
export const brand = {
  /** Persian brand name (used in the header, footer, and page titles) */
  name: "پت میل",
  /** Latin brand name (for copyright, domain, and Latin SEO) */
  nameEn: "Petmeal",
  /** Short slogan */
  tagline: "هر چیزی که حیوون خونگیت لازم داره",
  /** Longer description for metadata and the footer */
  description:
    "فروشگاه آنلاین لوازم و غذای حیوانات خانگی — غذا، اسباب‌بازی و لوازم نگهداری برای سگ، گربه و دوستان کوچولوت.",
  /** Full site URL (for canonical / OG / sitemap) */
  url: "https://petmeal.ir",
  contact: {
    // email: "info@petland.example",
    phone: "09330581953",
  },
  social: {
    instagram: "https://instagram.com/",
    telegram: "https://t.me/",
  },
} as const;

export type Brand = typeof brand;
