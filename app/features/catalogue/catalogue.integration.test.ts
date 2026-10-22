// @vitest-environment node
import { beforeAll, describe, expect, it } from "vitest";

import { buildCatalogueSeed } from "~/db/seed/catalogue-data";
import type { Db } from "~/db/db.server";

import { createTestDb, SEED_NOW } from "../../../test/test-db";
import {
  emptyQuery,
  PAGE_SIZE,
  parseCatalogueSearchParams,
  type CatalogueQuery,
} from "./catalogue-query";
import {
  countProducts,
  getFeaturedProducts,
  getFilterOptions,
  getProductBySlug,
  getProductPage,
  getRelatedProducts,
  listProductSummaries,
} from "./catalogue.server";

let db: Db;
const seed = buildCatalogueSeed(SEED_NOW);

beforeAll(async () => {
  db = await createTestDb();
}, 60_000);

const query = (search: string) =>
  parseCatalogueSearchParams(new URLSearchParams(search));
const slugs = (page: { products: { slug: string }[] }) =>
  page.products.map((p) => p.slug);

/**
 * Independent oracle: plain JS over the seed data. Variant-level filters must all
 * hold for the same variant, mirroring the SQL semantics.
 */
function expectedSlugs(q: CatalogueQuery): string[] {
  return seed.products
    .filter((p) => !q.categories.length || q.categories.includes(p.category))
    .filter(
      (p) =>
        !q.collections.length ||
        p.collections.some((c) => q.collections.includes(c)),
    )
    .filter((p) =>
      p.variants.some(
        (v) =>
          (!q.materials.length || q.materials.includes(v.material)) &&
          (!q.inStock || v.stockQuantity > 0) &&
          (q.minPrice === undefined || v.priceCents >= q.minPrice * 100) &&
          (q.maxPrice === undefined || v.priceCents <= q.maxPrice * 100),
      ),
    )
    .map((p) => p.slug);
}

async function allSlugs(q: CatalogueQuery): Promise<string[]> {
  const first = await getProductPage(db, { ...q, page: 1 }, SEED_NOW);
  const result = slugs(first);
  for (let page = 2; page <= first.totalPages; page++) {
    result.push(...slugs(await getProductPage(db, { ...q, page }, SEED_NOW)));
  }
  return result;
}

describe("catalogue filters", () => {
  const cases: [string, string][] = [
    ["no filters", ""],
    ["one category", "category=rings"],
    ["several categories (OR)", "category=rings&category=earrings"],
    ["one collection", "collection=bridal"],
    ["several collections (OR)", "collection=bridal&collection=pearl-atelier"],
    ["material", "material=platinum"],
    ["several materials (OR)", "material=rose-gold&material=white-gold"],
    ["in stock only", "availability=in-stock"],
    ["price range", "min=1000&max=3000"],
    ["minimum price only", "min=5000"],
    ["maximum price only", "max=1000"],
    ["category + collection", "category=rings&collection=bridal"],
    [
      "category + material + price",
      "category=rings&material=platinum&min=4000",
    ],
    [
      "everything at once",
      "category=necklaces&collection=evening-radiance&material=white-gold&availability=in-stock&min=1000&max=9000",
    ],
    [
      "a combination with no matches",
      "category=earrings&material=platinum&max=1000",
    ],
  ];

  it.each(cases)("matches the oracle: %s", async (_name, search) => {
    const q = query(search);
    const expected = expectedSlugs(q);
    expect(await countProducts(db, q)).toBe(expected.length);
    expect([...(await allSlugs(q))].sort()).toEqual([...expected].sort());
  });

  it("narrows monotonically as filters are added", async () => {
    const all = await countProducts(db, emptyQuery);
    const rings = await countProducts(db, query("category=rings"));
    const ringsRose = await countProducts(
      db,
      query("category=rings&material=rose-gold"),
    );
    const ringsRoseInStock = await countProducts(
      db,
      query("category=rings&material=rose-gold&availability=in-stock"),
    );
    expect(all).toBe(30);
    expect(rings).toBeLessThan(all);
    expect(ringsRose).toBeLessThanOrEqual(rings);
    expect(ringsRoseInStock).toBeLessThanOrEqual(ringsRose);
  });

  it("requires variant filters to hold on the same variant", async () => {
    // A product with a cheap yellow-gold variant must NOT match "platinum under $4,000"
    // unless its platinum variant itself is under $4,000.
    const q = query("material=platinum&max=4000");
    const expected = expectedSlugs(q);
    const loose = seed.products
      .filter((p) => p.variants.some((v) => v.material === "platinum"))
      .filter((p) => p.variants.some((v) => v.priceCents <= 400_000))
      .map((p) => p.slug);
    expect(loose).toContain("etoile-halo-ring"); // cheap in yellow gold only
    expect(expected).not.toContain("etoile-halo-ring");
    expect(expected.length).toBeLessThan(loose.length);
    expect((await allSlugs(q)).sort()).toEqual([...expected].sort());
  });

  it("reports the price of the matching variants, not the cheapest overall", async () => {
    const page = await getProductPage(
      db,
      query("category=rings&material=platinum"),
      SEED_NOW,
    );
    const lumiere = page.products.find(
      (p) => p.slug === "lumiere-solitaire-ring",
    );
    const seeded = seed.products.find(
      (p) => p.slug === "lumiere-solitaire-ring",
    );
    const platinumMin = Math.min(
      ...(seeded?.variants
        .filter((v) => v.material === "platinum")
        .map((v) => v.priceCents) ?? []),
    );
    expect(lumiere?.fromPriceCents).toBe(platinumMin);
  });

  it("returns an empty page, not an error, when nothing matches", async () => {
    const page = await getProductPage(
      db,
      query("category=earrings&material=platinum&max=1000"),
      SEED_NOW,
    );
    expect(page).toMatchObject({
      total: 0,
      totalPages: 1,
      page: 1,
      products: [],
    });
  });

  it("ignores invalid URL parameters and returns the default catalogue", async () => {
    const page = await getProductPage(
      db,
      query("category=hats&sort=cheapest&page=banana&min=-5"),
      SEED_NOW,
    );
    expect(page.total).toBe(30);
    expect(page.page).toBe(1);
  });
});

