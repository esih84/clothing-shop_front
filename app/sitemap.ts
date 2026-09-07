import type { MetadataRoute } from "next";
import { brand } from "@/shared/config/brand";
import { getProducts } from "@/features/product/product-api";
import { getCategories } from "@/features/category/category-api";
import { getBlogs } from "@/features/blog/blog-api";
import { categoryUrl, productUrl } from "@/shared/lib/urls";
import { flattenCategoryTree } from "@/shared/lib/category-path";

/** The backend caps `limit` at 100, so lists are walked page by page. */
const PAGE_SIZE = 100;
/** Safety stop so a backend paging bug can never turn this into an endless loop. */
const MAX_PAGES = 200;

/** Rebuild the sitemap hourly — new products need to be discoverable without a redeploy. */
export const revalidate = 3600;

/** Walks a paginated list endpoint until it returns a short page. */
async function fetchAllPages<T>(
  fetchPage: (page: number) => Promise<{ data: T[] } | null>,
): Promise<T[]> {
  const items: T[] = [];
  for (let page = 1; page <= MAX_PAGES; page++) {
    const result = await fetchPage(page);
    const batch = result?.data ?? [];
    items.push(...batch);
    if (batch.length < PAGE_SIZE) break;
  }
  return items;
}

/** A bad/missing timestamp must not break the whole sitemap, so fall back to "now". */
function lastModified(value: string | undefined, fallback: Date): Date {
  const date = value ? new Date(value) : null;
  return date && !isNaN(date.getTime()) ? date : fallback;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const [products, categoryTree, blogs] = await Promise.all([
    fetchAllPages(async (page) => {
      const { data } = await getProducts({ page, limit: PAGE_SIZE });
      return data;
    }),
    getCategories().then(({ data }) => data),
    fetchAllPages(async (page) => {
      const { data } = await getBlogs(page, PAGE_SIZE);
      return data;
    }),
  ]);

  // `priority` is omitted throughout — Google ignores it. `changeFrequency` reflects how often
  // each kind of page really changes; claiming "daily" on pages that never change teaches
  // crawlers to distrust our lastModified as well.
  const staticRoutes: MetadataRoute.Sitemap = [
    { path: "", changeFrequency: "daily" as const },
    { path: "/products", changeFrequency: "daily" as const },
    { path: "/offers", changeFrequency: "daily" as const },
    { path: "/categories", changeFrequency: "monthly" as const },
    { path: "/blogs", changeFrequency: "weekly" as const },
  ].map(({ path, changeFrequency }) => ({
    url: `${brand.url}${path}`,
    lastModified: now,
    changeFrequency,
  }));

  const productRoutes: MetadataRoute.Sitemap = products.map((product) => ({
    url: productUrl(product.slug),
    lastModified: lastModified(product.updatedAt, now),
    changeFrequency: "weekly",
  }));

  // Categories are listed under their canonical `/products?categorySlug=` form; `/categories/<slug>`
  // is noindex and deliberately absent from the sitemap. See shared/lib/urls.ts.
  const categoryRoutes: MetadataRoute.Sitemap = flattenCategoryTree(
    categoryTree,
  ).map((category) => ({
    url: categoryUrl(category.slug),
    lastModified: lastModified(category.updatedAt, now),
    changeFrequency: "weekly",
  }));

  const blogRoutes: MetadataRoute.Sitemap = blogs.map((blog) => ({
    url: `${brand.url}/blogs/${blog.slug}`,
    lastModified: lastModified(blog.updatedAt, now),
    changeFrequency: "monthly",
  }));

  return [
    ...staticRoutes,
    ...productRoutes,
    ...categoryRoutes,
    ...blogRoutes,
  ];
}
