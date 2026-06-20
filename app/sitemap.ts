import type { MetadataRoute } from "next";
import { brand } from "@/shared/config/brand";

/**
 * نقشه‌ی سایت. در حال حاضر مسیرهای اصلی ثابت را پوشش می‌دهد.
 * TODO (فاز ۲): پس از تثبیت لایه‌ی دیتا، URLهای پویای محصولات/دسته‌ها/بلاگ‌ها
 * با fetch از بک‌اند (با revalidate) به این لیست اضافه شوند.
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
