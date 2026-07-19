import { CategorySlider } from "@/shared/components/category/category-slider";
import {
  getCategories,
  getFeaturedCategories,
} from "@/features/category/category-api";

export default async function CategoriesSection() {
  // اگر دسته‌های منتخبی تعیین شده باشند (شامل زیردسته‌ها)، همان‌ها را نشان می‌دهیم؛
  // در غیر این صورت به دسته‌های سطح اول برمی‌گردیم.
  const { data: featured } = await getFeaturedCategories();
  if (featured && featured.length > 0) {
    return <CategorySlider categories={featured} showHeader />;
  }
  const { data: categories } = await getCategories();
  return <CategorySlider categories={categories ?? []} showHeader />;
}
