import { serverFetch } from "@/shared/api/server-fetch";
import {
  DEFAULT_SITE_SETTINGS,
  type SiteSettings,
} from "@/shared/config/site-settings";

/** Next.js cache tag; the backend hits `/api/revalidate` with it after a save. */
export const SITE_SETTINGS_TAG = "site-settings";

/** One day, matching the backend's own cache for the same payload. */
const SITE_SETTINGS_TTL_SECONDS = 24 * 60 * 60;

type RawSettings = Partial<Record<keyof SiteSettings, Record<string, unknown>>>;

/**
 * The admin-editable texts, logo and contact details.
 *
 * Cached for a day; an admin save pushes a revalidation through
 * `/api/revalidate` so an edit does not wait for that day to pass. A group the
 * backend does not know about falls back to its defaults key by key, so a
 * setting added to the storefront before the backend ships it still renders.
 */
export async function getSiteSettings(): Promise<SiteSettings> {
  try {
    const raw = await serverFetch<RawSettings>("/settings", {
      revalidate: SITE_SETTINGS_TTL_SECONDS,
      tags: [SITE_SETTINGS_TAG],
    });
    return merge(raw);
  } catch {
    // The storefront must render even when the API is down.
    return DEFAULT_SITE_SETTINGS;
  }
}

/** Overlays one group of the API payload on that group's defaults. */
function mergeGroup<K extends keyof SiteSettings>(
  group: K,
  raw: RawSettings,
): SiteSettings[K] {
  return {
    ...DEFAULT_SITE_SETTINGS[group],
    ...(raw?.[group] ?? {}),
  } as SiteSettings[K];
}

/**
 * Overlays the API payload on the defaults. Listing the groups explicitly means
 * a group added to `SiteSettings` fails the build here until it is wired up,
 * rather than silently arriving as undefined at a render.
 */
function merge(raw: RawSettings): SiteSettings {
  const footer = mergeGroup("footer", raw);

  return {
    theme: mergeGroup("theme", raw),
    brand: mergeGroup("brand", raw),
    contact: mergeGroup("contact", raw),
    home: mergeGroup("home", raw),
    cart: mergeGroup("cart", raw),
    wishlist: mergeGroup("wishlist", raw),
    orders: mergeGroup("orders", raw),
    footer: {
      ...footer,
      // The footer maps over this; a malformed payload must not throw there.
      quickLinks: Array.isArray(footer.quickLinks) ? footer.quickLinks : [],
    },
  };
}
