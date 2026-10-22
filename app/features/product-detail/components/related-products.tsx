import { Container } from "~/components/container";
import {
  ProductCard,
  ProductCardSkeleton,
  type ProductSummary,
} from "~/features/catalogue";

export function RelatedProducts({ products }: { products: ProductSummary[] }) {
  if (products.length === 0) return null;
  return (
    <section aria-labelledby="related-heading" className="mt-24 md:mt-32">
      <Container>
        <h2 id="related-heading" className="text-4xl md:text-5xl">
          You may also love
        </h2>
        <ul className="mt-10 grid grid-cols-2 gap-x-4 gap-y-10 lg:grid-cols-4 lg:gap-x-6">
          {products.map((product) => (
            <li key={product.id}>
              <ProductCard product={product} />
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}

export function RelatedProductsSkeleton() {
  return (
    <section
      role="status"
      aria-label="Loading related products"
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
