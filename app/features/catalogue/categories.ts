/** Static taxonomy: shared by navigation, homepage and catalogue filters. */
export const categories = [
  {
    slug: "rings",
    name: "Rings",
    sizeLabel: "Ring size",
    blurb: "Solitaires and bands, cut to be worn daily.",
  },
  {
    slug: "necklaces",
    name: "Necklaces",
    sizeLabel: "Length",
    blurb: "Fine chains and pendants with quiet presence.",
  },
  {
    slug: "earrings",
    name: "Earrings",
    sizeLabel: "Size",
    blurb: "Studs and drops that catch the light.",
  },
  {
    slug: "bracelets",
    name: "Bracelets",
    sizeLabel: "Wrist size",
    blurb: "Sculpted gold and pearl for the wrist.",
  },
] as const;

export type CategorySlug = (typeof categories)[number]["slug"];

export const categorySlugs = categories.map((c) => c.slug) as [
  CategorySlug,
  ...CategorySlug[],
];

export function getCategory(slug: CategorySlug) {
  const category = categories.find((c) => c.slug === slug);
  if (!category) throw new Error(`Unknown category: ${slug}`);
  return category;
}
