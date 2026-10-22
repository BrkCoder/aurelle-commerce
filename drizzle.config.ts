import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "postgresql",
  schema: "./app/db/schema.ts",
  out: "./drizzle",
  dbCredentials: {
    // Only needed for db:migrate; never commit a real value (see .env.example).
    url: process.env.DATABASE_URL ?? "",
  },
});