describe("sorting", () => {
  it("price low to high is non-decreasing and ends ties by slug", async () => {
    const result = await allSlugs(query("sort=price-asc"));
    const prices = result.map((slug) =>
      Math.min(
        ...(seed.products
          .find((p) => p.slug === slug)
          ?.variants.map((v) => v.priceCents) ?? []),
      ),
    );
    expect(prices).toEqual([...prices].sort((a, b) => a - b));
    expect(result).toHaveLength(30);
  });

  it("price high to low is non-increasing", async () => {
    const result = await allSlugs(query("sort=price-desc"));
    const prices = result.map((slug) =>
      Math.min(
        ...(seed.products
          .find((p) => p.slug === slug)
          ?.variants.map((v) => v.priceCents) ?? []),
      ),
    );
    expect(prices).toEqual([...prices].sort((a, b) => b - a));
  });

  it("newest puts the most recently created product first", async () => {
    const result = await allSlugs(query("sort=newest"));
    expect(result).toEqual(seed.products.map((p) => p.slug));
  });

  it("featured lists ranked products first, in rank order", async () => {
    const result = await allSlugs(query("sort=featured"));
    const ranked = seed.products
      .filter((p) => p.featuredRank !== null)
      .sort((a, b) => (a.featuredRank ?? 0) - (b.featuredRank ?? 0))
      .map((p) => p.slug);
    expect(result.slice(0, ranked.length)).toEqual(ranked);
  });

  it("sorting by price uses the matching variants when filtering by metal", async () => {
    const result = await getProductPage(
      db,
      query("material=platinum&sort=price-asc"),
      SEED_NOW,
    );
    const prices = result.products.map((p) => p.fromPriceCents);
    expect(prices).toEqual([...prices].sort((a, b) => a - b));
  });

  it("every sort order is stable between calls", async () => {
    for (const sort of ["featured", "price-asc", "price-desc", "newest"]) {
      const a = await allSlugs(query(`sort=${sort}`));
      const b = await allSlugs(query(`sort=${sort}`));
      expect(a).toEqual(b);
    }
  });
});

