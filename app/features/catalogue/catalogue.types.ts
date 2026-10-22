import type { CategorySlug } from "./categories";
import type { MaterialSlug } from "./materials";

export type Availability = "in-stock" | "low-stock" | "sold-out";

export type CatalogueImage = {
  url: string;
  alt: string;
  width: number;
  height: number;
};

export type ProductVariant = {
  id: string;
  sku: string;
  material: MaterialSlug;
  /** Ring size, chain length, wrist size; null for one-size pieces. */
  size: string | null;
  priceCents: number;
  currency: string;
  stockQuantity: number;
};

export type ProductSummary = {
  id: string;
  slug: string;
  name: string;
  category: CategorySlug;
  /** Lowest price among the variants that match the active filters. */
  fromPriceCents: number;
  currency: string;
  /** True when the variants' prices differ, so the card can say "From". */
  hasPriceRange: boolean;
  /** Up to two images: primary, then the hover image. */
  images: CatalogueImage[];
  materials: MaterialSlug[];
  availability: Availability;
  isNew: boolean;
};

export type CollectionSummary = {
  slug: string;
  name: string;
  description: string;
};

export type ProductDetail = {
  id: string;
  slug: string;
  name: string;
  category: CategorySlug;
  description: string;
  gemstone: string | null;
  specifications: { label: string; value: string }[];
  images: CatalogueImage[];
  variants: ProductVariant[];
  collections: CollectionSummary[];
  isNew: boolean;
};

export type ProductPage = {
  products: ProductSummary[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
};

export type FilterOptions = {
  collections: CollectionSummary[];
  /** Whole-dollar bounds across all variants, for input placeholders. */
  priceRange: { min: number; max: number };
};
