import { notFound } from "next/navigation";
import { ProductDetails } from "@/shared/components/product/product-details";
import { getProductBySlug, getProducts } from "@/features/product/product-api";
interface ProductPageProps {
  params: Promise<{ id: string }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params;
  const [{ data: product }, { data: products }] = await Promise.all([
    getProductBySlug(id),
    getProducts({ page: 1, limit: 6 }),
  ]);
  if (!product) {
    notFound();
  }

  return (
    <ProductDetails product={product} relatedProducts={products?.data ?? []} />
  );
}
