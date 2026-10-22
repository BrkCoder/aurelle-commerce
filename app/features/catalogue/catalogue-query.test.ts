import { describe, expect, it } from "vitest";

import {
  emptyQuery,
  getActiveFilters,
  getCatalogueHeading,
  parseCatalogueSearchParams,
  resetFilters,
  toggleListValue,
  toSearchParams,
  toSearchString,
  withInStock,
  withPage,
  withPriceRange,
  withSort,
} from "./catalogue-query";

const parse = (search: string) =>
  parseCatalogueSearchParams(new URLSearchParams(search));

describe("parseCatalogueSearchParams", () => {
  it("returns defaults for an empty URL", () => {
    expect(parse("")).toEqual({
      categories: [],
      collections: [],
      materials: [],
      inStock: false,
      minPrice: undefined,
      maxPrice: undefined,
      sort: "featured",
      page: 1,
    });
  });

  it("parses every supported parameter", () => {
    const q = parse(
      "category=rings&category=earrings&collection=bridal&material=rose-gold&availability=in-stock&min=500&max=2000&sort=price-asc&page=3",
    );
    expect(q).toMatchObject({
      categories: ["rings", "earrings"],
      collections: ["bridal"],
      materials: ["rose-gold"],
      inStock: true,
      minPrice: 500,
      maxPrice: 2000,
      sort: "price-asc",
      page: 3,
    });
  });

  it("ignores invalid values instead of failing", () => {
    const q = parse(
      "category=hats&category=rings&material=bronze&sort=cheapest&page=-2&min=abc&max=1e9&availability=yes&collection=Not%20A%20Slug",
    );
    expect(q.categories).toEqual(["rings"]);
    expect(q.materials).toEqual([]);
    expect(q.sort).toBe("featured");
    expect(q.page).toBe(1);
    expect(q.minPrice).toBeUndefined();
    expect(q.maxPrice).toBeUndefined();
    expect(q.inStock).toBe(false);
    expect(q.collections).toEqual([]);
  });

  it("rejects pages of zero, decimals and absurd sizes", () => {
    expect(parse("page=0").page).toBe(1);
    expect(parse("page=2.5").page).toBe(1);
    expect(parse("page=99999999999").page).toBe(1);
  });

  it("de-duplicates and canonically orders list values", () => {
    expect(
      parse("category=earrings&category=rings&category=rings").categories,
    ).toEqual(["rings", "earrings"]);
    expect(
      parse("collection=pearl-atelier&collection=bridal").collections,
    ).toEqual(["bridal", "pearl-atelier"]);
  });

  it("swaps a reversed price range", () => {
    const q = parse("min=3000&max=1000");
    expect([q.minPrice, q.maxPrice]).toEqual([1000, 3000]);
  });

  it("accepts a lone minimum or maximum", () => {
    expect(parse("min=500")).toMatchObject({
      minPrice: 500,
      maxPrice: undefined,
    });
    expect(parse("max=500")).toMatchObject({
      minPrice: undefined,
      maxPrice: 500,
    });
  });
});

describe("emptyQuery", () => {
  it("equals what the parser returns for an empty URL", () => {
    expect(emptyQuery).toEqual(parse(""));
  });
});

describe("toSearchParams", () => {
  it("omits defaults", () => {
    expect(toSearchString(emptyQuery)).toBe("");
  });

  it("round-trips any parsed query", () => {
    const search =
      "category=rings&collection=bridal&material=platinum&availability=in-stock&min=100&max=900&sort=newest&page=2";
    const query = parse(search);
    expect(parse(toSearchParams(query).toString())).toEqual(query);
    expect(toSearchParams(query).toString()).toBe(search);
  });

  it("is idempotent for hand-edited URLs", () => {
    const messy = parse("page=2&sort=newest&category=earrings&category=rings");
    const once = toSearchString(messy);
    expect(toSearchString(parse(once.slice(1)))).toBe(once);
  });
});

