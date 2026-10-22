import { Link } from "react-router";

import { formatPrice } from "~/lib/format";

import type { Product } from "../product.schema";
import { ProductImage } from "./product-image";

export function ProductCard({ product }: { product: Product }) {
  return (
    <article className="group relative">
      <ProductImage category={product.category} />
      <div className="mt-4 space-y-1">
        <h3 className="text-xl leading-snug">
          {/* The stretched link makes the whole card one target and one tab stop. */}
          <Link
            to={`/products/${product.slug}`}
            className="after:absolute after:inset-0"
          >
            {product.name}
          </Link>
        </h3>
        <p className="text-sm text-muted-foreground">{product.material}</p>
        <p className="text-sm font-medium">{formatPrice(product.priceCents)}</p>
      </div>
    </article>
  );
}

export function ProductCardSkeleton() {
  return (
    <div aria-hidden="true" className="animate-pulse">
      <div className="aspect-[4/5] bg-sand/70" />
      <div className="mt-4 space-y-2">
        <div className="h-5 w-3/4 bg-sand" />
        <div className="h-4 w-1/2 bg-sand/70" />
        <div className="h-4 w-1/4 bg-sand/70" />
      </div>
    </div>
  );
}
