/** Seeds the catalogue into the PostgreSQL database named by DATABASE_URL. Idempotent. */
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import * as schema from "../app/db/schema";
import { seedCatalogue } from "../app/db/seed/seed-catalogue.server";

const url = process.env.DATABASE_URL;
if (!url) {
  console.error("DATABASE_URL is not set (see .env.example).");
  process.exit(1);
}

const client = postgres(url, { max: 1 });
try {
  await seedCatalogue(drizzle(client, { schema }));
  console.log("Catalogue seeded.");
} finally {
  await client.end();
}
