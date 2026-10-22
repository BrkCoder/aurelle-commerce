import { PGlite } from "@electric-sql/pglite";
import { drizzle } from "drizzle-orm/pglite";
import { migrate } from "drizzle-orm/pglite/migrator";

import type { Db } from "./db.server";
import * as schema from "./schema";
import { seedCatalogue } from "./seed/seed-catalogue.server";

/** In-memory Postgres (WASM) with the real migrations applied and the catalogue seeded. */
export async function createDemoDb(
  options: { seed?: boolean } = {},
): Promise<Db> {
  const db = drizzle(new PGlite(), { schema });
  await migrate(db, { migrationsFolder: "./drizzle" });
  if (options.seed !== false) await seedCatalogue(db);
  return db;
}
