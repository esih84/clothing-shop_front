import type { MetadataRoute } from "next";
import { brand } from "@/shared/config/brand";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Private/user paths are excluded from indexing
      disallow: ["/profile", "/cart", "/checkout", "/orders"],
    },
    sitemap: `${brand.url}/sitemap.xml`,
    host: brand.url,
  };
}
