/**
 * TEMPORARY SEED DATA: placeholder products for the storefront shell phase.
 * Names, prices and descriptions are fictional. Replace with PostgreSQL
 * (Drizzle) reads in the catalogue vertical slice, then delete this file.
 */
import { productSchema, type Product } from "./product.schema";

const rawProducts = [
  {
    id: "seed-1",
    slug: "lumiere-solitaire-ring",
    name: "Lumière Solitaire Ring",
    category: "rings",
    material: "18k yellow gold, 0.5ct diamond",
    priceCents: 489000,
    description: "A single brilliant-cut diamond in a slender gold setting.",
    featured: true,
  },
  {
    id: "seed-2",
    slug: "aurore-pearl-drop-earrings",
    name: "Aurore Pearl Drop Earrings",
    category: "earrings",
    material: "18k rose gold, freshwater pearl",
    priceCents: 112000,
    description: "Hand-selected pearls suspended from polished gold hooks.",
    featured: true,
  },
  {
    id: "seed-3",
    slug: "celeste-pendant-necklace",
    name: "Céleste Pendant Necklace",
    category: "necklaces",
    material: "18k white gold, sapphire",
    priceCents: 236000,
    description: "A pale sapphire on a fine, hand-finished trace chain.",
    featured: true,
  },
  {
    id: "seed-4",
    slug: "opale-sculpted-bangle",
    name: "Opale Sculpted Bangle",
    category: "bracelets",
    material: "18k yellow gold",
    priceCents: 318000,
    description: "A softly faceted bangle that moves with the wrist.",
    featured: true,
  },
  {
    id: "seed-5",
    slug: "marais-band-ring",
    name: "Marais Band Ring",
    category: "rings",
    material: "18k rose gold",
    priceCents: 94000,
    description: "A clean, domed band made to stack or stand alone.",
    featured: false,
  },
  {
    id: "seed-6",
    slug: "soleil-stud-earrings",
    name: "Soleil Stud Earrings",
    category: "earrings",
    material: "18k yellow gold, diamond",
    priceCents: 138000,
    description: "Pavé diamonds in a radiating gold setting.",
    featured: false,
  },
  {
    id: "seed-7",
    slug: "vesper-chain-necklace",
    name: "Vesper Chain Necklace",
    category: "necklaces",
    material: "18k yellow gold",
    priceCents: 176000,
    description: "A weighty, polished curb chain for everyday layering.",
    featured: false,
  },
  {
    id: "seed-8",
    slug: "perle-tennis-bracelet",
    name: "Perle Tennis Bracelet",
    category: "bracelets",
    material: "18k white gold, diamond",
    priceCents: 642000,
    description: "A continuous line of brilliant-cut diamonds.",
    featured: false,
  },
] satisfies Product[];

// Validate even trusted seed data so it can't drift from the real schema.
export const seedProducts: Product[] = productSchema.array().parse(rawProducts);
