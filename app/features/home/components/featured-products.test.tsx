import { render, screen } from "@testing-library/react";
import { createRoutesStub } from "react-router";
import { describe, expect, it } from "vitest";

import type { ProductSummary } from "~/features/catalogue";

import { FeaturedProducts } from "./featured-products";

const product: ProductSummary = {
  id: "t-1",
  slug: "test-ring",
  name: "Test Ring",
  category: "rings",
  fromPriceCents: 120000,
  currency: "USD",
  hasPriceRange: false,
  images: [
    {
      sources: [],
      url: "/a.svg",
      alt: "Test Ring, front view",
      width: 800,
      height: 1000,
    },
    {
      sources: [],
      url: "/b.svg",
      alt: "Test Ring, detail view",
      width: 800,
      height: 1000,
    },
  ],
  materials: ["yellow-gold", "rose-gold"],
  availability: "in-stock",
  isNew: false,
};

function renderWith(products: ProductSummary[]) {
  const Stub = createRoutesStub([
    { path: "/", Component: () => <FeaturedProducts products={products} /> },
  ]);
  return render(<Stub />);
}

describe("FeaturedProducts", () => {
  it("renders a linked card with formatted price", () => {
    renderWith([product]);
    expect(screen.getByRole("link", { name: "Test Ring" })).toHaveAttribute(
      "href",
      "/products/test-ring",
    );
    expect(screen.getByText("$1,200")).toBeInTheDocument();
  });

  it("shows an empty state when there are no products", () => {
    renderWith([]);
    expect(
      screen.getByRole("heading", { name: "New pieces are on their way" }),
    ).toBeInTheDocument();
    expect(screen.queryByRole("list")).not.toBeInTheDocument();
  });
});
