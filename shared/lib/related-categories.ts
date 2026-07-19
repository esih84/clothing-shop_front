import type { Product } from "@/types/product";
import type { Category } from "@/types/category";

/**
 * مجموعه‌ی یکتای slug دسته‌هایی که برای پیشنهاد «شاید دوست داشته باشید» استفاده
 * می‌شوند: دسته‌های خودِ محصول + دسته‌ی والد + زیردسته‌ها (فرزندان).
 *
 * @param product محصول جاری (با `category` تکی و/یا `categories` چند‌مقداری)
 * @param tree    درخت دسته‌ها از `getCategories()` (ریشه‌ها با `children` تودرتو)
 */
export function collectRelatedCategorySlugs(
  product: Pick<Product, "category" | "categories">,
  tree: Category[] | null | undefined,
): string[] {
  // ایندکس گره‌ها بر اساس id + نگاشت هر گره به والدش (حین پیمایش درخت).
  const byId = new Map<string, Category>();
  const parentOf = new Map<string, Category | undefined>();

  const walk = (nodes: Category[] | undefined, parent?: Category) => {
    for (const node of nodes ?? []) {
      byId.set(node.id, node);
      parentOf.set(node.id, parent);
      if (node.children?.length) walk(node.children, node);
    }
  };
  walk(tree ?? []);

  // دسته‌های seed از خودِ محصول (تکی + چند‌مقداری).
  const seeds: Category[] = [];
  if (product.category) seeds.push(product.category);
  if (product.categories?.length) seeds.push(...product.categories);

  const slugs = new Set<string>();
  for (const seed of seeds) {
    if (seed?.slug) slugs.add(seed.slug);

    // گره‌ی متناظر در درخت را پیدا کن تا والد/فرزندان دقیق باشند.
    const node = byId.get(seed.id);
    if (!node) continue;

    const parent = parentOf.get(node.id);
    if (parent?.slug) slugs.add(parent.slug);

    for (const child of node.children ?? []) {
      if (child.slug) slugs.add(child.slug);
    }
  }

  return [...slugs];
}
