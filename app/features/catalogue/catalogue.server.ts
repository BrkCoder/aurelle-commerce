import type { Product } from "./product.schema";
import { seedProducts } from "./seed-data.server";

/**
 * Server-only catalogue reads. Callers (route loaders) depend on this surface,
 * not on where the data lives, so swapping seed data for Drizzle is local.
 * Returns a promise now so callers are already written for the async DB version.
 */
export function getFeaturedProducts(limit = 4): Promise<Product[]> {
  return Promise.resolve(
    seedProducts.filter((p) => p.featured).slice(0, limit),
  );
}
