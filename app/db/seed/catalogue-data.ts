/**
 * Fictional catalogue used for development, demos and tests.
 * Product names, prices and copy are invented. Images are generated placeholders
 * (see features/catalogue/placeholder-art.ts), marked TEMPORARY.
 */
import type { CategorySlug } from "../../features/catalogue/categories";
import type { MaterialSlug } from "../../features/catalogue/materials";
import { placeholderImageUrl } from "../../features/catalogue/placeholder-art";
import type { Specification } from "../schema";

export const CURRENCY = "USD";

export const collectionSeeds = [
  {
    slug: "bridal",
    name: "Bridal",
    description:
      "Solitaires, halos and eternity bands for the day and every day after.",
  },
  {
    slug: "everyday-gold",
    name: "Everyday Gold",
    description:
      "Understated gold pieces designed to be worn, layered and never taken off.",
  },
  {
    slug: "pearl-atelier",
    name: "Pearl Atelier",
    description: "Hand-selected freshwater pearls set by our Paris atelier.",
  },
  {
    slug: "evening-radiance",
    name: "Evening Radiance",
    description: "Statement diamonds and coloured stones for after dark.",
  },
  {
    slug: "heritage-edit",
    name: "The Heritage Edit",
    description:
      "Modern takes on classic forms: signets, lockets, medallions and cuffs.",
  },
] as const;

type CollectionSlug = (typeof collectionSeeds)[number]["slug"];

type ProductSeed = {
  slug: string;
  name: string;
  category: CategorySlug;
  collections: CollectionSlug[];
  /** Metals offered. Price is for the first metal in the list; others use a multiplier. */
  materials: MaterialSlug[];
  /** Whole dollars for the smallest size in the first metal. */
  basePrice: number;
  gemstone: string | null;
  description: string;
  dimensions: string;
  featuredRank?: number;
  /** "scarce": 1-2 units on a single variant. "sold-out": zero everywhere. */
  stock?: "scarce" | "sold-out";
};

const gold: MaterialSlug[] = ["yellow-gold", "rose-gold"];
const bridalMetals: MaterialSlug[] = ["yellow-gold", "white-gold", "platinum"];
const whiteMetals: MaterialSlug[] = ["white-gold", "platinum"];

