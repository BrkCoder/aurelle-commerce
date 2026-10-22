import type { PgDatabase, PgQueryResultHKT } from "drizzle-orm/pg-core";

import type * as schema from "./schema";

/** Driver-agnostic handle: postgres-js in production, PGlite in demo and tests. */
export type Db = PgDatabase<PgQueryResultHKT, typeof schema>;

const globalForDb = globalThis as { __aurelleDb?: Promise<Db> };

/**
 * Lazy and cached, so importing this module never needs a database (builds, unit
 * tests) and dev hot-reloads reuse one connection.
 *
 * - `DATABASE_URL` set: PostgreSQL via postgres-js.
 * - Otherwise, outside production (or with `AURELLE_DEMO_DB=1`): an ephemeral
 *   in-memory PGlite database, migrated and seeded on first use. Data resets on
 *   restart, which is fine while the catalogue is read-only.
 * - Otherwise: throw, so production never silently runs on a throwaway database.
 */
export function getDb(): Promise<Db> {
  globalForDb.__aurelleDb ??= createDb();
  return globalForDb.__aurelleDb;
}

async function createDb(): Promise<Db> {
  const url = process.env.DATABASE_URL;
  if (url) {
    const [{ drizzle }, { default: postgres }, schema] = await Promise.all([
      import("drizzle-orm/postgres-js"),
      import("postgres"),
      import("./schema"),
    ]);
    return drizzle(postgres(url), { schema });
  }

  const demoAllowed =
    process.env.NODE_ENV !== "production" ||
    process.env.AURELLE_DEMO_DB === "1";
  if (!demoAllowed) {
    throw new Error("DATABASE_URL is not set (see .env.example).");
  }

  console.warn(
    "[db] DATABASE_URL not set: using an in-memory demo database (data resets on restart).",
  );
  const { createDemoDb } = await import("./demo-db.server");
  return createDemoDb();
}
