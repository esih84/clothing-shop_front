import { redirect } from "next/navigation";

interface SearchPageProps {
  searchParams: Promise<Record<string, string | undefined>>;
}

/**
 * The search page was removed and replaced with `/products`.
 * This route only preserves the query and redirects, for compatibility with old links.
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