// Order matters: earlier products are newer (see ageDays below).
export const productSeeds: ProductSeed[] = [
  {
    slug: "lumiere-solitaire-ring",
    name: "Lumière Solitaire Ring",
    category: "rings",
    collections: ["bridal"],
    materials: bridalMetals,
    basePrice: 4890,
    gemstone: "0.50 ct brilliant-cut diamond",
    description:
      "A single brilliant-cut diamond held by six slender claws on a softly rounded band.",
    dimensions: "Band 1.8 mm",
    featuredRank: 1,
  },
  {
    slug: "etoile-halo-ring",
    name: "Étoile Halo Ring",
    category: "rings",
    collections: ["bridal", "evening-radiance"],
    materials: bridalMetals,
    basePrice: 3650,
    gemstone: "0.35 ct diamond, pavé halo",
    description:
      "A diamond ringed by a halo of pavé stones that throws light in every direction.",
    dimensions: "Band 1.6 mm, halo 8 mm",
  },
  {
    slug: "aube-eternity-band",
    name: "Aube Eternity Band",
    category: "rings",
    collections: ["bridal"],
    materials: bridalMetals,
    basePrice: 3980,
    gemstone: "Round brilliant diamonds, 0.90 ct total",
    description:
      "A continuous line of matched diamonds, set low so it sits flush against a solitaire.",
    dimensions: "Band 2.2 mm",
  },
  {
    slug: "vesper-trilogy-ring",
    name: "Vesper Trilogy Ring",
    category: "rings",
    collections: ["bridal"],
    materials: bridalMetals,
    basePrice: 4420,
    gemstone: "Three diamonds, 0.75 ct total",
    description:
      "Past, present and future in three graduated diamonds on a tapering band.",
    dimensions: "Band 2.0 mm",
  },
  {
    slug: "marais-band-ring",
    name: "Marais Band Ring",
    category: "rings",
    collections: ["everyday-gold"],
    materials: gold,
    basePrice: 940,
    gemstone: null,
    description:
      "A clean, domed band made to stack with others or stand quietly alone.",
    dimensions: "Band 3.0 mm",
    stock: "scarce",
  },
  {
    slug: "seraphine-twist-ring",
    name: "Séraphine Twist Ring",
    category: "rings",
    collections: ["everyday-gold"],
    materials: gold,
    basePrice: 1320,
    gemstone: null,
    description:
      "Two strands of polished gold twisted into a single, supple ring.",
    dimensions: "Band 3.5 mm",
  },
  {
    slug: "opaline-signet-ring",
    name: "Opaline Signet Ring",
    category: "rings",
    collections: ["heritage-edit"],
    materials: gold,
    basePrice: 1180,
    gemstone: null,
    description:
      "An oval signet with a mirror-polished face, ready for a monogram.",
    dimensions: "Face 12 × 10 mm",
  },
  {
    slug: "cassis-emerald-ring",
    name: "Cassis Emerald Ring",
    category: "rings",
    collections: ["evening-radiance", "heritage-edit"],
    materials: gold,
    basePrice: 5200,
    gemstone: "1.1 ct emerald, diamond shoulders",
    description:
      "A deep green emerald framed by diamond shoulders in a collet setting.",
    dimensions: "Stone 7 × 5 mm",
  },
  {
    slug: "noor-sapphire-cocktail-ring",
    name: "Noor Sapphire Cocktail Ring",
    category: "rings",
    collections: ["evening-radiance"],
    materials: whiteMetals,
    basePrice: 4760,
    gemstone: "2.0 ct cushion sapphire",
    description:
      "A cushion-cut sapphire the colour of late-evening sky, surrounded by diamonds.",
    dimensions: "Stone 8 mm",
    stock: "sold-out",
  },
  {
    slug: "celeste-pendant-necklace",
    name: "Céleste Pendant Necklace",
    category: "necklaces",
    collections: ["evening-radiance"],
    materials: whiteMetals,
    basePrice: 2360,
    gemstone: "0.80 ct pale sapphire",
    description:
      "A pale sapphire suspended on a fine, hand-finished trace chain.",
    dimensions: "Pendant 6 mm",
    featuredRank: 3,
  },
  {
    slug: "lune-crescent-pendant",
    name: "Lune Crescent Pendant",
    category: "necklaces",
    collections: ["everyday-gold", "evening-radiance"],
    materials: gold,
    basePrice: 1480,
    gemstone: "Pavé diamonds",
    description:
      "A slim crescent of gold, edged with diamonds along its inner curve.",
    dimensions: "Pendant 14 mm",
    stock: "scarce",
  },
  {
    slug: "vesper-chain-necklace",
    name: "Vesper Chain Necklace",
    category: "necklaces",
    collections: ["everyday-gold"],
    materials: gold,
    basePrice: 1760,
    gemstone: null,
    description: "A weighty, polished curb chain for everyday layering.",
    dimensions: "Link 4 mm",
  },
  {
    slug: "aurelia-pearl-pendant",
    name: "Aurelia Pearl Pendant",
    category: "necklaces",
    collections: ["pearl-atelier", "everyday-gold"],
    materials: gold,
    basePrice: 1120,
    gemstone: "9 mm freshwater pearl",
    description: "A single lustrous pearl floating on a whisper-thin chain.",
    dimensions: "Pearl 9 mm",
  },
  {
    slug: "perle-riviere-necklace",
    name: "Perle Rivière Necklace",
    category: "necklaces",
    collections: ["pearl-atelier"],
    materials: gold,
    basePrice: 2980,
    gemstone: "Graduated freshwater pearls",
    description:
      "Graduated pearls knotted by hand on silk, finished with a gold clasp.",
    dimensions: "Pearls 5-8 mm",
  },
  {
    slug: "soleil-medallion-necklace",
    name: "Soleil Medallion Necklace",
    category: "necklaces",
    collections: ["heritage-edit"],
    materials: gold,
    basePrice: 1960,
    gemstone: null,
    description: "A hand-engraved sunburst medallion on a rolo chain.",
    dimensions: "Medallion 18 mm",
  },
  {
    slug: "marguerite-locket-necklace",
    name: "Marguerite Locket Necklace",
    category: "necklaces",
    collections: ["heritage-edit"],
    materials: gold,
    basePrice: 1640,
    gemstone: null,
    description:
      "A hinged locket engraved with a single flower, large enough to hold two small portraits.",
    dimensions: "Locket 20 × 16 mm",
  },
  {
    slug: "isolde-diamond-riviere",
    name: "Isolde Diamond Rivière",
    category: "necklaces",
    collections: ["evening-radiance", "bridal"],
    materials: whiteMetals,
    basePrice: 7400,
    gemstone: "Graduated diamonds, 3.2 ct total",
    description:
      "A flowing line of graduated diamonds, each set in its own tiny collet.",
    dimensions: "Stones 2-4 mm",
  },
  {
    slug: "opale-sculpted-bangle",
    name: "Opale Sculpted Bangle",
    category: "bracelets",
    collections: ["heritage-edit"],
    materials: gold,
    basePrice: 3180,
    gemstone: null,
    description:
      "A softly faceted bangle that moves gracefully with the wrist.",
    dimensions: "Width 8 mm",
    featuredRank: 4,
  },
  {
    slug: "perle-tennis-bracelet",
    name: "Perle Tennis Bracelet",
    category: "bracelets",
    collections: ["evening-radiance", "bridal"],
    materials: whiteMetals,
    basePrice: 6420,
    gemstone: "Round brilliant diamonds, 3.0 ct total",
    description:
      "A continuous line of brilliant-cut diamonds on a flexible, hidden-clasp bracelet.",
    dimensions: "Width 3 mm",
  },
  {
    slug: "calliope-chain-bracelet",
    name: "Calliope Chain Bracelet",
    category: "bracelets",
    collections: ["everyday-gold"],
    materials: gold,
    basePrice: 1540,
    gemstone: null,
    description:
      "A fine belcher chain with a lobster clasp and a small engraved tag.",
    dimensions: "Link 3 mm",
  },
  {
    slug: "diane-cuff-bracelet",
    name: "Diane Cuff Bracelet",
    category: "bracelets",
    collections: ["heritage-edit"],
    materials: gold,
    basePrice: 2240,
    gemstone: null,
    description:
      "An open cuff with a hammered finish, shaped to rest comfortably at the wrist.",
    dimensions: "Width 12 mm",
  },
  {
    slug: "sorel-charm-bracelet",
    name: "Sorel Charm Bracelet",
    category: "bracelets",
    collections: ["everyday-gold", "heritage-edit"],
    materials: gold,
    basePrice: 1880,
    gemstone: null,
    description:
      "A trace-chain bracelet with three tiny charms: a star, a key and a heart.",
    dimensions: "Charms 7 mm",
  },
  {
    slug: "linnea-pearl-bracelet",
    name: "Linnea Pearl Bracelet",
    category: "bracelets",
    collections: ["pearl-atelier"],
    materials: gold,
    basePrice: 1360,
    gemstone: "6 mm freshwater pearls",
    description: "Round pearls strung on silk with a gold toggle clasp.",
    dimensions: "Pearls 6 mm",
  },
  {
    slug: "orion-link-bracelet",
    name: "Orion Link Bracelet",
    category: "bracelets",
    collections: ["everyday-gold"],
    materials: gold,
    basePrice: 2090,
    gemstone: null,
    description:
      "Oval links of polished gold, each a little different, joined as one.",
    dimensions: "Link 9 mm",
  },
  {
    slug: "aurore-pearl-drop-earrings",
    name: "Aurore Pearl Drop Earrings",
    category: "earrings",
    collections: ["pearl-atelier"],
    materials: gold,
    basePrice: 1120,
    gemstone: "8 mm freshwater pearls",
    description: "Hand-selected pearls suspended from polished gold hooks.",
    dimensions: "Drop 32 mm",
    featuredRank: 2,
  },
  {
    slug: "soleil-stud-earrings",
    name: "Soleil Stud Earrings",
    category: "earrings",
    collections: ["everyday-gold", "bridal"],
    materials: gold,
    basePrice: 1380,
    gemstone: "Pavé diamonds",
    description:
      "Pavé diamonds in a radiating gold setting, small enough to wear all day.",
    dimensions: "Diameter 8 mm",
  },
  {
    slug: "camille-hoop-earrings",
    name: "Camille Hoop Earrings",
    category: "earrings",
    collections: ["everyday-gold"],
    materials: gold,
    basePrice: 980,
    gemstone: null,
    description:
      "Lightweight hollow hoops with a high polish and a secure hinged closure.",
    dimensions: "Diameter 22 mm",
  },
  {
    slug: "rosalind-chandelier-earrings",
    name: "Rosalind Chandelier Earrings",
    category: "earrings",
    collections: ["evening-radiance"],
    materials: whiteMetals,
    basePrice: 5300,
    gemstone: "Diamonds, 2.4 ct total",
    description:
      "Tiers of diamonds that sway with every step, finished with a pear-cut drop.",
    dimensions: "Drop 48 mm",
  },
  {
    slug: "mireille-huggie-earrings",
    name: "Mireille Huggie Earrings",
    category: "earrings",
    collections: ["everyday-gold"],
    materials: gold,
    basePrice: 760,
    gemstone: null,
    description: "Close-fitting huggies with a softly domed profile.",
    dimensions: "Diameter 12 mm",
  },
  {
    slug: "ondine-threader-earrings",
    name: "Ondine Threader Earrings",
    category: "earrings",
    collections: ["pearl-atelier"],
    materials: gold,
    basePrice: 640,
    gemstone: "5 mm freshwater pearls",
    description:
      "A fine chain threads through the ear and ends in a single small pearl.",
    dimensions: "Chain 70 mm",
  },
];

