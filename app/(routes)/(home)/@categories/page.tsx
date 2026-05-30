import { CategorySelector } from "@/components/category/category-selector";
import { categoryService } from "@/lib/services/category";

export default function CategoriesSection() {
  //TODO : add category api for get home category
  const categories = categoryService.findAll();

  return <CategorySelector categoriesData={categories} limit={5} showHeader />;
}
