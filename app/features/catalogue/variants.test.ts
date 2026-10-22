import { describe, expect, it } from "vitest";

import {
  getAvailability,
  isNewProduct,
  LOW_STOCK_THRESHOLD,
} from "./availability";
import type { ProductVariant } from "./catalogue.types";
import { parseVariantSelection, resolveVariantSelection } from "./variants";

let counter = 0;
function variant(overrides: Partial<ProductVariant>): ProductVariant {
  counter += 1;
  return {
    id: `v${counter}`,
    sku: `SKU-${counter}`,
    material: "yellow-gold",
    size: null,
    priceCents: 100_000,
    currency: "USD",
    stockQuantity: 5,
    ...overrides,
  };
}

describe("getAvailability", () => {
  it("classifies stock levels", () => {
    expect(getAvailability(0)).toBe("sold-out");
    expect(getAvailability(-1)).toBe("sold-out");
    expect(getAvailability(1)).toBe("low-stock");
    expect(getAvailability(LOW_STOCK_THRESHOLD)).toBe("low-stock");
    expect(getAvailability(LOW_STOCK_THRESHOLD + 1)).toBe("in-stock");
  });
});

describe("isNewProduct", () => {
  const now = new Date("2026-06-01T00:00:00Z");
  it("is true inside the window and false outside it", () => {
    expect(isNewProduct(new Date("2026-05-20T00:00:00Z"), now)).toBe(true);
    expect(isNewProduct(new Date("2026-03-01T00:00:00Z"), now)).toBe(false);
  });
});

describe("resolveVariantSelection", () => {
  const variants = [
    variant({
      material: "yellow-gold",
      size: "5",
      priceCents: 100_000,
      stockQuantity: 0,
    }),
    variant({
      material: "yellow-gold",
      size: "6",
      priceCents: 100_000,
      stockQuantity: 4,
    }),
    variant({
      material: "yellow-gold",
      size: "10",
      priceCents: 100_000,
      stockQuantity: 2,
    }),
    variant({
      material: "rose-gold",
      size: "5",
      priceCents: 110_000,
      stockQuantity: 3,
    }),
    variant({
      material: "rose-gold",
      size: "6",
      priceCents: 110_000,
      stockQuantity: 0,
    }),
    variant({
      material: "platinum",
      size: "5",
      priceCents: 140_000,
      stockQuantity: 0,
    }),
  ];

  it("defaults to the first in-stock variant of the first metal with stock", () => {
    const { variant: v, materials } = resolveVariantSelection(variants);
    expect([v.material, v.size]).toEqual(["yellow-gold", "6"]);
    expect(materials.find((m) => m.selected)?.slug).toBe("yellow-gold");
  });

  it("honours a requested metal and size", () => {
    const { variant: v } = resolveVariantSelection(variants, {
      material: "rose-gold",
      size: "5",
    });
    expect(v.priceCents).toBe(110_000);
    expect([v.material, v.size]).toEqual(["rose-gold", "5"]);
  });

  it("keeps an out-of-stock variant selectable when explicitly requested", () => {
    const { variant: v } = resolveVariantSelection(variants, {
      material: "yellow-gold",
      size: "5",
    });
    expect(v.size).toBe("5");
    expect(getAvailability(v.stockQuantity)).toBe("sold-out");
  });

  it("falls back to an in-stock size when the requested size does not exist in that metal", () => {
    const { variant: v } = resolveVariantSelection(variants, {
      material: "rose-gold",
      size: "10",
    });
    expect([v.material, v.size]).toEqual(["rose-gold", "5"]);
  });

  it("ignores unknown metals and sizes", () => {
    const { variant: v } = resolveVariantSelection(variants, {
      material: "bronze",
      size: "zzz",
    });
    expect([v.material, v.size]).toEqual(["yellow-gold", "6"]);
  });

  it("sorts sizes naturally, so 10 follows 6", () => {
    const { sizes } = resolveVariantSelection(variants, {
      material: "yellow-gold",
    });
    expect(sizes.map((s) => s.value)).toEqual(["5", "6", "10"]);
  });

  it("reports per-option availability", () => {
    const { sizes, materials } = resolveVariantSelection(variants, {
      material: "yellow-gold",
    });
    expect(sizes.map((s) => s.available)).toEqual([false, true, true]);
    expect(materials.map((m) => [m.slug, m.available])).toEqual([
      ["yellow-gold", true],
      ["rose-gold", true],
      ["platinum", false],
    ]);
  });

  it("lists metals in canonical order, whatever order the variants arrive in", () => {
    const shuffled = [...variants].reverse();
    expect(
      resolveVariantSelection(shuffled).materials.map((m) => m.slug),
    ).toEqual(["yellow-gold", "rose-gold", "platinum"]);
  });

  it("falls back to the first variant when everything is sold out", () => {
    const soldOut = variants.map((v) => ({ ...v, stockQuantity: 0 }));
    const { variant: v } = resolveVariantSelection(soldOut);
    expect([v.material, v.size]).toEqual(["yellow-gold", "5"]);
  });

  it("handles one-size pieces", () => {
    const earrings = [
      variant({ material: "yellow-gold", size: null }),
      variant({ material: "rose-gold", size: null, priceCents: 120_000 }),
    ];
    const selection = resolveVariantSelection(earrings, {
      material: "rose-gold",
    });
    expect(selection.variant.priceCents).toBe(120_000);
    expect(selection.sizes).toEqual([]);
  });

  it("rejects products without variants", () => {
    expect(() => resolveVariantSelection([])).toThrow();
  });
});

describe("parseVariantSelection", () => {
  it("reads material and size and drops oversized values", () => {
    expect(
      parseVariantSelection(new URLSearchParams("material=rose-gold&size=7")),
    ).toEqual({
      material: "rose-gold",
      size: "7",
    });
    expect(
      parseVariantSelection(new URLSearchParams(`size=${"x".repeat(50)}`)).size,
    ).toBeUndefined();
  });
});