const sizesByCategory: Record<CategorySlug, (string | null)[]> = {
  rings: ["5", "6", "7", "8"],
  necklaces: ['16"', '18"'],
  bracelets: ["16 cm", "17 cm", "18 cm"],
  earrings: [null],
};

/** Per size step above the smallest: longer chains and larger wrists use more metal. */
const sizeStepPremium: Record<CategorySlug, number> = {
  rings: 0,
  necklaces: 0.05,
  bracelets: 0.03,
  earrings: 0,
};

const materialMultiplier: Record<MaterialSlug, number> = {
  "yellow-gold": 1,
  "rose-gold": 1,
  "white-gold": 1.03,
  platinum: 1.4,
};

const AGE_STEP_DAYS = 8;

const imageViews = [
  { view: 1, label: "front view" },
  { view: 2, label: "detail view" },
  { view: 3, label: "styled view" },
] as const;

/** Deterministic pseudo-random int from a string, so the seed is stable across runs. */
function hash(input: string): number {
  let h = 2166136261;
  for (const ch of input) h = Math.imul(h ^ ch.charCodeAt(0), 16777619);
  return h >>> 0;
}

function skuCode(slug: string): string {
  return slug
    .split("-")
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("")
    .padEnd(3, "X");
}

function roundToTenDollars(dollars: number): number {
  return Math.round(dollars / 10) * 10;
}

