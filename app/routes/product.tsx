import { Suspense } from "react";
import {
  Await,
  Link,
  useSearchParams,
  type ShouldRevalidateFunctionArgs,
} from "react-router";
import { z } from "zod";

import { Breadcrumbs } from "~/components/breadcrumbs";
import { Container } from "~/components/container";
import { getDb } from "~/db/db.server";
import {
  getCategory,
  parseVariantSelection,
  resolveVariantSelection,
} from "~/features/catalogue";
import {
  getProductBySlug,
  getRelatedProducts,
} from "~/features/catalogue/catalogue.server";
import {
  DeliveryAndReturns,
  ProductGallery,
  RelatedProducts,
  RelatedProductsSkeleton,
  Specifications,
  VariantSelector,
  VariantSummary,
} from "~/features/product-detail";

import type { Route } from "./+types/product";

const slugSchema = z
  .string()
  .max(100)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);

export async function loader({ params }: Route.LoaderArgs) {
  const slug = slugSchema.safeParse(params.slug);
  if (!slug.success) throw new Response("Not Found", { status: 404 });

  const db = await getDb();
  const product = await getProductBySlug(db, slug.data);
  if (!product) throw new Response("Not Found", { status: 404 });

  // Related products stream in after the main content.
  return { product, related: getRelatedProducts(db, product) };
}

/** Choosing a variant only changes the query string; nothing needs refetching. */
export function shouldRevalidate({
  currentUrl,
  nextUrl,
  defaultShouldRevalidate,
}: ShouldRevalidateFunctionArgs) {
  return currentUrl.pathname === nextUrl.pathname
    ? false
    : defaultShouldRevalidate;
}

export function meta({ loaderData }: Route.MetaArgs) {
  if (!loaderData) return [{ title: "Product not found | Aurelle" }];
  return [
    { title: `${loaderData.product.name} | Aurelle` },
    { name: "description", content: loaderData.product.description },
  ];
}

export default function Product({ loaderData }: Route.ComponentProps) {
  const { product, related } = loaderData;
  const [searchParams] = useSearchParams();
  const selection = resolveVariantSelection(
    product.variants,
    parseVariantSelection(searchParams),
  );
  const category = getCategory(product.category);

  return (
    <>
      <Container className="pt-6 pb-4 md:pt-10">
        <Breadcrumbs
          items={[
            { label: "Home", to: "/" },
            { label: "Catalogue", to: "/catalogue" },
            {
              label: category.name,
              to: `/catalogue?category=${category.slug}`,
            },
            { label: product.name },
          ]}
        />

        <div className="mt-8 grid gap-10 lg:grid-cols-[1.15fr_1fr] lg:gap-16">
          <ProductGallery key={product.id} images={product.images} />

          <div className="lg:sticky lg:top-28 lg:self-start">
            {product.isNew ? (
              <p className="mb-3 text-xs tracking-[0.18em] text-champagne-deep uppercase">
                New
              </p>
            ) : null}
            <h1 className="text-5xl leading-[1.05] md:text-6xl">
              {product.name}
            </h1>
            {product.collections.length > 0 ? (
              <p className="mt-3 text-sm text-muted-foreground">
                From the{" "}
                {product.collections.map((collection, i) => (
                  <span key={collection.slug}>
                    {i > 0 ? ", " : null}
                    <Link
                      to={`/catalogue?collection=${collection.slug}`}
                      className="underline decoration-champagne underline-offset-4"
                    >
                      {collection.name}
                    </Link>
                  </span>
                ))}{" "}
                collection
              </p>
            ) : null}

            <div className="mt-8">
              <VariantSummary variant={selection.variant} />
            </div>
            <p className="mt-6 leading-relaxed text-muted-foreground">
              {product.description}
            </p>

            <div className="mt-8">
              <VariantSelector
                category={product.category}
                selection={selection}
              />
            </div>

            {/* Add to bag and checkout arrive in the next phase; no inert controls until then. */}
            <p className="mt-8 border-t border-border pt-5 text-sm text-muted-foreground">
              Online ordering opens soon. Every piece is made to order and
              insured in transit.
            </p>

            <div className="mt-8">
              <DeliveryAndReturns />
            </div>
          </div>
        </div>

        <div className="mt-16 max-w-3xl">
          <Specifications product={product} />
        </div>
      </Container>

      <Suspense fallback={<RelatedProductsSkeleton />}>
        <Await resolve={related} errorElement={null}>
          {(products) => <RelatedProducts products={products} />}
        </Await>
      </Suspense>
    </>
  );
}
