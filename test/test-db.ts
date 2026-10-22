import { createDemoDb } from "~/db/demo-db.server";
import type { Db } from "~/db/db.server";
import { seedCatalogue } from "~/db/seed/seed-catalogue.server";

/** Fixed clock so "newest" order and "New" badges are reproducible. */
export const SEED_NOW = new Date("2026-06-01T12:00:00Z");

/** A fresh in-memory Postgres with real migrations and the catalogue seeded. */
export async function createTestDb(): Promise<Db> {
  const db = await createDemoDb({ seed: false });
  await seedCatalogue(db, SEED_NOW);
  return db;
}
