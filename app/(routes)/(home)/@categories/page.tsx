import { CategorySelector } from "@/shared/components/category/category-selector";
import { getCategories } from "@/features/category/category-api";

export default async function CategoriesSection() {
  const { data: categories  } = await getCategories();
  return <CategorySelector categories={categories ?? []} limit={5} showHeader />;
}
