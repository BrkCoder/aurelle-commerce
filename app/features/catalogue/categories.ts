/** Static taxonomy: shared by navigation, homepage and (later) catalogue filters. */
export const categories = [
  {
    slug: "rings",
    name: "Rings",
    blurb: "Solitaires and bands, cut to be worn daily.",
  },
  {
    slug: "necklaces",
    name: "Necklaces",
    blurb: "Fine chains and pendants with quiet presence.",
  },
  {
    slug: "earrings",
    name: "Earrings",
    blurb: "Studs and drops that catch the light.",
  },
  {
    slug: "bracelets",
    name: "Bracelets",
    blurb: "Sculpted gold and pearl for the wrist.",
  },
] as const;

export type CategorySlug = (typeof categories)[number]["slug"];

export const categorySlugs = categories.map((c) => c.slug) as [
  CategorySlug,
  ...CategorySlug[],
];
