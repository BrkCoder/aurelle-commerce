/** Static taxonomy for metals. Mirrored by the `material` Postgres enum. */
export const materials = [
  { slug: "yellow-gold", name: "Yellow gold", swatch: "#c9a45c" },
  { slug: "rose-gold", name: "Rose gold", swatch: "#c48b7a" },
  { slug: "white-gold", name: "White gold", swatch: "#d6d4cf" },
  { slug: "platinum", name: "Platinum", swatch: "#9a9ca1" },
] as const;

export type MaterialSlug = (typeof materials)[number]["slug"];

export const materialSlugs = materials.map((m) => m.slug) as [
  MaterialSlug,
  ...MaterialSlug[],
];

export function getMaterial(slug: MaterialSlug) {
  const material = materials.find((m) => m.slug === slug);
  if (!material) throw new Error(`Unknown material: ${slug}`);
  return material;
}
