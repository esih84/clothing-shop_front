import { Products } from "@/components/product/products";
import { getProducts } from "@/lib/actions";

export default async function ProductsSection() {
 const { products } = await getProducts(1)

 
  return (
    <div className="px-4 py-6 mx-auto">
      <h2 className="text-xl md:text-2xl md:font-lg font-bold mb-4 md:mb-6">
        محصولات ویژه
      </h2>
<Products initialProducts={products} />
    </div>
  );
}
