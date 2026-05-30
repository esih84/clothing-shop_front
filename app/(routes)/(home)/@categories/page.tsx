import { CategorySelector } from "@/components/category/category-selector";
import { useGetCategories } from "@/lib/services/category/useServerCategory";

export default async function CategoriesSection() {
  const { data: categories  } = await useGetCategories();
  return <CategorySelector categories={categories ?? []} limit={5} showHeader />;
}
