import { JsonLd } from "@/shared/components/global/json-ld";
import { BreadcrumbsNav, type Crumb } from "@/shared/components/global/breadcrumbs-nav";
import { absolute } from "@/shared/lib/urls";

export type { Crumb };

/**
 * Visual RTL breadcrumb plus the matching `BreadcrumbList` structured data.
 *
 * "خانه" is prepended automatically, so callers pass only the trail below it.
 * The structured data always lists the full trail, even when the visual trail
 * is collapsed on small screens.
 */
export function Breadcrumbs({
  items,
  className = "",
}: {
  items: Crumb[];
  className?: string;
}) {
  const crumbs: Crumb[] = [{ name: "خانه", href: "/" }, ...items];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((crumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: crumb.name,
      // The last item is the current page and carries no `item`, per Google's guidance.
      ...(crumb.href ? { item: absolute(crumb.href) } : {}),
    })),
  };

  return (
    <>
      <JsonLd data={jsonLd} />
      <BreadcrumbsNav crumbs={crumbs} className={className} />
    </>
  );
}
