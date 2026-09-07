"use client";

import { Fragment, useState } from "react";
import Link from "next/link";
import { ChevronLeft, MoreHorizontal } from "lucide-react";

export interface Crumb {
  name: string;
  /** Site-relative path. Omitted on the last crumb (the current page). */
  href?: string;
}

/**
 * Visual part of the breadcrumb trail.
 *
 * On small screens only the first and last crumb stay visible; everything in
 * between collapses behind an ellipsis button that expands the full trail.
 * From `md` up the whole trail is always shown and the button is hidden.
 */
export function BreadcrumbsNav({
  crumbs,
  className = "",
}: {
  crumbs: Crumb[];
  className?: string;
}) {
  const [expanded, setExpanded] = useState(false);
  const collapsible = crumbs.length > 2;
  const collapsed = collapsible && !expanded;

  return (
    <nav
      aria-label="مسیر ناوبری"
      className={`flex items-center gap-1.5 text-sm min-w-0 md:flex-wrap ${
        collapsed ? "flex-nowrap" : "flex-wrap"
      } ${className}`}
    >
      {crumbs.map((crumb, index) => {
        const isLast = index === crumbs.length - 1;
        const isMiddle = index > 0 && !isLast;

        return (
          <Fragment key={`${crumb.name}-${index}`}>
            {/* The ellipsis takes the place of the whole middle section. */}
            {collapsible && index === 1 && (
              <span
                className={`items-center gap-1.5 shrink-0 ${
                  expanded ? "hidden" : "flex md:hidden"
                }`}
              >
                <ChevronLeft
                  className="w-3.5 h-3.5 text-muted-foreground shrink-0"
                  aria-hidden
                />
                <button
                  type="button"
                  onClick={() => setExpanded(true)}
                  aria-label="نمایش کامل مسیر ناوبری"
                  aria-expanded={false}
                  className="flex items-center rounded px-1 py-0.5 text-muted-foreground transition-colors hover:bg-muted hover:text-secondary"
                >
                  <MoreHorizontal className="w-4 h-4" aria-hidden />
                </button>
              </span>
            )}

            <span
              className={`items-center gap-1.5 min-w-0 ${
                isLast ? "" : "shrink-0"
              } ${
                isMiddle && collapsible && !expanded ? "hidden md:flex" : "flex"
              }`}
            >
              {index > 0 && (
                <ChevronLeft
                  className="w-3.5 h-3.5 text-muted-foreground shrink-0"
                  aria-hidden
                />
              )}
              {isLast || !crumb.href ? (
                <span className="font-bold text-secondary line-clamp-1">
                  {crumb.name}
                </span>
              ) : (
                <Link
                  href={crumb.href}
                  className="text-secondary hover:underline line-clamp-1"
                >
                  {crumb.name}
                </Link>
              )}
            </span>
          </Fragment>
        );
      })}
    </nav>
  );
}
