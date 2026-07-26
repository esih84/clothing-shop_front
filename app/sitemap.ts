import type { MetadataRoute } from "next";
import { brand } from "@/shared/config/brand";

/**
 * Sitemap. Currently covers the main static routes.
 * TODO (phase 2): once the data layer is stable, add dynamic product/category/blog URLs
 * to this list by fetching from the backend (with revalidate).
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const routes = ["", "/categories", "/blogs", "/wishlist"];

  return routes.map((path) => ({
    url: `${brand.url}${path}`,
    lastModified: now,
    changeFrequency: "daily",
    priority: path === "" ? 1 : 0.7,
  }));
}
