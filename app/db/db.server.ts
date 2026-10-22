import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import * as schema from "./schema";

let instance: ReturnType<typeof createDb> | undefined;

function createDb() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error("DATABASE_URL is not set (see .env.example).");
  }
  return drizzle(postgres(url), { schema });
}

/** Lazy so importing this module never requires a database (tests, builds). */
export function getDb() {
  instance ??= createDb();
  return instance;
}