describe("changing the query", () => {
  it("returns to page 1 whenever the result set changes", () => {
    const onPage3 = withPage(emptyQuery, 3);
    expect(withSort(onPage3, "newest").page).toBe(1);
    expect(withInStock(onPage3, true).page).toBe(1);
    expect(toggleListValue(onPage3, "categories", "rings").page).toBe(1);
    expect(withPriceRange(onPage3, 100, 200).page).toBe(1);
  });

  it("toggles list values on and off", () => {
    const on = toggleListValue(emptyQuery, "materials", "rose-gold");
    expect(on.materials).toEqual(["rose-gold"]);
    expect(toggleListValue(on, "materials", "rose-gold").materials).toEqual([]);
  });

  it("composes several filters without dropping any", () => {
    let q = toggleListValue(emptyQuery, "categories", "rings");
    q = toggleListValue(q, "materials", "platinum");
    q = withInStock(q, true);
    q = withPriceRange(q, 1000, 5000);
    q = withSort(q, "price-desc");
    expect(q).toMatchObject({
      categories: ["rings"],
      materials: ["platinum"],
      inStock: true,
      minPrice: 1000,
      maxPrice: 5000,
      sort: "price-desc",
    });
  });

  it("resetFilters clears filters but keeps the sort order", () => {
    const q = withSort(
      toggleListValue(emptyQuery, "categories", "rings"),
      "newest",
    );
    expect(resetFilters(q)).toEqual({ ...emptyQuery, sort: "newest" });
  });
});

describe("getActiveFilters", () => {
  it("is empty when nothing is filtered", () => {
    expect(getActiveFilters(emptyQuery)).toEqual([]);
  });

  it("describes each filter and links to the query without it", () => {
    const q = parse(
      "category=rings&collection=bridal&material=rose-gold&availability=in-stock&min=500&max=2000&sort=newest",
    );
    const names = new Map([["bridal", "Bridal"]]);
    const filters = getActiveFilters(q, names);

    expect(filters.map((f) => f.label)).toEqual([
      "Rings",
      "Bridal",
      "Rose gold",
      "In stock",
      "$500 – $2,000",
    ]);
    const rings = filters.find((f) => f.id === "category:rings");
    expect(rings?.without.categories).toEqual([]);
    expect(rings?.without.collections).toEqual(["bridal"]);
    expect(rings?.without.sort).toBe("newest");
    expect(filters.find((f) => f.id === "price")?.without).toMatchObject({
      minPrice: undefined,
      maxPrice: undefined,
    });
  });

  it("labels one-sided price ranges", () => {
    expect(getActiveFilters(parse("min=500"))[0]?.label).toBe("From $500");
    expect(getActiveFilters(parse("max=500"))[0]?.label).toBe("Up to $500");
  });
});

describe("getCatalogueHeading", () => {
  const collectionList = [
    { slug: "bridal", name: "Bridal", description: "For the day." },
  ];

  it("names a single category", () => {
    expect(
      getCatalogueHeading(parse("category=rings"), collectionList).title,
    ).toBe("Rings");
  });

  it("names a single collection", () => {
    expect(
      getCatalogueHeading(parse("collection=bridal"), collectionList),
    ).toEqual({
      title: "Bridal",
      description: "For the day.",
    });
  });

  it("falls back to the generic heading for mixed or unknown selections", () => {
    expect(getCatalogueHeading(parse(""), collectionList).title).toBe(
      "All jewellery",
    );
    expect(
      getCatalogueHeading(parse("category=rings&category=earrings")).title,
    ).toBe("All jewellery");
    expect(
      getCatalogueHeading(
        parse("category=rings&collection=bridal"),
        collectionList,
      ).title,
    ).toBe("All jewellery");
    expect(
      getCatalogueHeading(parse("collection=unknown"), collectionList).title,
    ).toBe("All jewellery");
  });
});
