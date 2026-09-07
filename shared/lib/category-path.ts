import type { Category } from "@/types/category";
import type { Product } from "@/types/product";

/**
 * Indexes a category tree so each node can be looked up by id or slug and walked back to its root.
 * Same traversal shape as `collectRelatedCategorySlugs` in ./related-categories.
 */
function indexTree(tree: Category[] | null | undefined) {
  const byId = new Map<string, Category>();
  const bySlug = new Map<string, Category>();
  const parentOf = new Map<string, Category | undefined>();

  const walk = (nodes: Category[] | undefined, parent?: Category) => {
    for (const node of nodes ?? []) {
      byId.set(node.id, node);
      bySlug.set(node.slug, node);
      parentOf.set(node.id, parent);
      if (node.children?.length) walk(node.children, node);
    }
  };
  walk(tree ?? []);

  return { byId, bySlug, parentOf };
}

/** Walks a node up to the root and returns the chain root-first. */
function chainToRoot(
  node: Category | undefined,
  parentOf: Map<string, Category | undefined>,
): Category[] {
  const chain: Category[] = [];
  let current = node;
  // The guard against re-visiting a node keeps a malformed (cyclic) tree from hanging the render.
  const seen = new Set<string>();
  while (current && !seen.has(current.id)) {
    seen.add(current.id);
    chain.unshift(current);
    current = parentOf.get(current.id);
  }
  return chain;
}

/** Flattens the nested category tree into a single list (all levels). */
export function flattenCategoryTree(
  tree: Category[] | null | undefined,
): Category[] {
  const flat: Category[] = [];
  const walk = (nodes: Category[] | undefined) => {
    for (const node of nodes ?? []) {
      flat.push(node);
      if (node.children?.length) walk(node.children);
    }
  };
  walk(tree ?? []);
  return flat;
}

/** Looks a category up by slug at any depth of the tree. */
export function findCategoryBySlug(
  slug: string | undefined,
  tree: Category[] | null | undefined,
): Category | undefined {
  if (!slug) return undefined;
  return indexTree(tree).bySlug.get(slug);
}

/** The ancestor chain of a category slug, root-first. Empty when the slug is not in the tree. */
export function getCategoryPathBySlug(
  slug: string | undefined,
  tree: Category[] | null | undefined,
): Category[] {
  if (!slug) return [];
  const { bySlug, parentOf } = indexTree(tree);
  return chainToRoot(bySlug.get(slug), parentOf);
}

/**
 * The category chain for a product, root-first.
 *
 * A product can belong to several categories; the deepest chain is chosen because it is the most
 * specific description of the product (e.g. dog › food › dry food beats dog › food).
 */
export function getProductCategoryPath(
  product: Pick<Product, "category" | "categories">,
  tree: Category[] | null | undefined,
): Category[] {
  const { byId, parentOf } = indexTree(tree);

  const seeds: Category[] = [];
  if (product.category) seeds.push(product.category);
  if (product.categories?.length) seeds.push(...product.categories);

  let best: Category[] = [];
  for (const seed of seeds) {
    const node = byId.get(seed.id);
    if (!node) continue;
    const chain = chainToRoot(node, parentOf);
    if (chain.length > best.length) best = chain;
  }

  // The product's own category is still worth showing when the tree lookup found nothing.
  if (!best.length && product.category) best = [product.category];
  return best;
}
