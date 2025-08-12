import { ProductCard } from "@/components/product-card";
import { getProducts } from "@/lib/actions";

export default async function ProductsSection() {
  const products = await getProducts();

  return (
    <div className="px-4 py-6 mx-auto">
      <h2 className="text-xl md:text-2xl md:font-lg font-bold mb-4 md:mb-6">
        Featured Products
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            id={product.id}
            title={product.title}
            price={product.price}
            imageUrl={product.images[0]}
            rating={product.rating}
            reviews={product.reviews}
            sales={product.sales}
          />
        ))}
      </div>
    </div>
  );
}
