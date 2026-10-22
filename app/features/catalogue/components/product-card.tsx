import { Link } from "react-router";

import { formatPrice } from "~/lib/format";
import { cn } from "~/lib/utils";

import { availabilityLabels } from "../availability";
import type { ProductSummary } from "../catalogue.types";
import { getMaterial } from "../materials";

function Badge({
  children,
  tone,
}: {
  children: string;
  tone: "plain" | "muted";
}) {
  return (
    <span
      className={cn(
        "bg-ivory/95 px-2.5 py-1 text-[0.6875rem] tracking-[0.16em] uppercase",
        tone === "muted" ? "text-muted-foreground" : "text-foreground",
      )}
    >
      {children}
    </span>
  );
}

/**
 * `priority` marks above-the-fold cards: their image loads eagerly with high fetch
 * priority; everything else is lazy so the first screen is fast.
 */
export function ProductCard({
  product,
  priority = false,
}: {
  product: ProductSummary;
  priority?: boolean;
}) {
  const [primary, secondary] = product.images;
  const price = formatPrice(product.fromPriceCents, product.currency);

  return (
    <article className="group relative">
      <div className="relative aspect-[4/5] overflow-hidden bg-sand">
        {primary ? (
          <img
            src={primary.url}
            alt={primary.alt}
            width={primary.width}
            height={primary.height}
            sizes="(min-width: 1024px) 22vw, 46vw"
            loading={priority ? "eager" : "lazy"}
            fetchPriority={priority ? "high" : "auto"}
            decoding="async"
            className="absolute inset-0 size-full object-cover"
          />
        ) : null}
        {secondary ? (
          // Decorative alternate view: revealed on hover (pointer devices only).
          <img
            src={secondary.url}
            alt=""
            width={secondary.width}
            height={secondary.height}
            sizes="(min-width: 1024px) 22vw, 46vw"
            loading="lazy"
            decoding="async"
            className="absolute inset-0 size-full object-cover opacity-0 transition-opacity duration-500 ease-luxe group-hover:opacity-100 motion-reduce:transition-none"
          />
        ) : null}
        <div className="absolute top-3 left-3 flex flex-col items-start gap-1.5">
          {product.availability === "sold-out" ? (
            <Badge tone="muted">{availabilityLabels["sold-out"]}</Badge>
          ) : null}
          {product.availability === "low-stock" ? (
            <Badge tone="plain">{availabilityLabels["low-stock"]}</Badge>
          ) : null}
          {product.isNew ? <Badge tone="plain">New</Badge> : null}
        </div>
      </div>

      <div className="mt-4 space-y-1.5">
        <h3 className="text-xl leading-snug">
          {/* The stretched link makes the whole card one target and one tab stop. */}
          <Link
            to={`/products/${product.slug}`}
            className="after:absolute after:inset-0"
          >
            {product.name}
          </Link>
        </h3>
        <p
          className={cn(
            "text-sm font-medium",
            product.availability === "sold-out" && "text-muted-foreground",
          )}
        >
          {product.hasPriceRange ? (
            <span className="font-normal">From </span>
          ) : null}
          {price}
        </p>
        <ul
          aria-label="Available metals"
          className="flex items-center gap-1.5 pt-0.5"
        >
          {product.materials.map((slug) => {
            const material = getMaterial(slug);
            return (
              <li key={slug}>
                <span
                  aria-hidden="true"
                  className="block size-3.5 rounded-full border border-mocha/30"
                  style={{ backgroundColor: material.swatch }}
                />
                <span className="sr-only">{material.name}</span>
              </li>
            );
          })}
        </ul>
      </div>
    </article>
  );
}

export function ProductCardSkeleton() {
  return (
    <div aria-hidden="true" className="animate-pulse">
      <div className="aspect-[4/5] bg-sand/70" />
      <div className="mt-4 space-y-2.5">
        <div className="h-5 w-3/4 bg-sand" />
        <div className="h-4 w-1/4 bg-sand/70" />
        <div className="h-3.5 w-1/5 bg-sand/70" />
      </div>
    </div>
  );
}
