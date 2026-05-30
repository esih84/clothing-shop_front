import { categoryService } from "./api";

export async function useGetCategories() {
  try {
    const categories = await categoryService.findAll();
    return { data: categories, error: null };
  } catch (error) {
    return { data: null, error };
  }
}

export async function useServerCategoryBySlug(slug: string) {
  try {
    const category = await categoryService.findBySlug(slug);
    return { data: category, error: null };
  } catch (error) {
    return { data: null, error };
  }
}
