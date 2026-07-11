import { CategorySlider } from "@/shared/components/category/category-slider";
import { getCategories } from "@/features/category/category-api";

export default async function CategoriesSection() {
  const { data: categories } = await getCategories();
  return <CategorySlider categories={categories ?? []} showHeader />;
}
