// Client-safe public API. Server reads live in ./catalogue.server.
export { categories, type CategorySlug } from "./categories";
export { ProductCard, ProductCardSkeleton } from "./components/product-card";
export { ProductImage } from "./components/product-image";
export type { Product } from "./product.schema";
