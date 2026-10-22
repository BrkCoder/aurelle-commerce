// @vitest-environment node
import { count, eq } from "drizzle-orm";
import type { PgTable } from "drizzle-orm/pg-core";
import { beforeAll, describe, expect, it } from "vitest";

import { createTestDb, SEED_NOW } from "../../../test/test-db";
import type { Db } from "../db.server";
import {
  collections,
  productCollections,
  productImages,
  products,
  productVariants,
} from "../schema";
import { buildCatalogueSeed } from "./catalogue-data";
import { seedCatalogue } from "./seed-catalogue.server";

let db: Db;
beforeAll(async () => {
  db = await createTestDb();
}, 60_000);

async function countOf(table: PgTable) {
  const [row] = await db.select({ value: count() }).from(table);
  return row?.value ?? 0;
}

describe("catalogue seed", () => {
  const seed = buildCatalogueSeed(SEED_NOW);

  it("creates about 30 products across all four categories", async () => {
    expect(await countOf(products)).toBe(30);
    const categories = new Set(seed.products.map((p) => p.category));
    expect(categories).toEqual(
      new Set(["rings", "necklaces", "bracelets", "earrings"]),
    );
  });

  it("gives every product variants, three images and a collection", async () => {
    for (const product of seed.products) {
      expect(product.variants.length).toBeGreaterThan(0);
      expect(product.images).toHaveLength(3);
      expect(product.collections.length).toBeGreaterThan(0);
    }
    expect(await countOf(productImages)).toBe(90);
    expect(await countOf(collections)).toBe(5);
  });

  it("stores prices as positive integer cents in one currency", async () => {
    const rows = await db.select().from(productVariants);
    expect(rows.length).toBeGreaterThan(100);
    for (const row of rows) {
      expect(Number.isInteger(row.priceCents)).toBe(true);
      expect(row.priceCents).toBeGreaterThan(0);
      expect(row.currency).toBe("USD");
    }
  });

  it("includes sold-out, scarce and varied-stock variants", async () => {
    const rows = await db.select().from(productVariants);
    expect(rows.some((r) => r.stockQuantity === 0)).toBe(true);
    expect(rows.some((r) => r.stockQuantity > 0 && r.stockQuantity <= 3)).toBe(
      true,
    );
    expect(rows.some((r) => r.stockQuantity > 3)).toBe(true);
  });

  it("is idempotent: reseeding changes no row counts", async () => {
    const before = [
      await countOf(products),
      await countOf(productVariants),
      await countOf(productImages),
      await countOf(collections),
      await countOf(productCollections),
    ];
    await seedCatalogue(db, SEED_NOW);
    await seedCatalogue(db, new Date("2030-01-01T00:00:00Z"));
    const after = [
      await countOf(products),
      await countOf(productVariants),
      await countOf(productImages),
      await countOf(collections),
      await countOf(productCollections),
    ];
    expect(after).toEqual(before);
  });

  it("does not move created_at when reseeding later", async () => {
    const [row] = await db
      .select()
      .from(products)
      .where(eq(products.slug, "lumiere-solitaire-ring"));
    expect(row?.createdAt.getTime()).toBe(
      seed.products[0]?.createdAt.getTime(),
    );
  });
});

describe("schema constraints", () => {
  async function aProductId() {
    const [row] = await db.select({ id: products.id }).from(products).limit(1);
    if (!row) throw new Error("no products");
    return row.id;
  }

  it("rejects duplicate product slugs", async () => {
    const [existing] = await db.select().from(products).limit(1);
    await expect(
      db.insert(products).values({
        slug: existing?.slug ?? "x",
        name: "Dup",
        category: "rings",
        description: "d",
      }),
    ).rejects.toThrow();
  });

  it("rejects duplicate SKUs", async () => {
    const productId = await aProductId();
    const [variant] = await db.select().from(productVariants).limit(1);
    await expect(
      db.insert(productVariants).values({
        productId,
        sku: variant?.sku ?? "x",
        material: "platinum",
        size: "99",
        priceCents: 100,
      }),
    ).rejects.toThrow();
  });

  it("rejects non-positive prices and negative stock", async () => {
    const productId = await aProductId();
    await expect(
      db.insert(productVariants).values({
        productId,
        sku: "BAD-1",
        material: "platinum",
        size: "98",
        priceCents: 0,
      }),
    ).rejects.toThrow();
    await expect(
      db.insert(productVariants).values({
        productId,
        sku: "BAD-2",
        material: "platinum",
        size: "97",
        priceCents: 100,
        stockQuantity: -1,
      }),
    ).rejects.toThrow();
  });

  it("rejects malformed currency codes", async () => {
    const productId = await aProductId();
    await expect(
      db.insert(productVariants).values({
        productId,
        sku: "BAD-3",
        material: "platinum",
        size: "96",
        priceCents: 100,
        currency: "usd",
      }),
    ).rejects.toThrow();
  });

  it("treats two one-size variants of the same metal as duplicates", async () => {
    const [earring] = await db
      .select()
      .from(products)
      .where(eq(products.category, "earrings"))
      .limit(1);
    const [variant] = await db
      .select()
      .from(productVariants)
      .where(eq(productVariants.productId, earring?.id ?? ""))
      .limit(1);
    await expect(
      db.insert(productVariants).values({
        productId: variant?.productId ?? "",
        sku: "DUP-ONE-SIZE",
        material: variant?.material ?? "yellow-gold",
        size: null,
        priceCents: 100,
      }),
    ).rejects.toThrow();
  });

  it("rejects variants for products that do not exist", async () => {
    await expect(
      db.insert(productVariants).values({
        productId: "00000000-0000-4000-8000-000000000000",
        sku: "ORPHAN",
        material: "platinum",
        size: "1",
        priceCents: 100,
      }),
    ).rejects.toThrow();
  });
});
