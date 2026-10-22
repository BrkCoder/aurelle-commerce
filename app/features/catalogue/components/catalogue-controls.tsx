import { X } from "lucide-react";
import { Link } from "react-router";

import { cn } from "~/lib/utils";

import {
  getActiveFilters,
  resetFilters,
  sortOptions,
  toSearchString,
  withOnlyListValue,
  withPage,
  withSort,
  type SortValue,
} from "../catalogue-query";
import { categories } from "../categories";
import type { CollectionSummary } from "../catalogue.types";
import { useCatalogueQuery, useGoToQuery } from "../use-catalogue-query";

export function SortSelect() {
  const query = useCatalogueQuery();
  const goTo = useGoToQuery();

  return (
    <label className="flex min-w-0 flex-1 items-center gap-3 text-sm sm:flex-none">
      {/* On narrow screens the label is visually hidden so the select can use the width. */}
      <span className="sr-only text-xs tracking-[0.18em] whitespace-nowrap uppercase sm:not-sr-only">
        Sort by
      </span>
      <select
        value={query.sort}
        onChange={(event) =>
          goTo((current) => withSort(current, event.target.value as SortValue))
        }
        // w-full + min-w-0: WebKit will not shrink a select below its widest option otherwise.
        className="h-11 w-full min-w-0 flex-1 cursor-pointer border border-mocha/40 bg-transparent px-3 text-sm focus-visible:border-onyx sm:w-auto sm:flex-none"
      >
        {sortOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

/** Removable chips for each active filter, plus a single "Reset filters" action. */
export function ActiveFilters({
  collections,
}: {
  collections: CollectionSummary[];
}) {
  const query = useCatalogueQuery();
  const names = new Map(collections.map((c) => [c.slug, c.name]));
  const filters = getActiveFilters(query, names);
  if (filters.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2">
      <ul aria-label="Active filters" className="flex flex-wrap gap-2">
        {filters.map((filter) => (
          <li key={filter.id}>
            <Link
              to={{ search: toSearchString(filter.without) }}
              preventScrollReset
              className="inline-flex min-h-9 items-center gap-2 bg-sand px-3 text-sm transition-colors duration-200 hover:bg-champagne/40"
            >
              {filter.label}
              <X aria-hidden="true" className="size-3.5" />
              <span className="sr-only">Remove filter</span>
            </Link>
          </li>
        ))}
      </ul>
      <Link
        to={{ search: toSearchString(resetFilters(query)) }}
        preventScrollReset
        className="inline-flex min-h-9 items-center px-2 text-xs tracking-[0.18em] uppercase underline decoration-champagne underline-offset-8"
      >
        Reset filters
      </Link>
    </div>
  );
}

const pill =
  "inline-flex min-h-11 items-center border px-5 text-xs tracking-[0.18em] uppercase transition-colors duration-200";

/** Quick navigation: pick one category or one collection (replacing that filter only). */
export function CatalogueNav({
  collections,
}: {
  collections: CollectionSummary[];
}) {
  const query = useCatalogueQuery();
  const onlyCategory =
    query.categories.length === 1 ? query.categories[0] : undefined;
  const onlyCollection =
    query.collections.length === 1 ? query.collections[0] : undefined;

  const item = (label: string, active: boolean, search: string) => (
    <li key={label} className="shrink-0">
      <Link
        to={{ search }}
        preventScrollReset
        aria-current={active ? "true" : undefined}
        className={cn(
          pill,
          active
            ? "border-onyx bg-onyx text-ivory"
            : "border-mocha/30 hover:border-onyx",
        )}
      >
        {label}
      </Link>
    </li>
  );

  return (
    <div className="space-y-3">
      <nav aria-label="Categories">
        <ul className="flex gap-2 overflow-x-auto pb-1 sm:flex-wrap sm:overflow-visible sm:pb-0">
          {item(
            "All",
            query.categories.length === 0,
            toSearchString(withOnlyListValue(query, "categories", null)),
          )}
          {categories.map((c) =>
            item(
              c.name,
              onlyCategory === c.slug,
              toSearchString(withOnlyListValue(query, "categories", c.slug)),
            ),
          )}
        </ul>
      </nav>
      <nav aria-label="Collections">
        <ul className="flex items-center gap-2 overflow-x-auto pb-1 sm:flex-wrap sm:overflow-visible sm:pb-0">
          <li className="mr-1 shrink-0 text-xs tracking-[0.18em] text-muted-foreground uppercase">
            Collections
          </li>
          {collections.map((c) =>
            item(
              c.name,
              onlyCollection === c.slug,
              toSearchString(
                withOnlyListValue(
                  query,
                  "collections",
                  onlyCollection === c.slug ? null : c.slug,
                ),
              ),
            ),
          )}
        </ul>
      </nav>
    </div>
  );
}

/** Compact page list: always the first, last and current pages with neighbours between. */
function pageItems(current: number, total: number): (number | "gap")[] {
  const pages = new Set([1, total, current - 1, current, current + 1]);
  const sorted = [...pages]
    .filter((p) => p >= 1 && p <= total)
    .sort((a, b) => a - b);
  return sorted.flatMap((page, i) =>
    i > 0 && page - (sorted[i - 1] ?? 0) > 1 ? ["gap" as const, page] : [page],
  );
}

export function Pagination({
  page,
  totalPages,
}: {
  page: number;
  totalPages: number;
}) {
  const query = useCatalogueQuery();
  if (totalPages <= 1) return null;

  const hrefFor = (n: number) => ({
    search: toSearchString(withPage(query, n)),
  });
  const cell = "grid size-11 place-items-center text-sm";
  const step =
    "inline-flex min-h-11 items-center px-3 text-xs tracking-[0.18em] uppercase";

  return (
    <nav
      aria-label="Pagination"
      className="mt-14 flex items-center justify-center gap-1"
    >
      {page > 1 ? (
        <Link to={hrefFor(page - 1)} rel="prev" className={step}>
          Previous
        </Link>
      ) : (
        <span
          aria-disabled="true"
          className={cn(step, "text-muted-foreground/60")}
        >
          Previous
        </span>
      )}
      <ul className="flex items-center">
        {pageItems(page, totalPages).map((item, i) =>
          item === "gap" ? (
            <li key={`gap-${i}`} aria-hidden="true" className={cell}>
              …
            </li>
          ) : (
            <li key={item}>
              <Link
                to={hrefFor(item)}
                aria-label={`Page ${item}`}
                aria-current={item === page ? "page" : undefined}
                className={cn(
                  cell,
                  "transition-colors duration-200",
                  item === page ? "bg-onyx text-ivory" : "hover:bg-sand",
                )}
              >
                {item}
              </Link>
            </li>
          ),
        )}
      </ul>
      {page < totalPages ? (
        <Link to={hrefFor(page + 1)} rel="next" className={step}>
          Next
        </Link>
      ) : (
        <span
          aria-disabled="true"
          className={cn(step, "text-muted-foreground/60")}
        >
          Next
        </span>
      )}
    </nav>
  );
}
