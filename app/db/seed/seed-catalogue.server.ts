import { sql } from "drizzle-orm";

import type { Db } from "../db.server";
import {
  collections,
  productCollections,
  productImages,
  products,
  productVariants,
} from "../schema";
import { buildCatalogueSeed } from "./catalogue-data";

/**
 * Idempotent: safe to run on every deploy. Rows are matched on natural keys
 * (collection slug, product slug, variant SKU, image position) and updated in
 * place. `created_at` is only set on first insert so "Newest" order is stable.
 */
export async function seedCatalogue(db: Db, now: Date = new Date()) {
  const seed = buildCatalogueSeed(now);

  await db.transaction(async (tx) => {
    const collectionRows = await tx
      .insert(collections)
      .values(seed.collections.map((c, sortOrder) => ({ ...c, sortOrder })))
      .onConflictDoUpdate({
        target: collections.slug,
        set: {
          name: sql`excluded.name`,
          description: sql`excluded.description`,
          sortOrder: sql`excluded.sort_order`,
        },
      })
      .returning({ id: collections.id, slug: collections.slug });
    const collectionIds = new Map(collectionRows.map((c) => [c.slug, c.id]));

    for (const product of seed.products) {
      const [row] = await tx
        .insert(products)
        .values({
          slug: product.slug,
          name: product.name,
          category: product.category,
          description: product.description,
          gemstone: product.gemstone,
          specifications: product.specifications,
          featuredRank: product.featuredRank,
          createdAt: product.createdAt,
        })
        .onConflictDoUpdate({
          target: products.slug,
          set: {
            name: sql`excluded.name`,
            category: sql`excluded.category`,
            description: sql`excluded.description`,
            gemstone: sql`excluded.gemstone`,
            specifications: sql`excluded.specifications`,
            featuredRank: sql`excluded.featured_rank`,
          },
        })
        .returning({ id: products.id });
      if (!row) throw new Error(`Failed to upsert product ${product.slug}`);
      const productId = row.id;

      await tx
        .insert(productVariants)
        .values(product.variants.map((v) => ({ ...v, productId })))
        .onConflictDoUpdate({
          target: productVariants.sku,
          set: {
            productId: sql`excluded.product_id`,
            material: sql`excluded.material`,
            size: sql`excluded.size`,
            priceCents: sql`excluded.price_cents`,
            currency: sql`excluded.currency`,
            stockQuantity: sql`excluded.stock_quantity`,
          },
        });

      await tx
        .insert(productImages)
        .values(product.images.map((i) => ({ ...i, productId })))
        .onConflictDoUpdate({
          target: [productImages.productId, productImages.sortOrder],
          set: {
            url: sql`excluded.url`,
            sources: sql`excluded.sources`,
            alt: sql`excluded.alt`,
            width: sql`excluded.width`,
            height: sql`excluded.height`,
          },
        });

      await tx
        .insert(productCollections)
        .values(
          product.collections.map((slug) => {
            const collectionId = collectionIds.get(slug);
            if (!collectionId) throw new Error(`Unknown collection ${slug}`);
            return { productId, collectionId };
          }),
        )
        .onConflictDoNothing();
    }
  });
}
