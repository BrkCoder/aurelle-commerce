import { describe, expect, it } from "vitest";

import { getFeaturedProducts } from "./catalogue.server";
import { productSchema } from "./product.schema";
import { seedProducts } from "./seed-data.server";

describe("seed data", () => {
  it("satisfies the product schema", () => {
    expect(() => productSchema.array().parse(seedProducts)).not.toThrow();
  });

  it("has unique ids and slugs", () => {
    expect(new Set(seedProducts.map((p) => p.id)).size).toBe(
      seedProducts.length,
    );
    expect(new Set(seedProducts.map((p) => p.slug)).size).toBe(
      seedProducts.length,
    );
  });
});

describe("getFeaturedProducts", () => {
  it("returns only featured products", async () => {
    const products = await getFeaturedProducts();
    expect(products.length).toBeGreaterThan(0);
    expect(products.every((p) => p.featured)).toBe(true);
  });

  it("respects the limit", async () => {
    expect(await getFeaturedProducts(2)).toHaveLength(2);
  });
});
