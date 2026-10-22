import { render, screen, within } from "@testing-library/react";
import { createRoutesStub } from "react-router";
import { describe, expect, it } from "vitest";

import type { ProductSummary } from "../catalogue.types";
import { ProductCard } from "./product-card";

const base: ProductSummary = {
  id: "p1",
  slug: "test-ring",
  name: "Test Ring",
  category: "rings",
  fromPriceCents: 489000,
  currency: "USD",
  hasPriceRange: false,
  images: [
    { url: "/a.svg", alt: "Test Ring, front view", width: 800, height: 1000 },
    { url: "/b.svg", alt: "Test Ring, detail view", width: 800, height: 1000 },
  ],
  materials: ["yellow-gold", "platinum"],
  availability: "in-stock",
  isNew: false,
};

function renderCard(overrides: Partial<ProductSummary> = {}, priority = false) {
  const Stub = createRoutesStub([
    {
      path: "/",
      Component: () => (
        <ProductCard product={{ ...base, ...overrides }} priority={priority} />
      ),
    },
  ]);
  return render(<Stub />);
}

describe("ProductCard", () => {
  it("links the whole card with a single link to the product", () => {
    renderCard();
    expect(screen.getAllByRole("link")).toHaveLength(1);
    expect(screen.getByRole("link", { name: "Test Ring" })).toHaveAttribute(
      "href",
      "/products/test-ring",
    );
  });

  it("prefixes 'From' only when variants differ in price", () => {
    renderCard({ hasPriceRange: true });
    expect(screen.getByText("From")).toBeInTheDocument();
    expect(screen.getByText("$4,890")).toBeInTheDocument();
  });

  it("shows no 'From' for a single price", () => {
    renderCard();
    expect(screen.queryByText("From")).not.toBeInTheDocument();
  });

  it("gives the primary image alt text and hides the hover image from assistive tech", () => {
    renderCard();
    expect(
      screen.getByRole("img", { name: "Test Ring, front view" }),
    ).toBeInTheDocument();
    expect(screen.getAllByRole("img")).toHaveLength(1); // the alt="" hover image is presentational
  });

  it("loads eagerly only when marked as priority", () => {
    const { unmount } = renderCard({}, true);
    const eager = screen.getByRole("img", { name: "Test Ring, front view" });
    expect(eager).toHaveAttribute("loading", "eager");
    expect(eager).toHaveAttribute("fetchpriority", "high");
    unmount();

    renderCard();
    expect(
      screen.getByRole("img", { name: "Test Ring, front view" }),
    ).toHaveAttribute("loading", "lazy");
  });

  it("lists available metals as text for screen readers", () => {
    renderCard();
    const metals = screen.getByRole("list", { name: "Available metals" });
    expect(within(metals).getByText("Yellow gold")).toBeInTheDocument();
    expect(within(metals).getByText("Platinum")).toBeInTheDocument();
  });

  it.each([
    [{ isNew: true }, "New"],
    [{ availability: "low-stock" as const }, "Low stock"],
    [{ availability: "sold-out" as const }, "Sold out"],
  ])("shows a badge from real data: %j", (overrides, label) => {
    renderCard(overrides);
    expect(screen.getByText(label)).toBeInTheDocument();
  });

  it("shows no badges for an ordinary in-stock product", () => {
    renderCard();
    for (const label of ["New", "Low stock", "Sold out"]) {
      expect(screen.queryByText(label)).not.toBeInTheDocument();
    }
  });
});
