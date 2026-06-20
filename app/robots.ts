import type { MetadataRoute } from "next";
import { brand } from "@/shared/config/brand";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // مسیرهای خصوصی/کاربری از ایندکس خارج می‌شوند
      disallow: ["/profile", "/cart", "/checkout", "/orders"],
    },
    sitemap: `${brand.url}/sitemap.xml`,
    host: brand.url,
  };
}
