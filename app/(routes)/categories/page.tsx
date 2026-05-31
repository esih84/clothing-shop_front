import { CategorySelector } from "@/components/category/category-selector";
import { useGetCategories } from "@/lib/services/category/useServerCategory";

export default async function CategoriesPage() {
const { data: categories  } = await useGetCategories();  
return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <CategorySelector categories={categories?? []} />
    </div>
  );
}
