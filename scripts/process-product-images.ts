/**
 * Converts source photos in incoming-images/<slug>/<view>.png into optimised AVIF
 * (several widths) and one WebP fallback under public/images/products/.
 *
 *   npm run images:process            skips files that already exist
 *   npm run images:process -- --force  regenerates everything
 */
import { existsSync, mkdirSync } from "node:fs";
import { dirname } from "node:path";
import sharp from "sharp";

import {
  imageViews,
  outputFiles,
} from "../app/features/catalogue/product-images";
import { productSeeds } from "../app/db/seed/catalogue-data";

const force = process.argv.includes("--force");
let written = 0;
let skipped = 0;
const missing: string[] = [];

for (const { slug } of productSeeds) {
  for (const { view } of imageViews) {
    const source = `incoming-images/${slug}/${view}.png`;
    if (!existsSync(source)) {
      missing.push(source);
      continue;
    }
    for (const output of outputFiles(slug, view)) {
      if (!force && existsSync(output.path)) {
        skipped++;
        continue;
      }
      mkdirSync(dirname(output.path), { recursive: true });
      const image = sharp(source).resize({
        width: output.width,
        withoutEnlargement: true,
      });
      await (
        output.format === "avif"
          ? image.avif({ quality: 52, effort: 4 })
          : image.webp({ quality: 80 })
      ).toFile(output.path);
      written++;
    }
  }
}

console.log(`Wrote ${written} files, skipped ${skipped} existing.`);
if (missing.length > 0) {
  console.error(
    `Missing ${missing.length} source images:\n  ${missing.join("\n  ")}`,
  );
  process.exit(1);
}
