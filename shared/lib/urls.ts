import { brand } from "@/shared/config/brand";

/**
 * Single source of truth for the site's canonical URLs.
 *
 * The official landing page for a category is `/products?categorySlug=<slug>` — not
 * `/categories/<slug>`. The `/products` route is the one with filters, sorting and infinite
 * scroll, so it is what both users and crawlers should land on. `/categories/<slug>` still
 * renders, but it is `noindex` and canonicalises here.
 */

export function categoryPath(slug: string): string {
  return `/products?categorySlug=${encodeURIComponent(slug)}`;
}

export function brandPath(slug: string): string {
  return `/products?brandSlugs=${encodeURIComponent(slug)}`;
}

export function productPath(slug: string): string {
  return `/product/${slug}`;
}

/** Absolute variants — for canonical tags, JSON-LD and the sitemap. */
export function absolute(path: string): string {
  return `${brand.url}${path}`;
}

export const categoryUrl = (slug: string) => absolute(categoryPath(slug));
export const brandUrl = (slug: string) => absolute(brandPath(slug));
export const productUrl = (slug: string) => absolute(productPath(slug));
