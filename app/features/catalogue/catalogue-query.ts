import { z } from "zod";

import { categories, categorySlugs } from "./categories";
import { materials, materialSlugs } from "./materials";

export const PAGE_SIZE = 12;
/** Upper bound for price params (whole dollars): rejects absurd values early. */
export const MAX_PRICE_DOLLARS = 1_000_000;

export const sortOptions = [
  { value: "featured", label: "Featured" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "newest", label: "Newest" },
] as const;

export type SortValue = (typeof sortOptions)[number]["value"];
const sortValues = sortOptions.map((o) => o.value) as [
  SortValue,
  ...SortValue[],
];

const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

/** Keeps only allowed values, de-duplicated, in canonical (allowed-list) order. */
const enumList = <T extends string>(allowed: readonly T[]) =>
  z
    .array(z.string())
    .transform((values) => allowed.filter((a) => values.includes(a)));

const slugList = z
  .array(z.string())
  .transform((values) =>
    [...new Set(values.filter((v) => v.length <= 60 && SLUG.test(v)))].sort(),
  );

const integerParam = (min: number, max: number) =>
  z.preprocess(
    (v) =>
      typeof v === "string" && /^\d{1,7}$/.test(v) ? Number(v) : undefined,
    z.number().int().min(min).max(max).optional().catch(undefined),
  );

/**
 * Schema for the catalogue URL. Every field falls back to its default on bad
 * input (a hand-edited or stale URL should still render a page, never an error).
 */
const catalogueQuerySchema = z
  .object({
    categories: enumList(categorySlugs),
    collections: slugList,
    materials: enumList(materialSlugs),
    inStock: z.boolean(),
    minPrice: integerParam(0, MAX_PRICE_DOLLARS),
    maxPrice: integerParam(0, MAX_PRICE_DOLLARS),
    sort: z.enum(sortValues).catch("featured"),
    page: integerParam(1, 10_000).transform((p) => p ?? 1),
  })
  .transform((q) => {
    // A reversed range is almost certainly a typo; swap rather than return nothing.
    if (
      q.minPrice !== undefined &&
      q.maxPrice !== undefined &&
      q.minPrice > q.maxPrice
    ) {
      return { ...q, minPrice: q.maxPrice, maxPrice: q.minPrice };
    }
    return q;
  });

export type CatalogueQuery = z.output<typeof catalogueQuerySchema>;

export function parseCatalogueSearchParams(
  params: URLSearchParams,
): CatalogueQuery {
  return catalogueQuerySchema.parse({
    categories: params.getAll("category"),
    collections: params.getAll("collection"),
    materials: params.getAll("material"),
    inStock: params.get("availability") === "in-stock",
    minPrice: params.get("min") ?? undefined,
    maxPrice: params.get("max") ?? undefined,
    sort: params.get("sort") ?? undefined,
    page: params.get("page") ?? undefined,
  });
}

/** Canonical URL form: defaults omitted, stable param order. Round-trips with the parser. */
export function toSearchParams(query: CatalogueQuery): URLSearchParams {
  const params = new URLSearchParams();
  for (const c of query.categories) params.append("category", c);
  for (const c of query.collections) params.append("collection", c);
  for (const m of query.materials) params.append("material", m);
  if (query.inStock) params.set("availability", "in-stock");
  if (query.minPrice !== undefined) params.set("min", String(query.minPrice));
  if (query.maxPrice !== undefined) params.set("max", String(query.maxPrice));
  if (query.sort !== "featured") params.set("sort", query.sort);
  if (query.page > 1) params.set("page", String(query.page));
  return params;
}

export function toSearchString(query: CatalogueQuery): string {
  const search = toSearchParams(query).toString();
  return search ? `?${search}` : "";
}

// A literal, not `parse(...)`: a module-level call would keep Zod in every bundle that
// imports this feature, including pages that never parse a URL. A test pins it to the parser.
export const emptyQuery: CatalogueQuery = {
  categories: [],
  collections: [],
  materials: [],
  inStock: false,
  minPrice: undefined,
  maxPrice: undefined,
  sort: "featured",
  page: 1,
};

// ---- Changing the query. Any change to what is shown returns to page 1. ----

export function withPage(query: CatalogueQuery, page: number): CatalogueQuery {
  return { ...query, page };
}

export function withSort(
  query: CatalogueQuery,
  sort: SortValue,
): CatalogueQuery {
  return { ...query, sort, page: 1 };
}

