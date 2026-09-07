import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ProductDetails } from "@/shared/components/product/product-details";
import { JsonLd } from "@/shared/components/global/json-ld";
import {
  getProductBySlug,
  getProducts,
  getRelatedProducts,
} from "@/features/product/product-api";
import { getCategories } from "@/features/category/category-api";
import { collectRelatedCategorySlugs } from "@/shared/lib/related-categories";
import { getProductCategoryPath } from "@/shared/lib/category-path";
import { getDiscountInfo } from "@/shared/lib/discount";
import { buildTorobProductMeta, sortProductImages } from "@/shared/lib/torob";
import { Breadcrumbs, type Crumb } from "@/shared/components/global/breadcrumbs";
import { categoryPath, productUrl } from "@/shared/lib/urls";
import { brand } from "@/shared/config/brand";
import type { Product } from "@/types/product";

interface ProductPageProps {
  params: Promise<{ id: string }>;
}

/** Prices are stored in Toman; schema.org needs an ISO currency, so JSON-LD reports Rial. */
const RIAL_PER_TOMAN = 10;

/** Return window advertised on the product page ("مرجوعی آسان — ۷ روزه"). */
const RETURN_WINDOW_DAYS = 7;

/**
 * Meta description built from the product's own data.
 *
 * A fixed template would give all ~170 products a near-identical description, which search
 * engines treat as duplicate. Price, brand and category vary per product, so the opening
 * sentence is always distinct even when the product has no written description.
 */
function toMetaDescription(product: Product): string {
  const { finalPrice } = getDiscountInfo(product);
  const facts = [
    `خرید ${product.name}`,
    finalPrice > 0
      ? `با قیمت ${Math.round(finalPrice).toLocaleString("fa-IR")} تومان`
      : null,
    product.brand ? `برند ${product.brand.name}` : null,
    product.category ? product.category.name : null,
  ]
    .filter(Boolean)
    .join(" — ");

  const own = product.description?.replace(/\s+/g, " ").trim();
  const tail = own
    ? own.split(/(?<=[.!؟])\s/)[0]
    : `ارسال سریع به سراسر ایران از ${brand.name}.`;

  const text = `${facts}. ${tail}`;
  return text.length > 160 ? `${text.slice(0, 157).trimEnd()}…` : text;
}

/**
 * Dynamic metadata for each product page.
 *
 * Besides the usual title/description/OG/canonical, this emits the meta tags the Torob
 * crawler expects (see `buildTorobProductMeta`). Torob reads the page with JavaScript
 * disabled, so these must come from `generateMetadata` — not from the client component.
 */
export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { id } = await params;
  const { data: product } = await getProductBySlug(id);

  if (!product) {
    return { title: "محصول پیدا نشد" };
  }

  const url = productUrl(product.slug);
  const description = toMetaDescription(product);
  const images = sortProductImages(product);
  // "قیمت و خرید X" is the pattern Iranian shoppers search with, and the pattern every
  // competitor ranks on.
  const title = `قیمت و خرید ${product.name}`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      // `type` is deliberately omitted: Next validates it against a fixed list and throws
      // "Invalid OpenGraph type: product" — which silently drops ALL metadata, Torob tags
      // included. The product type is emitted as a raw <meta property> in the page instead.
      locale: "fa_IR",
      siteName: brand.name,
      title,
      description,
      url,
      images: images.map((img) => ({
        url: img.url,
        alt: img.altText ?? product.name,
      })),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: images.length ? [images[0].url] : undefined,
    },
    other: buildTorobProductMeta(product),
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params;
  const [{ data: product }, { data: categoryTree }] = await Promise.all([
    getProductBySlug(id),
    getCategories(),
  ]);
  if (!product) {
    notFound();
  }

  // Two independent suggestion sets: the automatic category-derived grid at the bottom of the
  // page, and the admin-curated list shown in the add-to-cart dialog.
  const relatedSlugs = collectRelatedCategorySlugs(product, categoryTree);
  const [{ data: relatedResult }, { data: curated }] = await Promise.all([
    getProducts(
      relatedSlugs.length
        ? { categorySlugs: relatedSlugs, limit: 21 }
        : { limit: 20 },
    ),
    getRelatedProducts(product.id),
  ]);
  const relatedProducts = (relatedResult?.data ?? [])
    .filter((p) => p.id !== product.id)
    .slice(0, 20);

  const moreHref = relatedSlugs.length
    ? `/products?categorySlugs=${relatedSlugs.join(",")}`
    : "/products";

  const { finalPrice } = getDiscountInfo(product);
  const reviews = product.reviews ?? [];
  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: toMetaDescription(product),
    sku: product.sku ?? undefined,
    image: sortProductImages(product).map((img) => img.url),
    inLanguage: "fa-IR",
    brand: product.brand
      ? { "@type": "Brand", name: product.brand.name }
      : undefined,
    category: product.category?.name,
    offers: {
      "@type": "Offer",
      url: productUrl(product.slug),
      priceCurrency: "IRR",
      price: Math.round(finalPrice) * RIAL_PER_TOMAN,
      // Google drops an Offer whose price has no stated validity; end of the current year is the
      // conventional placeholder for a catalogue with no scheduled price expiry.
      priceValidUntil: `${new Date().getUTCFullYear()}-12-31`,
      itemCondition: "https://schema.org/NewCondition",
      availability:
        product.stock > 0
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
      seller: { "@type": "Organization", name: brand.name },
      // Matches the return promise already shown on the page. `shippingDetails` is deliberately
      // omitted: no shipping rate exists in the backend and inventing one risks a manual action.
      hasMerchantReturnPolicy: {
        "@type": "MerchantReturnPolicy",
        applicableCountry: "IR",
        returnPolicyCategory:
          "https://schema.org/MerchantReturnFiniteReturnWindow",
        merchantReturnDays: RETURN_WINDOW_DAYS,
      },
    },
    aggregateRating: reviews.length
      ? {
          "@type": "AggregateRating",
          ratingValue: (
            reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
          ).toFixed(1),
          reviewCount: reviews.length,
        }
      : undefined,
  };

  // Breadcrumb trail from the real category tree: خانه › محصولات سگ › غذای سگ › ... › نام محصول
  const categoryTrail = getProductCategoryPath(product, categoryTree);
  const crumbs: Crumb[] = [
    ...categoryTrail.map((node) => ({
      name: node.name,
      href: categoryPath(node.slug),
    })),
    { name: product.name },
  ];

  return (
    <>
      {/* React hoists this into <head>. Emitted here rather than through `generateMetadata`
          because Next rejects "product" as an OpenGraph type — see the comment there. */}
      <meta property="og:type" content="product" />
      <JsonLd data={productJsonLd} />
      <div className="bg-card">
        <div className="max-w-6xl mx-auto px-4 pt-4">
          <Breadcrumbs items={crumbs} />
        </div>
      </div>
      <ProductDetails
        product={product}
        relatedProducts={relatedProducts}
        cartSuggestions={curated ?? []}
        moreHref={moreHref}
      />
    </>
  );
}
