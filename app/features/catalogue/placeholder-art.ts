/**
 * TEMPORARY: generates line-art placeholder "photography" so the catalogue is
 * fully populated without hotlinking or licensing real images. Delete this file,
 * the `placeholder/*` route and the seed's `placeholderImageUrl` calls when real
 * photography is available; nothing else depends on it.
 */
import { z } from "zod";

import { categorySlugs, type CategorySlug } from "./categories";
import { getMaterial, materialSlugs, type MaterialSlug } from "./materials";

export const placeholderParamsSchema = z.object({
  category: z.enum(categorySlugs),
  material: z.enum(materialSlugs),
  view: z.coerce.number().int().min(1).max(3),
  seed: z.coerce.number().int().min(0).max(5).default(0),
});

export type PlaceholderParams = z.infer<typeof placeholderParamsSchema>;

export function placeholderImageUrl(params: {
  category: CategorySlug;
  material: MaterialSlug;
  view: number;
  seed: number;
}): string {
  const { category, material, view, seed } = params;
  return `/placeholder/${category}/${material}/${view}.svg?seed=${seed}`;
}

/** Each motif is drawn in a 100 × 100 box centred on (50, 50). `s` varies the design. */
function motif(category: CategorySlug, s: number): string {
  switch (category) {
    case "rings": {
      const stone = 7 + (s % 3) * 2;
      const halo =
        s % 3 === 1
          ? `<circle cx="50" cy="${40 - stone}" r="${stone + 5}"/>`
          : "";
      const extra =
        s % 3 === 2
          ? `<path d="M${50 - stone - 12} 44l5-8 5 8-5 4zM${50 + stone + 2} 44l5-8 5 8-5 4z"/>`
          : "";
      return `<circle cx="50" cy="66" r="${22 - (s % 2)}"/><circle cx="50" cy="66" r="${19 - (s % 2)}"/>
        <path d="M${50 - stone} ${40 - stone} 50 ${28 - stone} ${50 + stone} ${40 - stone} 50 ${48 - stone / 2}z"/>
        <path d="M${50 - stone} ${40 - stone}h${stone * 2}"/>${halo}${extra}`;
    }
    case "necklaces": {
      const pendant = [
        `<path d="M50 70 42 82 50 96 58 82z"/>`,
        `<circle cx="50" cy="82" r="9"/><circle cx="50" cy="82" r="5"/>`,
        `<path d="M50 70c10 8 10 20 0 28-10-8-10-20 0-28z"/>`,
      ][s % 3];
      return `<path d="M18 22c4 44 60 44 64 0"/><path d="M22 24c4 36 52 36 56 0" stroke-dasharray="1 2.4"/>${pendant}`;
    }
    case "earrings": {
      const drop = [
        (x: number) => `<path d="M${x} 38l-6 10 6 12 6-12z"/>`,
        (x: number) =>
          `<circle cx="${x}" cy="50" r="9"/><circle cx="${x}" cy="50" r="4"/>`,
        (x: number) => `<circle cx="${x}" cy="52" r="10"/>`,
      ][s % 3] as (x: number) => string;
      return [32, 68].map((x) => `<path d="M${x} 20v18"/>${drop(x)}`).join("");
    }
    case "bracelets": {
      const bands = 2 + (s % 3);
      return Array.from(
        { length: bands },
        (_, i) =>
          `<ellipse cx="50" cy="${50 + i * 4 - bands * 2}" rx="${30 - i * 2}" ry="${18 - i}"/>`,
      ).join("");
    }
  }
}

const backgrounds = [
  ["#efe7db", "#e8dfd2"],
  ["#f3ede3", "#e4d9c8"],
  ["#ebe2d5", "#f5efe6"],
] as const;

export function renderPlaceholderSvg({
  category,
  material,
  view,
  seed,
}: PlaceholderParams): string {
  const metal = getMaterial(material).swatch;
  const [from, to] = backgrounds[view - 1] ?? backgrounds[0];
  // View 1 centred, view 2 a close crop, view 3 a smaller "styled" composition.
  const scale = view === 2 ? 2.1 : view === 3 ? 0.62 : 1.05;
  const offsetY = view === 3 ? 6 : 0;

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 1000" width="800" height="1000">
  <defs><linearGradient id="g" x1="0" y1="0" x2="0.4" y2="1"><stop offset="0" stop-color="${from}"/><stop offset="1" stop-color="${to}"/></linearGradient></defs>
  <rect width="800" height="1000" fill="url(#g)"/>
  ${view === 3 ? `<circle cx="400" cy="470" r="250" fill="none" stroke="#b69a73" stroke-opacity="0.35" stroke-width="1.5"/>` : ""}
  <g transform="translate(400 ${470 + offsetY * 10}) scale(${scale * 4.6}) translate(-50 -50)" fill="none" stroke="${metal}" stroke-width="${view === 2 ? 0.7 : 0.9}" stroke-linecap="round" stroke-linejoin="round">${motif(category, seed)}</g>
  <text x="400" y="940" text-anchor="middle" font-family="sans-serif" font-size="14" letter-spacing="5" fill="#4a3b35" fill-opacity="0.55">AURELLE · DEVELOPMENT PLACEHOLDER</text>
</svg>`;
}
