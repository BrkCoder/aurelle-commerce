import type { ProductSummary } from "../catalogue.types";
import { ProductCard, ProductCardSkeleton } from "./product-card";

const gridClasses =
  "grid grid-cols-2 gap-x-4 gap-y-10 lg:grid-cols-3 xl:grid-cols-4 lg:gap-x-6";

/** Cards in the first row are above the fold on most screens, so they load eagerly. */
const EAGER_COUNT = 4;

export function ProductGrid({ products }: { products: ProductSummary[] }) {
  return (
    <ul className={gridClasses}>
      {products.map((product, index) => (
        <li key={product.id}>
          <ProductCard product={product} priority={index < EAGER_COUNT} />
        </li>
      ))}
    </ul>
  );
}

/** Same footprint as the real grid, so results arriving cause no layout shift. */
export function ProductGridSkeleton({ count = 12 }: { count?: number }) {
  return (
    <div role="status" aria-label="Loading products">
      <ul className={gridClasses}>
        {Array.from({ length: count }, (_, i) => (
          <li key={i}>
            <ProductCardSkeleton />
          </li>
        ))}
      </ul>
    </div>
  );
}