type ListKey = "categories" | "collections" | "materials";

export function toggleListValue(
  query: CatalogueQuery,
  key: ListKey,
  value: string,
): CatalogueQuery {
  const current: string[] = query[key];
  const next = current.includes(value)
    ? current.filter((v) => v !== value)
    : [...current, value];
  // Re-parse so the list is validated and in canonical order again.
  return parseCatalogueSearchParams(
    toSearchParams({ ...query, [key]: next, page: 1 }),
  );
}

export function withOnlyListValue(
  query: CatalogueQuery,
  key: ListKey,
  value: string | null,
) {
  return parseCatalogueSearchParams(
    toSearchParams({
      ...query,
      [key]: value ? [value] : [],
      page: 1,
    }),
  );
}

export function withInStock(
  query: CatalogueQuery,
  inStock: boolean,
): CatalogueQuery {
  return { ...query, inStock, page: 1 };
}

export function withPriceRange(
  query: CatalogueQuery,
  minPrice: number | undefined,
  maxPrice: number | undefined,
): CatalogueQuery {
  return parseCatalogueSearchParams(
    toSearchParams({ ...query, minPrice, maxPrice, page: 1 }),
  );
}

/** Clears every filter but keeps the chosen sort order. */
export function resetFilters(query: CatalogueQuery): CatalogueQuery {
  return { ...emptyQuery, sort: query.sort };
}

// ---- Active filter chips ----

export type ActiveFilter = {
  id: string;
  label: string;
  /** The query with just this filter removed. */
  without: CatalogueQuery;
};

export function getActiveFilters(
  query: CatalogueQuery,
  collectionNames: ReadonlyMap<string, string> = new Map(),
): ActiveFilter[] {
  const filters: ActiveFilter[] = [];

  for (const slug of query.categories) {
    const label = categories.find((c) => c.slug === slug)?.name ?? slug;
    filters.push({
      id: `category:${slug}`,
      label,
      without: toggleListValue(query, "categories", slug),
    });
  }
  for (const slug of query.collections) {
    filters.push({
      id: `collection:${slug}`,
      label: collectionNames.get(slug) ?? slug,
      without: toggleListValue(query, "collections", slug),
    });
  }
  for (const slug of query.materials) {
    const label = materials.find((m) => m.slug === slug)?.name ?? slug;
    filters.push({
      id: `material:${slug}`,
      label,
      without: toggleListValue(query, "materials", slug),
    });
  }
  if (query.inStock) {
    filters.push({
      id: "availability",
      label: "In stock",
      without: withInStock(query, false),
    });
  }
  if (query.minPrice !== undefined || query.maxPrice !== undefined) {
    const label =
      query.minPrice !== undefined && query.maxPrice !== undefined
        ? `$${query.minPrice.toLocaleString("en-US")} – $${query.maxPrice.toLocaleString("en-US")}`
        : query.minPrice !== undefined
          ? `From $${query.minPrice.toLocaleString("en-US")}`
          : `Up to $${(query.maxPrice ?? 0).toLocaleString("en-US")}`;
    filters.push({
      id: "price",
      label,
      without: withPriceRange(query, undefined, undefined),
    });
  }
  return filters;
}

// ---- Page heading ----

export type CatalogueHeading = { title: string; description: string };

const DEFAULT_HEADING: CatalogueHeading = {
  title: "All jewellery",
  description:
    "Rings, necklaces, bracelets and earrings in gold, pearl and diamond.",
};

/**
 * A page that is exactly one category, or exactly one collection, gets that name as
 * its heading. Anything broader or mixed is just "All jewellery".
 */
export function getCatalogueHeading(
  query: CatalogueQuery,
  collectionList: readonly {
    slug: string;
    name: string;
    description: string;
  }[] = [],
): CatalogueHeading {
  const onlyCategory =
    query.categories.length === 1 && query.collections.length === 0;
  const onlyCollection =
    query.collections.length === 1 && query.categories.length === 0;

  if (onlyCategory) {
    const category = categories.find((c) => c.slug === query.categories[0]);
    if (category) return { title: category.name, description: category.blurb };
  }
  if (onlyCollection) {
    const collection = collectionList.find(
      (c) => c.slug === query.collections[0],
    );
    if (collection)
      return { title: collection.name, description: collection.description };
  }
  return DEFAULT_HEADING;
}