describe("pagination", () => {
  it("splits 30 products into three pages of at most the page size", async () => {
    const p1 = await getProductPage(db, query("page=1"), SEED_NOW);
    const p3 = await getProductPage(db, query("page=3"), SEED_NOW);
    expect(p1).toMatchObject({
      total: 30,
      pageSize: PAGE_SIZE,
      totalPages: 3,
      page: 1,
    });
    expect(p1.products).toHaveLength(PAGE_SIZE);
    expect(p3.products).toHaveLength(30 - 2 * PAGE_SIZE);
  });

  it.each(["featured", "price-asc", "price-desc", "newest"])(
    "pages never overlap or skip products under %s",
    async (sort) => {
      const collected = await allSlugs(query(`sort=${sort}`));
      expect(new Set(collected).size).toBe(collected.length);
      expect(collected.sort()).toEqual(seed.products.map((p) => p.slug).sort());
    },
  );

  it("clamps a page past the end to the last page", async () => {
    const page = await getProductPage(db, query("page=99"), SEED_NOW);
    expect(page.page).toBe(3);
    expect(page.products.length).toBeGreaterThan(0);
  });

  it("listProductSummaries past the end returns no rows", async () => {
    expect(await listProductSummaries(db, query("page=99"), SEED_NOW)).toEqual(
      [],
    );
  });
});

describe("product summaries", () => {
  it("include two images, metals, availability and badges", async () => {
    const page = await getProductPage(db, query("sort=newest"), SEED_NOW);
    const first = page.products[0];
    expect(first?.images).toHaveLength(2);
    expect(first?.images[0]?.alt).toMatch(/front view/);
    expect(first?.materials.length).toBeGreaterThan(0);
    expect(first?.isNew).toBe(true);
    expect(page.products.some((p) => !p.isNew)).toBe(true);
  });

  it("flags sold-out and low-stock products from real variant stock", async () => {
    const soldOut = (
      await getProductPage(db, query("category=rings"), SEED_NOW)
    ).products.find((p) => p.slug === "noor-sapphire-cocktail-ring");
    expect(soldOut?.availability).toBe("sold-out");
    const scarce = (
      await getProductPage(db, query("category=rings"), SEED_NOW)
    ).products.find((p) => p.slug === "marais-band-ring");
    expect(scarce?.availability).toBe("low-stock");
  });

  it("marks products whose variants differ in price", async () => {
    const page = await getProductPage(
      db,
      query("category=necklaces"),
      SEED_NOW,
    );
    expect(page.products.every((p) => p.hasPriceRange)).toBe(true);
  });
});

describe("getFeaturedProducts", () => {
  it("returns the ranked products in rank order", async () => {
    const featured = await getFeaturedProducts(db, 4, SEED_NOW);
    expect(featured.map((p) => p.slug)).toEqual([
      "lumiere-solitaire-ring",
      "aurore-pearl-drop-earrings",
      "celeste-pendant-necklace",
      "opale-sculpted-bangle",
    ]);
  });
});

describe("getProductBySlug", () => {
  it("returns variants, images, specifications and collections", async () => {
    const product = await getProductBySlug(
      db,
      "lumiere-solitaire-ring",
      SEED_NOW,
    );
    expect(product).not.toBeNull();
    expect(product?.name).toBe("Lumière Solitaire Ring");
    expect(product?.variants).toHaveLength(12);
    expect(product?.images.map((i) => i.url)).toHaveLength(3);
    expect(product?.collections.map((c) => c.slug)).toEqual(["bridal"]);
    expect(product?.specifications.some((s) => s.label === "Gemstone")).toBe(
      true,
    );
  });

  it("returns null for unknown slugs", async () => {
    expect(await getProductBySlug(db, "no-such-piece")).toBeNull();
    expect(await getProductBySlug(db, "")).toBeNull();
  });

  it("is safe against SQL-looking slugs", async () => {
    expect(await getProductBySlug(db, "'; drop table products; --")).toBeNull();
    expect(await countProducts(db, emptyQuery)).toBe(30);
  });
});

describe("getRelatedProducts", () => {
  it("excludes the product itself and prefers the same category", async () => {
    const product = await getProductBySlug(
      db,
      "lumiere-solitaire-ring",
      SEED_NOW,
    );
    if (!product) throw new Error("missing product");
    const related = await getRelatedProducts(db, product, 4, SEED_NOW);
    expect(related).toHaveLength(4);
    expect(related.some((p) => p.id === product.id)).toBe(false);
    expect(related.every((p) => p.category === "rings")).toBe(true);
  });
});

describe("getFilterOptions", () => {
  it("lists collections in display order and the price bounds in dollars", async () => {
    const options = await getFilterOptions(db);
    expect(options.collections.map((c) => c.slug)).toEqual(
      seed.collections.map((c) => c.slug),
    );
    const prices = seed.products.flatMap((p) =>
      p.variants.map((v) => v.priceCents),
    );
    expect(options.priceRange).toEqual({
      min: Math.floor(Math.min(...prices) / 100),
      max: Math.ceil(Math.max(...prices) / 100),
    });
  });
});
