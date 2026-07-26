import { CategorySlider } from "@/shared/components/category/category-slider";
import {
  getCategories,
  getFeaturedCategories,
} from "@/features/category/category-api";

export default async function CategoriesSection() {
  // If featured categories are defined (including subcategories), we show those;
  // otherwise we fall back to top-level categories.
  const { data: featured } = await getFeaturedCategories();
  if (featured && featured.length > 0) {
    return <CategorySlider categories={featured} showHeader />;
  }
  const { data: categories } = await getCategories();
  return <CategorySlider categories={categories ?? []} showHeader />;
}
