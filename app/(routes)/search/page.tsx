import { redirect } from "next/navigation";

interface SearchPageProps {
  searchParams: Promise<Record<string, string | undefined>>;
}

/**
 * صفحه‌ی جستجو حذف و با `/products` جایگزین شد.
 * این مسیر فقط برای سازگاری با لینک‌های قدیمی، کوئری را حفظ و ریدایرکت می‌کند.
 */
export default async function SearchRedirect({ searchParams }: SearchPageProps) {
  const sp = await searchParams;
  const qs = new URLSearchParams(
    Object.entries(sp).filter(
      (entry): entry is [string, string] => entry[1] != null,
    ),
  ).toString();
  redirect(qs ? `/products?${qs}` : "/products");
}
