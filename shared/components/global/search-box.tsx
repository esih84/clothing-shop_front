"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, X, Clock, Tag, Store, Loader2 } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { productService } from "@/features/product/product-api";
import { queryKeys } from "@/features/query-keys";
import { useSiteSettings } from "@/shared/config/site-settings-provider";
import { getDiscountInfo } from "@/shared/lib/discount";
import { formatToman } from "@/shared/lib/utils";
import { brandPath, categoryPath, productPath } from "@/shared/lib/urls";

/** Long enough that a two-letter query does not fire a request per keystroke. */
const MIN_QUERY_LENGTH = 2;

/** Roughly a fast typist's inter-key gap — below this the request is wasted work. */
const DEBOUNCE_MS = 250;

const RECENT_KEY = "petshop:recent-searches";
const RECENT_LIMIT = 5;

/** One row of the dropdown, flattened so the arrow keys can walk products and shortcuts alike. */
type SuggestionRow = {
  key: string;
  href: string;
  /** What goes into the recent-search list when this row is chosen. */
  term: string;
  node: React.ReactNode;
};

function readRecentSearches(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(RECENT_KEY);
    const parsed: unknown = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed)
      ? parsed.filter((v): v is string => typeof v === "string")
      : [];
  } catch {
    // Private mode, disabled site data — recent searches are a convenience, never a requirement.
    return [];
  }
}

/**
 * The header search: an input that submits to `/products`, plus a suggestion dropdown so a
 * shopper can reach a product, a category or a brand without loading the results page at all.
 *
 * Suggestions come from `/products/suggest`, which folds the query the same way the results page
 * does — so what the dropdown shows and what `/products?search=…` returns cannot disagree.
 */
