import type { Product } from "@/types/product";
import type { Category } from "@/types/category";

/**
 * The unique set of category slugs used for the "you might also like" suggestions:
 * the product's own categories + the parent category + subcategories (children).
 *
 * @param product the current product (with a single `category` and/or multi-valued `categories`)
 * @param tree    the category tree from `getCategories()` (roots with nested `children`)
 */
export function collectRelatedCategorySlugs(
  product: Pick<Product, "category" | "categories">,
  tree: Category[] | null | undefined,
): string[] {
  // Index nodes by id + map each node to its parent (while traversing the tree).
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

  // Seed categories from the product itself (single + multi-valued).
  const seeds: Category[] = [];
  if (product.category) seeds.push(product.category);
  if (product.categories?.length) seeds.push(...product.categories);

  const slugs = new Set<string>();
  for (const seed of seeds) {
    if (seed?.slug) slugs.add(seed.slug);

    // Find the corresponding node in the tree so the parent/children are accurate.
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
