import {
  and,
  asc,
  count,
  desc,
  eq,
  exists,
  gt,
  gte,
  inArray,
  isNotNull,
  lte,
  ne,
  or,
  sql,
  type SQL,
} from "drizzle-orm";

import type { Db } from "~/db/db.server";
import {
  collections,
  productCollections,
  productImages,
  products,
  productVariants,
} from "~/db/schema";

import { getAvailability, isNewProduct } from "./availability";
import { emptyQuery, PAGE_SIZE, type CatalogueQuery } from "./catalogue-query";
import type {
  CatalogueImage,
  FilterOptions,
  ProductDetail,
  ProductPage,
  ProductSummary,
  ProductVariant,
} from "./catalogue.types";
import { materials } from "./materials";

/**
 * Server-only catalogue reads. Everything (filtering, sorting, pagination) runs in
 * SQL; the browser never receives more than one page. Functions take `db` so
 * tests can run them against an in-memory Postgres.
 */

// ---- Query building ----

/**
 * Variant-level filters. They are applied to the *same* variant, so
 * "rose gold + in stock + under $2,000" means one variant satisfies all three.
 */
function variantConditions(query: CatalogueQuery): SQL[] {
  const conditions: SQL[] = [];
  if (query.materials.length)
    conditions.push(inArray(productVariants.material, query.materials));
  if (query.inStock) conditions.push(gt(productVariants.stockQuantity, 0));
  if (query.minPrice !== undefined)
    conditions.push(gte(productVariants.priceCents, query.minPrice * 100));
  if (query.maxPrice !== undefined)
    conditions.push(lte(productVariants.priceCents, query.maxPrice * 100));
  return conditions;
}

function matchingVariantPrice(fn: "min" | "max", query: CatalogueQuery) {
  const where = and(
    eq(productVariants.productId, products.id),
    ...variantConditions(query),
  );
  return sql<number>`(select ${sql.raw(fn)}(${productVariants.priceCents}) from ${productVariants} where ${where})`.mapWith(
    Number,
  );
}

function productWhere(db: Db, query: CatalogueQuery): SQL | undefined {
  return and(
    query.categories.length
      ? inArray(products.category, query.categories)
      : undefined,
    query.collections.length
      ? exists(
          db
            .select({ one: sql`1` })
            .from(productCollections)
            .innerJoin(
              collections,
              eq(collections.id, productCollections.collectionId),
            )
            .where(
              and(
                eq(productCollections.productId, products.id),
                inArray(collections.slug, query.collections),
              ),
            ),
        )
      : undefined,
    // Also guarantees every listed product has a variant to price it.
    exists(
      db
        .select({ one: sql`1` })
        .from(productVariants)
        .where(
          and(
            eq(productVariants.productId, products.id),
            ...variantConditions(query),
          ),
        ),
    ),
  );
}

/** Every ordering ends in the unique slug, so pages never overlap or skip. */
function productOrder(query: CatalogueQuery): SQL[] {
  switch (query.sort) {
    case "price-asc":
      return [asc(matchingVariantPrice("min", query)), asc(products.slug)];
    case "price-desc":
      return [desc(matchingVariantPrice("min", query)), asc(products.slug)];
    case "newest":
      return [desc(products.createdAt), asc(products.slug)];
    case "featured":
      return [
        sql`${products.featuredRank} asc nulls last`,
        desc(products.createdAt),
        asc(products.slug),
      ];
  }
}

// ---- Summaries (cards) ----

type SummaryRow = {
  id: string;
  slug: string;
  name: string;
  category: ProductSummary["category"];
  createdAt: Date;
  fromPriceCents: number;
  toPriceCents: number;
};

async function toSummaries(
  db: Db,
  rows: SummaryRow[],
  now: Date,
): Promise<ProductSummary[]> {
  if (rows.length === 0) return [];
  const ids = rows.map((r) => r.id);

  // Two batched queries instead of one per product.
  const [variantRows, imageRows] = await Promise.all([
    db
      .select({
        productId: productVariants.productId,
        material: productVariants.material,
        currency: productVariants.currency,
        stockQuantity: productVariants.stockQuantity,
      })
      .from(productVariants)
      .where(inArray(productVariants.productId, ids)),
    db
      .select({
        productId: productImages.productId,
        url: productImages.url,
        sources: productImages.sources,
        alt: productImages.alt,
        width: productImages.width,
        height: productImages.height,
      })
      .from(productImages)
      .where(
        and(
          inArray(productImages.productId, ids),
          lte(productImages.sortOrder, 2),
        ),
      )
      .orderBy(asc(productImages.sortOrder)),
  ]);

  return rows.map((row) => {
    const variants = variantRows.filter((v) => v.productId === row.id);
    const images: CatalogueImage[] = imageRows
      .filter((i) => i.productId === row.id)
      .map(({ url, sources, alt, width, height }) => ({
        url,
        sources,
        alt,
        width,
        height,
      }));
    return {
      id: row.id,
      slug: row.slug,
      name: row.name,
      category: row.category,
      fromPriceCents: row.fromPriceCents,
      currency: variants[0]?.currency ?? "USD",
      hasPriceRange: row.toPriceCents > row.fromPriceCents,
      images,
      materials: materials
        .filter((m) => variants.some((v) => v.material === m.slug))
        .map((m) => m.slug),
      availability: getAvailability(
        variants.reduce((sum, v) => sum + v.stockQuantity, 0),
      ),
      isNew: isNewProduct(row.createdAt, now),
    };
  });
}

function summarySelect(query: CatalogueQuery) {
  return {
    id: products.id,
    slug: products.slug,
    name: products.name,
    category: products.category,
    createdAt: products.createdAt,
    fromPriceCents: matchingVariantPrice("min", query),
    toPriceCents: matchingVariantPrice("max", query),
  };
}

