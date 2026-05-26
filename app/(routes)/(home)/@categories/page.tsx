import { CategorySelector } from "@/components/category/category-selector"
import { getCategories } from "@/lib/actions"

export default async function CategoriesSection() {
  const categories =  getCategories()

  return <CategorySelector categoriesData={categories} />
}
