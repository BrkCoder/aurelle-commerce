import { Link } from "react-router";

import { Container } from "~/components/container";
import { StatusMessage } from "~/components/status-message";
import { Button } from "~/components/ui/button";
import {
  ProductCard,
  ProductCardSkeleton,
  type Product,
} from "~/features/catalogue";

export function FeaturedProducts({ products }: { products: Product[] }) {
  return (
    <section aria-labelledby="featured-heading" className="mt-24 md:mt-32">
      <Container>
        <div className="flex items-end justify-between gap-6">
          <h2 id="featured-heading" className="text-4xl md:text-5xl">
            Signature pieces
          </h2>
          <Link
            to="/catalogue"
            className="text-xs tracking-[0.18em] whitespace-nowrap uppercase underline decoration-champagne underline-offset-8"
          >
            View all
          </Link>
        </div>
        {products.length === 0 ? (
          <StatusMessage
            title="New pieces are on their way"
            action={
              <Button asChild variant="outline">
                <Link to="/catalogue">Browse the catalogue</Link>
              </Button>
            }
          >
            Our signature collection is being refreshed. Please check back soon.
          </StatusMessage>
        ) : (
          <ul className="mt-10 grid grid-cols-2 gap-x-4 gap-y-10 lg:grid-cols-4 lg:gap-x-6">
            {products.map((product) => (
              <li key={product.id}>
                <ProductCard product={product} />
              </li>
            ))}
          </ul>
        )}
      </Container>
    </section>
  );
}

/** Streaming / suspense fallback with the same footprint as the real grid. */
export function FeaturedProductsSkeleton() {
  return (
    <section
      role="status"
      aria-label="Loading signature pieces"
      className="mt-24 md:mt-32"
    >
      <Container>
        <div aria-hidden="true" className="h-10 w-64 animate-pulse bg-sand" />
        <ul className="mt-10 grid grid-cols-2 gap-x-4 gap-y-10 lg:grid-cols-4 lg:gap-x-6">
          {Array.from({ length: 4 }, (_, i) => (
            <li key={i}>
              <ProductCardSkeleton />
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
