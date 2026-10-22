import { sql } from "drizzle-orm";
import {
  char,
  check,
  index,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  primaryKey,
  text,
  timestamp,
  unique,
  uuid,
} from "drizzle-orm/pg-core";

// Relative imports: drizzle-kit loads this file without the `~` alias.
import { categorySlugs } from "../features/catalogue/categories";
import { materialSlugs } from "../features/catalogue/materials";
import type { ImageSource } from "../features/catalogue/product-images";

export const categoryEnum = pgEnum("category", categorySlugs);
export const materialEnum = pgEnum("material", materialSlugs);

export type Specification = { label: string; value: string };

export const collections = pgTable("collections", {
  id: uuid("id").primaryKey().defaultRandom(),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  sortOrder: integer("sort_order").notNull().default(0),
});

export const products = pgTable(
  "products",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    slug: text("slug").notNull().unique(),
    name: text("name").notNull(),
    category: categoryEnum("category").notNull(),
    description: text("description").notNull(),
    gemstone: text("gemstone"),
    specifications: jsonb("specifications")
      .$type<Specification[]>()
      .notNull()
      .default(sql`'[]'::jsonb`),
    /** Lower ranks sort first under "Featured"; null means not featured. */
    featuredRank: integer("featured_rank"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [
    index("products_category_idx").on(t.category),
    index("products_featured_rank_idx").on(t.featuredRank),
    index("products_created_at_idx").on(t.createdAt),
    check("products_featured_rank_positive", sql`${t.featuredRank} > 0`),
  ],
);

export const productVariants = pgTable(
  "product_variants",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    productId: uuid("product_id")
      .notNull()
      .references(() => products.id, { onDelete: "cascade" }),
    sku: text("sku").notNull().unique(),
    material: materialEnum("material").notNull(),
    /** Ring size, chain length, wrist size. Null for one-size pieces. */
    size: text("size"),
    /** Integer minor units (cents) in `currency`. */
    priceCents: integer("price_cents").notNull(),
    currency: char("currency", { length: 3 }).notNull().default("USD"),
    stockQuantity: integer("stock_quantity").notNull().default(0),
  },
  (t) => [
    // nullsNotDistinct: two one-size variants of the same metal are duplicates.
    unique("product_variants_option_unique")
      .on(t.productId, t.material, t.size)
      .nullsNotDistinct(),
    index("product_variants_material_idx").on(t.material),
    index("product_variants_price_idx").on(t.priceCents),
    check("product_variants_price_positive", sql`${t.priceCents} > 0`),
    check("product_variants_stock_non_negative", sql`${t.stockQuantity} >= 0`),
    check(
      "product_variants_currency_format",
      sql`${t.currency} ~ '^[A-Z]{3}$'`,
    ),
  ],
);

export const productImages = pgTable(
  "product_images",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    productId: uuid("product_id")
      .notNull()
      .references(() => products.id, { onDelete: "cascade" }),
    /** Fallback `<img src>`: the most widely supported format. */
    url: text("url").notNull(),
    /** Modern-format alternatives for `<picture>`, best first (e.g. AVIF with a srcset). */
    sources: jsonb("sources")
      .$type<ImageSource[]>()
      .notNull()
      .default(sql`'[]'::jsonb`),
    alt: text("alt").notNull(),
    width: integer("width").notNull(),
    height: integer("height").notNull(),
    sortOrder: integer("sort_order").notNull(),
  },
  (t) => [
    unique("product_images_order_unique").on(t.productId, t.sortOrder),
    check(
      "product_images_dimensions_positive",
      sql`${t.width} > 0 and ${t.height} > 0`,
    ),
  ],
);

export const productCollections = pgTable(
  "product_collections",
  {
    productId: uuid("product_id")
      .notNull()
      .references(() => products.id, { onDelete: "cascade" }),
    collectionId: uuid("collection_id")
      .notNull()
      .references(() => collections.id, { onDelete: "cascade" }),
  },
  (t) => [
    primaryKey({ columns: [t.productId, t.collectionId] }),
    index("product_collections_collection_idx").on(t.collectionId),
  ],
);

export type ProductRow = typeof products.$inferSelect;
export type VariantRow = typeof productVariants.$inferSelect;
