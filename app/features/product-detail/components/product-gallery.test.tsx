import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import type { CatalogueImage } from "~/features/catalogue";

import { ProductGallery } from "./product-gallery";

const images: CatalogueImage[] = [1, 2, 3].map((n) => ({
  url: `/img-${n}.webp`,
  sources: [],
  alt: `Ring, view ${n}`,
  width: 800,
  height: 1000,
}));

function setup(list: CatalogueImage[] = images) {
  render(<ProductGallery images={list} />);
  return userEvent.setup();
}

const thumb = (n: number) =>
  screen.getByRole("radio", { name: `Ring, view ${n}` });
const main = () =>
  screen
    .getAllByRole("img")
    .find((i) => i.getAttribute("fetchpriority") !== null);

describe("ProductGallery", () => {
  it("starts on the first image with its alt text", () => {
    setup();
    expect(thumb(1)).toBeChecked();
    expect(main()).toHaveAttribute("alt", "Ring, view 1");
  });

  it("makes only the selected thumbnail a tab stop", () => {
    setup();
    expect(thumb(1)).toHaveAttribute("tabindex", "0");
    expect(thumb(2)).toHaveAttribute("tabindex", "-1");
  });

  it("moves and wraps with the arrow keys, Home and End", async () => {
    const user = setup();
    thumb(1).focus();

    await user.keyboard("{ArrowRight}");
    expect(thumb(2)).toBeChecked();
    expect(thumb(2)).toHaveFocus();

    await user.keyboard("{End}");
    expect(thumb(3)).toBeChecked();

    await user.keyboard("{ArrowRight}");
    expect(thumb(1)).toBeChecked(); // wraps to the start

    await user.keyboard("{ArrowLeft}");
    expect(thumb(3)).toBeChecked(); // and back to the end

    await user.keyboard("{Home}");
    expect(thumb(1)).toBeChecked();
  });

  it("changes the main image with the previous and next buttons", async () => {
    const user = setup();
    await user.click(screen.getByRole("button", { name: "Next image" }));
    expect(main()).toHaveAttribute("alt", "Ring, view 2");
    await user.click(screen.getByRole("button", { name: "Previous image" }));
    await user.click(screen.getByRole("button", { name: "Previous image" }));
    expect(main()).toHaveAttribute("alt", "Ring, view 3");
  });

  it("announces the current image to screen readers", async () => {
    const user = setup();
    await user.click(thumb(2));
    expect(screen.getByText("Image 2 of 3")).toBeInTheDocument();
  });

  it("opens a labelled zoom dialog and returns focus to the opener on Escape", async () => {
    const user = setup();
    const opener = screen.getByRole("button", { name: /Enlarge image/ });
    await user.click(opener);

    const dialog = await screen.findByRole("dialog");
    expect(dialog).toBeInTheDocument();

    const toggle = screen.getByRole("button", { name: "Zoom in" });
    expect(toggle).toHaveAttribute("aria-pressed", "false");
    await user.click(toggle);
    expect(screen.getByRole("button", { name: "Zoom out" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );

    await user.keyboard("{Escape}");
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(opener).toHaveFocus();
  });

  it("omits navigation controls for a single image", () => {
    setup([images[0] as CatalogueImage]);
    expect(screen.queryByRole("radiogroup")).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Next image" }),
    ).not.toBeInTheDocument();
  });

  it("renders a labelled placeholder when there are no images", () => {
    setup([]);
    expect(
      screen.getByRole("img", { name: "No image available" }),
    ).toBeInTheDocument();
  });
});
