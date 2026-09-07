import type { Product, ProductImage } from "@/types/product";
import { getDiscountInfo } from "@/shared/lib/discount";

/**
 * Attribute keys that hold the warranty, as they are entered in the dashboard.
 * Compared case-insensitively against the trimmed attribute key.
 */
const GUARANTEE_KEYS = ["گارانتی", "ضمانت", "guarantee", "warranty"];

/** Product images with the primary one first; the first entry is the main image. */
export function sortProductImages(product: Product): ProductImage[] {
  return [...(product.images ?? [])].sort((a, b) => {
    if (a.isPrimary !== b.isPrimary) return a.isPrimary ? -1 : 1;
    return a.order - b.order;
  });
}

/**
 * Meta tags the Torob crawler reads from the no-JavaScript version of a product page.
 *
 * Torob's rules: prices are plain integers in Toman (no separators, no currency word),
 * `availability` is exactly "instock" or "outofstock", and every tag must be present in the
 * server-rendered HTML. `og:image` is intentionally absent here — it is emitted through
 * `openGraph.images` in the page's `generateMetadata`.
 */
export function buildTorobProductMeta(
  product: Product,
): Record<string, string> {
  const { hasDiscount, finalPrice, originalPrice } = getDiscountInfo(product);

  const meta: Record<string, string> = {
    product_id: product.id,
    product_name: product.name,
    product_price: String(Math.round(finalPrice)),
    availability: product.stock > 0 ? "instock" : "outofstock",
  };

  // Only sent when a discount is actually active — otherwise Torob would render a fake "was" price.
  if (hasDiscount) {
    meta.product_old_price = String(Math.round(originalPrice));
  }

  const guarantee = product.attributes
    ?.find((attr) =>
      GUARANTEE_KEYS.includes(attr.key.trim().toLowerCase()),
    )
    ?.value?.trim();
  if (guarantee) {
    meta.guarantee = guarantee;
  }

  return meta;
}
