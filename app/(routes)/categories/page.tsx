import { CategorySelector } from "@/shared/components/category/category-selector";
import { getCategories } from "@/features/category/category-api";

export default async function CategoriesPage() {
const { data: categories  } = await getCategories();
return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <CategorySelector categories={categories?? []} />
    </div>
  );
}
