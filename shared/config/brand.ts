import { DEFAULT_SITE_SETTINGS } from "./site-settings";

/**
 * Static brand fallbacks, kept for the few spots that cannot await the live
 * settings (client components outside the settings provider, and metadata built
 * before the API responds).
 *
 * The editable values now live in the admin panel — see
 * `features/settings/settings-api.ts` and `useSiteSettings()`. These constants
 * only mirror the defaults so nothing renders blank; changing them here does
 * not change what the site shows.
 */
export const brand = {
  /** Persian brand name (used in the header, footer, and page titles) */
  name: DEFAULT_SITE_SETTINGS.brand.name,
  /** Latin brand name (for copyright, domain, and Latin SEO) */
  nameEn: DEFAULT_SITE_SETTINGS.brand.nameEn,
  /** Short slogan */
  tagline: DEFAULT_SITE_SETTINGS.brand.tagline,
  /** Longer description for metadata and the footer */
  description: DEFAULT_SITE_SETTINGS.brand.description,
  /**
   * Full site URL (for canonical / OG / sitemap). Not editable from the panel —
   * it has to match where the site is actually deployed.
   */
  url: "https://petmeal.ir",
  contact: {
    email: DEFAULT_SITE_SETTINGS.contact.email,
    phone: DEFAULT_SITE_SETTINGS.contact.phone,
  },
  social: {
    instagram: DEFAULT_SITE_SETTINGS.contact.instagram,
    telegram: DEFAULT_SITE_SETTINGS.contact.telegram,
  },
} as const;

export type Brand = typeof brand;
