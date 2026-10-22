import { render, screen } from "@testing-library/react";
import { createRoutesStub } from "react-router";
import { describe, expect, it } from "vitest";

import type { Product } from "~/features/catalogue";

import { FeaturedProducts } from "./featured-products";

const product: Product = {
  id: "t-1",
  slug: "test-ring",
  name: "Test Ring",
  category: "rings",
  material: "18k gold",
  priceCents: 120000,
  description: "A test ring.",
  featured: true,
};

function renderWith(products: Product[]) {
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
