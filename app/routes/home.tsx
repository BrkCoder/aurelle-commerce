import { Suspense } from "react";
import { Await } from "react-router";

import { StatusMessage } from "~/components/status-message";
import { getDb } from "~/db/db.server";
import { getFeaturedProducts } from "~/features/catalogue/catalogue.server";
import {
  BrandStory,
  CategoryGrid,
  FeaturedProducts,
  FeaturedProductsSkeleton,
  Hero,
} from "~/features/home";

import type { Route } from "./+types/home";

export function meta(_args: Route.MetaArgs) {
  return [
    { title: "Aurelle | Discover Luxury. Experience Elegance." },
    {
      name: "description",
      content:
        "Aurelle fine jewellery: rings, necklaces, earrings and bracelets in gold, pearl and diamond.",
    },
  ];
}

export function loader() {
  // Not awaited: the hero and categories render immediately while products stream in.
  return { featured: getDb().then((db) => getFeaturedProducts(db)) };
}

export default function Home({ loaderData }: Route.ComponentProps) {
  return (
    <>
      <Hero />
      <CategoryGrid />
      <Suspense fallback={<FeaturedProductsSkeleton />}>
        <Await
          resolve={loaderData.featured}
          errorElement={
            <StatusMessage title="We couldn't load our signature pieces">
              Please refresh the page to try again.
            </StatusMessage>
          }
        >
          {(products) => <FeaturedProducts products={products} />}
        </Await>
      </Suspense>
      <BrandStory />
    </>
  );
}
