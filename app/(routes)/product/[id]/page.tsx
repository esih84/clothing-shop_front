import { notFound } from "next/navigation";
import { getProduct, getProducts } from "@/lib/actions";
import { ProductDetails } from "@/components/product/product-details";

interface ProductPageProps {
  params: Promise<{ id: string }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params;
  const [product, { products }] = await Promise.all([
    getProduct(id),
    getProducts(),
  ]);

  if (!product) {
    notFound();
  }

  const related = products
    .filter((p) => p.id !== id && p.category === product.category)
    .slice(0, 4);

  return <ProductDetails product={product} relatedProducts={related} />;
}

