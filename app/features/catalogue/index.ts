// Client-safe public API. Server reads live in ./catalogue.server.
export {
  availabilityLabels,
  getAvailability,
  LOW_STOCK_THRESHOLD,
} from "./availability";
export {
  ActiveFilters,
  CatalogueNav,
  Pagination,
  SortSelect,
} from "./components/catalogue-controls";
export { FilterFields, FilterSheet } from "./components/catalogue-filters";
export { ProductCard, ProductCardSkeleton } from "./components/product-card";
export { ProductGrid, ProductGridSkeleton } from "./components/product-grid";
export { ProductPicture } from "./components/product-picture";
export {
  getCatalogueHeading,
  PAGE_SIZE,
  parseCatalogueSearchParams,
  resetFilters,
  toSearchString,
} from "./catalogue-query";
export { useCatalogueQuery, useGoToQuery } from "./use-catalogue-query";
export { categories, getCategory, type CategorySlug } from "./categories";
export type {
  CatalogueImage,
  CollectionSummary,
  FilterOptions,
  ProductDetail,
  ProductSummary,
  ProductVariant,
} from "./catalogue.types";
export { getMaterial, materials, type MaterialSlug } from "./materials";
export {
  parseVariantSelection,
  resolveVariantSelection,
  type VariantSelection,
} from "./variants";
