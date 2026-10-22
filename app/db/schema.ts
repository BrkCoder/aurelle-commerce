import {
  boolean,
  integer,
  pgTable,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

/**
 * Mirrors productSchema in features/catalogue. Not yet read by any route:
 * the storefront shell runs on seed data until the catalogue slice.
 */
export const products = pgTable("products", {
  id: text("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  category: text("category").notNull(),
  material: text("material").notNull(),
  priceCents: integer("price_cents").notNull(),
  description: text("description").notNull(),
  featured: boolean("featured").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});