function stockFor(seed: ProductSeed, sku: string, ordinal: number): number {
  if (seed.stock === "sold-out") return 0;
  const h = hash(sku);
  // "Last few pieces": only the first variant has any units, so the product total is low.
  if (seed.stock === "scarce") return ordinal === 0 ? 1 + (h % 2) : 0;
  // Roughly one variant in seven is out of stock so option availability is exercised.
  return h % 7 === 0 ? 0 : 2 + (h % 9);
}

export type CatalogueSeed = ReturnType<typeof buildCatalogueSeed>;

export function buildCatalogueSeed(now: Date) {
  const products = productSeeds.map((seed, index) => {
    const createdAt = new Date(
      now.getTime() - (index * AGE_STEP_DAYS + 3) * 24 * 60 * 60 * 1000,
    );
    const sizes = sizesByCategory[seed.category];
    const code = skuCode(seed.slug);

    const variants = seed.materials.flatMap((material, materialIndex) =>
      sizes.map((size, sizeIndex) => {
        const sku = `AUR-${code}${String(index + 1).padStart(2, "0")}-${material
          .split("-")
          .map((p) => p[0]?.toUpperCase())
          .join("")}${size ? `-${size.replace(/\D/g, "")}` : ""}`;
        const dollars =
          seed.basePrice *
          materialMultiplier[material] *
          (1 + sizeIndex * sizeStepPremium[seed.category]);
        return {
          sku,
          material,
          size,
          priceCents: roundToTenDollars(dollars) * 100,
          currency: CURRENCY,
          stockQuantity: stockFor(
            seed,
            sku,
            materialIndex * sizes.length + sizeIndex,
          ),
        };
      }),
    );

    const firstMaterial = seed.materials[0] ?? "yellow-gold";
    const artSeed = hash(seed.slug) % 6;
    const images = imageViews.map(({ view, label }) => ({
      url: placeholderImageUrl({
        category: seed.category,
        material: firstMaterial,
        view,
        seed: artSeed,
      }),
      alt: `${seed.name}, ${label}`,
      width: 800,
      height: 1000,
      sortOrder: view,
    }));

    const specifications: Specification[] = [
      { label: "Metal", value: "Hallmarked 18k gold or platinum, as selected" },
      ...(seed.gemstone ? [{ label: "Gemstone", value: seed.gemstone }] : []),
      { label: "Dimensions", value: seed.dimensions },
      {
        label: "Care",
        value:
          "Polish gently with the supplied cloth; store apart from other jewellery",
      },
    ];

    return {
      slug: seed.slug,
      name: seed.name,
      category: seed.category,
      description: seed.description,
      gemstone: seed.gemstone,
      specifications,
      featuredRank: seed.featuredRank ?? null,
      createdAt,
      collections: seed.collections,
      variants,
      images,
    };
  });

  return { collections: collectionSeeds, products };
}
