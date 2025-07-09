import { CategorySelector } from "@/components/category-selector"
import { getCategories } from "@/lib/actions"

export default async function CategoriesSection() {
  const categories = await getCategories()

  return <CategorySelector categories={categories} />
}