export function SearchBox({
  isOpen,
  onClose,
  inputRef,
}: {
  isOpen: boolean;
  onClose: () => void;
  inputRef: React.RefObject<HTMLInputElement>;
}) {
  const { brand } = useSiteSettings();
  const router = useRouter();

  const [query, setQuery] = useState("");
  const [debounced, setDebounced] = useState("");
  const [focused, setFocused] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [recent, setRecent] = useState<string[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => setRecent(readRecentSearches()), []);

  // The input stays fully controlled; only the *query sent to the server* is debounced, so typing
  // never feels laggy while the dropdown catches up.
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(query.trim()), DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [query]);

  const term = debounced.length >= MIN_QUERY_LENGTH ? debounced : "";

  const { data, isFetching } = useQuery({
    queryKey: queryKeys.productSuggest(term),
    queryFn: ({ signal }) => productService.suggest(term, 6, signal),
    enabled: focused && term.length > 0,
    // A product catalogue does not change between two keystrokes; re-typing a prefix should be free.
    staleTime: 5 * 60 * 1000,
  });

  const rememberSearch = useCallback((value: string) => {
    const trimmed = value.trim();
    if (!trimmed) return;
    setRecent((previous) => {
      const next = [
        trimmed,
        ...previous.filter((item) => item !== trimmed),
      ].slice(0, RECENT_LIMIT);
      try {
        window.localStorage.setItem(RECENT_KEY, JSON.stringify(next));
      } catch {
        // Nothing to do — the list simply will not survive this session.
      }
      return next;
    });
  }, []);

  const close = useCallback(() => {
    setFocused(false);
    setActiveIndex(-1);
    onClose();
  }, [onClose]);

  const submitSearch = useCallback(
    (value: string) => {
      const q = value.trim();
      if (q) rememberSearch(q);
      router.push(q ? `/products?search=${encodeURIComponent(q)}` : "/products");
      close();
    },
    [close, rememberSearch, router],
  );

  const goTo = useCallback(
    (row: SuggestionRow) => {
      rememberSearch(row.term);
      router.push(row.href);
      close();
    },
    [close, rememberSearch, router],
  );

  const products = data?.products ?? [];
  const categories = data?.categories ?? [];
  const brands = data?.brands ?? [];
  const hasSuggestions =
    products.length > 0 || categories.length > 0 || brands.length > 0;

  // One flat list of everything selectable, in the order it is painted — the arrow keys walk this,
  // so a row can never be highlighted that the eye does not see in the same place.
  const rows = useMemo<SuggestionRow[]>(() => {
    if (!term) {
      return recent.map((item) => ({
        key: `recent:${item}`,
        href: `/products?search=${encodeURIComponent(item)}`,
        term: item,
        node: (
          <span className="flex items-center gap-2 min-w-0">
            <Clock className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
            <span className="text-sm text-muted-foreground truncate">
              {item}
            </span>
          </span>
        ),
      }));
    }

    const productRows = products.map((product) => {
      const { hasDiscount, finalPrice, originalPrice } =
        getDiscountInfo(product);
      const image =
        product.images?.[0]?.thumbnailUrl ||
        product.images?.[0]?.url ||
        "/placeholder.svg";

      return {
        key: `product:${product.id}`,
        href: productPath(product.slug),
        term: product.name,
        node: (
          <span className="flex items-center gap-3 min-w-0">
            <span className="relative w-11 h-11 shrink-0 overflow-hidden rounded-xl border border-border bg-muted">
              <Image
                src={image}
                alt={product.name}
                fill
                sizes="44px"
                className="object-cover"
              />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-sm text-foreground truncate">
                {product.name}
              </span>
              {/* Prices stacked, never side by side, and always with the unit. */}
              <span className="block text-xs font-bold text-secondary">
                {formatToman(finalPrice)}
              </span>
              {hasDiscount && (
                <span className="block text-[0.65rem] text-muted-foreground line-through">
                  {formatToman(originalPrice)}
                </span>
              )}
            </span>
          </span>
        ),
      };
    });

    const taxonomyRow = (
      kind: "category" | "brand",
      item: { id: string; name: string; slug: string },
    ) => ({
      key: `${kind}:${item.id}`,
      href: kind === "category" ? categoryPath(item.slug) : brandPath(item.slug),
      term: item.name,
      node: (
        <span className="flex items-center gap-2 min-w-0">
          {kind === "category" ? (
            <Tag className="w-3.5 h-3.5 text-secondary shrink-0" />
          ) : (
            <Store className="w-3.5 h-3.5 text-secondary shrink-0" />
          )}
          <span className="text-sm text-foreground truncate">{item.name}</span>
          <span className="text-[0.65rem] text-muted-foreground shrink-0">
            {kind === "category" ? "دسته‌بندی" : "برند"}
          </span>
        </span>
      ),
    });

    return [
      ...productRows,
      ...categories.map((item) => taxonomyRow("category", item)),
      ...brands.map((item) => taxonomyRow("brand", item)),
      {
        key: "all",
        href: `/products?search=${encodeURIComponent(debounced)}`,
        term: debounced,
        node: (
          <span className="text-sm font-medium text-secondary">
            مشاهده‌ی همه‌ی نتایج «{debounced}»
          </span>
        ),
      },
    ];
  }, [brands, categories, debounced, products, recent, term]);

  // The panel is worth opening for recent searches too, but only once there is something in it.
  const panelOpen = focused && rows.length > 0;

  useEffect(() => setActiveIndex(-1), [term]);

  // Clicking anywhere else dismisses the panel. Bound on `pointerdown` rather than `click` so the
  // panel is gone before a click on the page behind it does anything.
  useEffect(() => {
    if (!panelOpen) return;
    const onPointerDown = (event: PointerEvent) => {
      if (!containerRef.current?.contains(event.target as Node))
        setFocused(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [panelOpen]);

  const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Escape") {
      setFocused(false);
      setActiveIndex(-1);
      return;
    }
    if (!panelOpen) return;

    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      const step = event.key === "ArrowDown" ? 1 : -1;
      setActiveIndex((current) => {
        const next = current + step;
        if (next < 0) return rows.length - 1;
        if (next >= rows.length) return 0;
        return next;
      });
    }
  };

  return (
    <>
      {/* Backdrop (mobile only) */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-[2px] z-30 sm:hidden"
          onClick={onClose}
        />
      )}

      {/* Search input — inline on md+, overlay on mobile */}
      <div
        ref={containerRef}
        className={`
          transition-all duration-300 ease-in-out
          sm:flex-1 sm:block sm:opacity-100 sm:max-w-none sm:relative sm:z-auto
          ${
            isOpen
              ? "fixed top-0 left-0 right-0 z-50 px-4 pt-4 pb-3 bg-card shadow-lg sm:static sm:p-0 sm:shadow-none sm:bg-transparent"
              : "hidden sm:block"
          }
        `}
      >
        {/* Mobile top bar inside overlay */}
        {isOpen && (
          <div className="flex items-center justify-between mb-3 sm:hidden">
            <span className="text-sm font-semibold text-foreground">جستجو</span>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-muted transition-colors"
              aria-label="بستن جستجو"
            >
              <X className="w-5 h-5 text-muted-foreground" />
            </button>
          </div>
        )}

        <form
          className="relative group"
          role="search"
          onSubmit={(event) => {
            event.preventDefault();
            const active = activeIndex >= 0 ? rows[activeIndex] : undefined;
            if (active) goTo(active);
            else submitSearch(query);
          }}
        >
          <Search className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-secondary transition-colors pointer-events-none" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onFocus={() => setFocused(true)}
            onKeyDown={onKeyDown}
            placeholder={`جستجو در ${brand.name}...`}
            dir="rtl"
            role="combobox"
            aria-expanded={panelOpen}
            aria-controls="search-suggestions"
            aria-autocomplete="list"
            className="
              w-full pr-10 pl-10 py-2.5 rounded-2xl
              bg-muted border border-border
              text-sm text-foreground placeholder:text-muted-foreground
              focus:outline-none focus:border-secondary/60 focus:bg-card focus:ring-2 focus:ring-secondary/15
              transition-all duration-200
            "
          />
          {(isFetching || query) && (
            <span className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center">
              {isFetching ? (
                <Loader2 className="w-3.5 h-3.5 text-muted-foreground animate-spin" />
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    setQuery("");
                    inputRef.current?.focus();
                  }}
                  className="p-0.5 rounded-full hover:bg-muted transition-colors"
                  aria-label="پاک کردن جستجو"
                >
                  <X className="w-3.5 h-3.5 text-muted-foreground" />
                </button>
              )}
            </span>
          )}
        </form>

        {panelOpen && (
          <div
            id="search-suggestions"
            role="listbox"
            className="absolute right-0 left-0 mt-2 z-50 max-h-[70vh] overflow-y-auto rounded-2xl border border-border bg-card shadow-lg p-2"
          >
            {!term && (
              <p className="px-3 pt-1 pb-2 text-xs text-muted-foreground">
                جستجوهای اخیر
              </p>
            )}

            {/* An empty search that still returns rows means the backend widened the query. Saying
                so keeps a shopper from reading an approximate list as an exact one. */}
            {term && data?.searchRelaxed && hasSuggestions && (
              <p className="px-3 pt-1 pb-2 text-xs text-muted-foreground">
                نتیجه‌ی دقیقی پیدا نشد؛ نزدیک‌ترین‌ها:
              </p>
            )}

            {term && !isFetching && !hasSuggestions && (
              <p className="px-3 py-4 text-sm text-muted-foreground text-center">
                محصولی پیدا نشد. برای دیدن پیشنهادها اینتر بزنید.
              </p>
            )}

            {rows.map((row, index) => (
              <Link
                key={row.key}
                href={row.href}
                role="option"
                aria-selected={index === activeIndex}
                prefetch={false}
                onMouseEnter={() => setActiveIndex(index)}
                onClick={(event) => {
                  // Let a modified click keep its native meaning (open in a new tab); only a
                  // plain one is intercepted, so the term can be recorded and the panel closed.
                  if (event.metaKey || event.ctrlKey || event.shiftKey) return;
                  event.preventDefault();
                  goTo(row);
                }}
                className={`flex items-center gap-2 w-full px-3 py-2 rounded-xl text-right transition-colors ${
                  index === activeIndex ? "bg-muted" : "hover:bg-muted"
                }`}
              >
                {row.node}
              </Link>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
