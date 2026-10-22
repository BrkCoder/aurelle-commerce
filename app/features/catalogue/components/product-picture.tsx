import type { CatalogueImage } from "../catalogue.types";

/** 1×1 transparent GIF: costs no network request. */
const BLANK_IMAGE =
  "data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==";

/**
 * A product photo as `<picture>`: the browser takes the first `<source>` format it
 * supports (AVIF) at the width that suits `sizes`, and falls back to the plain `<img>`.
 * Width and height are always set so the box is reserved before the image loads.
 *
 * `alt=""` marks a decorative duplicate; pass the image's own `alt` for a real picture.
 */
export function ProductPicture({
  image,
  sizes,
  alt = image.alt,
  priority = false,
  hoverOnly = false,
  className,
}: {
  image: CatalogueImage;
  sizes: string;
  alt?: string;
  /** Above-the-fold: load now, at high priority. Everything else is lazy. */
  priority?: boolean;
  /**
   * For images shown only on hover. Devices that cannot hover (phones, tablets) are
   * given a blank image instead, so they never download a picture they cannot see.
   */
  hoverOnly?: boolean;
  className?: string;
}) {
  return (
    <picture>
      {hoverOnly ? <source media="(hover: none)" srcSet={BLANK_IMAGE} /> : null}
      {image.sources.map((source) => (
        <source
          key={source.type}
          type={source.type}
          srcSet={source.srcSet}
          sizes={sizes}
        />
      ))}
      <img
        src={image.url}
        alt={alt}
        width={image.width}
        height={image.height}
        sizes={sizes}
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : "auto"}
        decoding="async"
        className={className}
      />
    </picture>
  );
}
