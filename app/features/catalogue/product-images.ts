/**
 * File naming for product photography, shared by the processing script, the seed and
 * the UI so the three can never disagree.
 *
 * Source photos live in `incoming-images/<slug>/<view>.png` (git-ignored) and are
 * converted by `npm run images:process` into `public/images/products/<slug>/`.
 *
 * View 1 is the front, 2 the detail close-up, 3 the styled shot.
 */
export const IMAGE_WIDTHS = [400, 800, 1200, 1600] as const;
/** Intrinsic size recorded on the fallback file; every image is 4:5 portrait. */
export const FALLBACK_WIDTH = 800;
export const FALLBACK_HEIGHT = 1000;

export type ImageSource = { type: string; srcSet: string };

export const imageViews = [
  { view: 1, label: "front view" },
  { view: 2, label: "detail view" },
  { view: 3, label: "styled view" },
] as const;

const basePath = (slug: string) => `/images/products/${slug}`;

/** Fallback `<img>` file: the broadest-compatible format at the default size. */
export function fallbackImageUrl(slug: string, view: number): string {
  return `${basePath(slug)}/${view}-${FALLBACK_WIDTH}.webp`;
}

/** `<source>` entries, best format first. Browsers pick the first type they support. */
export function imageSources(slug: string, view: number): ImageSource[] {
  return [
    {
      type: "image/avif",
      srcSet: IMAGE_WIDTHS.map(
        (w) => `${basePath(slug)}/${view}-${w}.avif ${w}w`,
      ).join(", "),
    },
  ];
}

/** Every file the processing script must produce for one source photo. */
export function outputFiles(slug: string, view: number) {
  return [
    ...IMAGE_WIDTHS.map((width) => ({
      format: "avif" as const,
      width,
      path: `public${basePath(slug)}/${view}-${width}.avif`,
    })),
    {
      format: "webp" as const,
      width: FALLBACK_WIDTH,
      path: `public${fallbackImageUrl(slug, view)}`,
    },
  ];
}

/** Everything the UI needs to render one photo; structurally a `CatalogueImage`. */
export function productImage(slug: string, view: number, alt: string) {
  return {
    url: fallbackImageUrl(slug, view),
    sources: imageSources(slug, view),
    alt,
    width: FALLBACK_WIDTH,
    height: FALLBACK_HEIGHT,
  };
}
