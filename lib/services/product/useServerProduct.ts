import { productService, ProductFilters } from "./api";

export async function getProducts(filters: ProductFilters) {
  try {
    const products = await productService.findAll(filters);
    return { data: products, error: null };
  } catch (error) {
    return { data: null, error };
  }
}

export async function getProductBySlug(slug: string) {
  try {
    const product = await productService.findBySlug(slug);
    return { data: product, error: null };
  } catch (error) {
    return { data: null, error };
  }
}

export async function getProductVariants(id: string) {
  try {
    const variants = await productService.getVariants(id);
    return { data: variants, error: null };
  } catch (error) {
    return { data: null, error };
  }
}