export function countProducts(db: Db, query: CatalogueQuery): Promise<number> {
  return db
    .select({ value: count() })
    .from(products)
    .where(productWhere(db, query))
    .then((rows) => rows[0]?.value ?? 0);
}

/** One page, exactly as `query.page` says. Pair with `countProducts` to clamp the page. */
export async function listProductSummaries(
  db: Db,
  query: CatalogueQuery,
  now: Date = new Date(),
): Promise<ProductSummary[]> {
  const rows = await db
    .select(summarySelect(query))
    .from(products)
    .where(productWhere(db, query))
    .orderBy(...productOrder(query))
    .limit(PAGE_SIZE)
    .offset((query.page - 1) * PAGE_SIZE);
  return toSummaries(db, rows, now);
}

export function pageCount(total: number): number {
  return Math.max(1, Math.ceil(total / PAGE_SIZE));
}

/** Convenience for callers (and tests) that want count, clamping and rows together. */
export async function getProductPage(
  db: Db,
  query: CatalogueQuery,
  now: Date = new Date(),
): Promise<ProductPage> {
  const total = await countProducts(db, query);
  const totalPages = pageCount(total);
  const page = Math.min(query.page, totalPages);
  const productsOnPage = await listProductSummaries(
    db,
    { ...query, page },
    now,
  );
  return {
    products: productsOnPage,
    total,
    page,
    pageSize: PAGE_SIZE,
    totalPages,
  };
}

export async function getFeaturedProducts(
  db: Db,
  limit = 4,
  now: Date = new Date(),
): Promise<ProductSummary[]> {
  const rows = await db
    .select(summarySelect(emptyQuery))
    .from(products)
    .where(isNotNull(products.featuredRank))
    .orderBy(asc(products.featuredRank), asc(products.slug))
    .limit(limit);
  return toSummaries(db, rows, now);
}

export async function getFilterOptions(db: Db): Promise<FilterOptions> {
  const [collectionRows, [bounds]] = await Promise.all([
    db
      .select({
        slug: collections.slug,
        name: collections.name,
        description: collections.description,
      })
      .from(collections)
      .orderBy(asc(collections.sortOrder), asc(collections.slug)),
    db
      .select({
        min: sql<number>`min(${productVariants.priceCents})`.mapWith(Number),
        max: sql<number>`max(${productVariants.priceCents})`.mapWith(Number),
      })
      .from(productVariants),
  ]);
  return {
    collections: collectionRows,
    priceRange: {
      min: Math.floor((bounds?.min ?? 0) / 100),
      max: Math.ceil((bounds?.max ?? 0) / 100),
    },
  };
}

// ---- Product detail ----

/** Returns null for unknown slugs and for products with no variants (nothing to price). */
export async function getProductBySlug(
  db: Db,
  slug: string,
  now: Date = new Date(),
): Promise<ProductDetail | null> {
  const [product] = await db
    .select()
    .from(products)
    .where(eq(products.slug, slug))
    .limit(1);
  if (!product) return null;

  const [variantRows, imageRows, collectionRows] = await Promise.all([
    db
      .select()
      .from(productVariants)
      .where(eq(productVariants.productId, product.id)),
    db
      .select()
      .from(productImages)
      .where(eq(productImages.productId, product.id))
      .orderBy(asc(productImages.sortOrder)),
    db
      .select({
        slug: collections.slug,
        name: collections.name,
        description: collections.description,
      })
      .from(productCollections)
      .innerJoin(
        collections,
        eq(collections.id, productCollections.collectionId),
      )
      .where(eq(productCollections.productId, product.id))
      .orderBy(asc(collections.sortOrder)),
  ]);
  if (variantRows.length === 0) return null;

  const variants: ProductVariant[] = variantRows.map((v) => ({
    id: v.id,
    sku: v.sku,
    material: v.material,
    size: v.size,
    priceCents: v.priceCents,
    currency: v.currency,
    stockQuantity: v.stockQuantity,
  }));

  return {
    id: product.id,
    slug: product.slug,
    name: product.name,
    category: product.category,
    description: product.description,
    gemstone: product.gemstone,
    specifications: product.specifications,
    images: imageRows.map(({ url, sources, alt, width, height }) => ({
      url,
      sources,
      alt,
      width,
      height,
    })),
    variants,
    collections: collectionRows,
    isNew: isNewProduct(product.createdAt, now),
  };
}

/** Same category or a shared collection; same-category pieces first. Never the product itself. */
export async function getRelatedProducts(
  db: Db,
  product: Pick<ProductDetail, "id" | "category">,
  limit = 4,
  now: Date = new Date(),
): Promise<ProductSummary[]> {
  const sharesCollection = exists(
    db
      .select({ one: sql`1` })
      .from(productCollections)
      .where(
        and(
          eq(productCollections.productId, products.id),
          inArray(
            productCollections.collectionId,
            db
              .select({ id: productCollections.collectionId })
              .from(productCollections)
              .where(eq(productCollections.productId, product.id)),
          ),
        ),
      ),
  );

  const rows = await db
    .select(summarySelect(emptyQuery))
    .from(products)
    .where(
      and(
        ne(products.id, product.id),
        or(eq(products.category, product.category), sharesCollection),
        exists(
          db
            .select({ one: sql`1` })
            .from(productVariants)
            .where(eq(productVariants.productId, products.id)),
        ),
      ),
    )
    .orderBy(
      sql`case when ${products.category} = ${product.category} then 0 else 1 end`,
      sql`${products.featuredRank} asc nulls last`,
      asc(products.slug),
    )
    .limit(limit);
  return toSummaries(db, rows, now);
}
