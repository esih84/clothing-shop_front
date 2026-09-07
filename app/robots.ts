import type { MetadataRoute } from "next";
import { brand } from "@/shared/config/brand";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        // Private/user paths are excluded from indexing
        "/profile",
        "/cart",
        "/checkout",
        "/orders",
        "/wishlist",
        "/search",
        // Filter parameters that only permute an existing listing — infinite crawl space with
        // nothing unique to rank. `categorySlug`, `brandSlugs` and `hasDiscount` are deliberately
        // NOT blocked: they are real landing pages (or carry a canonical), and a blocked URL's
        // canonical tag can never be read.
        // `?` is a literal in robots.txt patterns, so these match the parameter in any
        // position (`?sortBy=` and `&sortBy=` alike).
        "/*sortBy=",
        "/*sortOrder=",
        "/*minPrice=",
        "/*maxPrice=",
        "/*inStock=",
        "/*search=",
      ],
    },
    sitemap: `${brand.url}/sitemap.xml`,
    host: brand.url,
  };
}
