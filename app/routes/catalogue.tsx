import { Suspense } from "react";
import { Await, redirect, useLocation } from "react-router";

import { Container } from "~/components/container";
import { StatusMessage } from "~/components/status-message";
import { Button } from "~/components/ui/button";
import { getDb } from "~/db/db.server";
import {
  ActiveFilters,
  CatalogueNav,
  FilterFields,
  FilterSheet,
  getCatalogueHeading,
  Pagination,
  parseCatalogueSearchParams,
  ProductGrid,
  ProductGridSkeleton,
  resetFilters,
  SortSelect,
  toSearchString,
  useGoToQuery,
} from "~/features/catalogue";
import {
  countProducts,
  getFilterOptions,
  listProductSummaries,
  pageCount,
} from "~/features/catalogue/catalogue.server";

import type { Route } from "./+types/catalogue";

export async function loader({ request }: Route.LoaderArgs) {
  const url = new URL(request.url);
  const parsed = parseCatalogueSearchParams(url.searchParams);
  const db = await getDb();
  const options = await getFilterOptions(db);

  // Unknown collection slugs can match nothing; drop them so the UI never shows raw slugs.
  const known = new Set(options.collections.map((c) => c.slug));
  const query = {
    ...parsed,
    collections: parsed.collections.filter((s) => known.has(s)),
  };

  const total = await countProducts(db, query);
  const totalPages = pageCount(total);

  // A page past the end (or a dropped collection) redirects to the nearest valid URL
  // instead of rendering an empty page.
  const page = Math.min(query.page, totalPages);
  if (
    page !== query.page ||
    query.collections.length !== parsed.collections.length
  ) {
    throw redirect(`/catalogue${toSearchString({ ...query, page })}`);
  }

  return {
    query,
    options,
    total,
    totalPages,
    // Not awaited: the page shell and filters render at once; the grid streams in.
    products: listProductSummaries(db, query),
  };
}

export function meta({ loaderData }: Route.MetaArgs) {
  const title = loaderData
    ? getCatalogueHeading(loaderData.query, loaderData.options.collections)
        .title
    : "Catalogue";
  return [
    { title: `${title} | Aurelle` },
    {
      name: "description",
      content:
        "Browse Aurelle fine jewellery: rings, necklaces, bracelets and earrings.",
    },
  ];
}

export default function Catalogue({ loaderData }: Route.ComponentProps) {
  const { query, options, total, totalPages, products } = loaderData;
  const { search } = useLocation();
  const goTo = useGoToQuery();
  const heading = getCatalogueHeading(query, options.collections);

  return (
    <Container className="pt-10 pb-4 md:pt-16">
      <header className="max-w-2xl">
        <h1 className="text-5xl md:text-6xl">{heading.title}</h1>
        <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
          {heading.description}
        </p>
      </header>

      <div className="mt-8">
        <CatalogueNav collections={options.collections} />
      </div>

      <div className="mt-10 lg:grid lg:grid-cols-[15rem_1fr] lg:gap-12">
        <aside aria-label="Filters" className="hidden lg:block">
          <div className="sticky top-28 max-h-[calc(100svh-8rem)] overflow-y-auto pr-2">
            <FilterFields options={options} />
          </div>
        </aside>

        <section aria-labelledby="results-heading">
          {/* Gives the product names (h3) a parent heading, keeping heading order valid. */}
          <h2 id="results-heading" className="sr-only">
            Results
          </h2>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <p role="status" className="text-sm text-muted-foreground">
              {total} {total === 1 ? "piece" : "pieces"}
            </p>
            <div className="flex w-full items-center gap-3 sm:w-auto">
              <FilterSheet options={options} />
              <SortSelect />
            </div>
          </div>

          <div className="mt-5">
            <ActiveFilters collections={options.collections} />
          </div>

          <div className="mt-8">
            {/* Keyed by URL so each new result set shows the skeleton while it streams in. */}
            <Suspense key={search} fallback={<ProductGridSkeleton />}>
              <Await
                resolve={products}
                errorElement={
                  <StatusMessage
                    eyebrow="Something went wrong"
                    title="We couldn't load the catalogue"
                    action={
                      <Button asChild variant="outline">
                        <a href={`/catalogue${search}`}>Try again</a>
                      </Button>
                    }
                  >
                    Please try again in a moment.
                  </StatusMessage>
                }
              >
                {(items) =>
                  items.length === 0 ? (
                    <StatusMessage
                      title="No pieces match your filters"
                      action={
                        <Button onClick={() => goTo(resetFilters)}>
                          Reset filters
                        </Button>
                      }
                    >
                      Try removing a filter or widening the price range to see
                      more of the collection.
                    </StatusMessage>
                  ) : (
                    <ProductGrid products={items} />
                  )
                }
              </Await>
            </Suspense>
          </div>

          <Pagination page={query.page} totalPages={totalPages} />
        </section>
      </div>
    </Container>
  );
}
