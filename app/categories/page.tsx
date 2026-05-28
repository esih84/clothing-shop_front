import { getCategories } from "@/lib/actions";
import { CategorySelector } from "@/components/category/category-selector";

export default function CategoriesPage() {
  const categoriesData = getCategories();
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <CategorySelector categoriesData={categoriesData} />
    </div>
  );
}
