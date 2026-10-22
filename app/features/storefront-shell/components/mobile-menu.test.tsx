import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createRoutesStub } from "react-router";
import { describe, expect, it } from "vitest";

import { MobileMenu } from "./mobile-menu";

function setup() {
  const Stub = createRoutesStub([
    { path: "/", Component: MobileMenu },
    { path: "/catalogue", Component: () => <p>Catalogue page</p> },
  ]);
  render(<Stub />);
  return userEvent.setup();
}

describe("MobileMenu", () => {
  it("opens as a labelled dialog containing navigation", async () => {
    const user = setup();
    await user.click(screen.getByRole("button", { name: "Open menu" }));

    const dialog = await screen.findByRole("dialog", { name: "Menu" });
    expect(dialog).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Rings" })).toBeInTheDocument();
  });

  it("closes on Escape and returns focus to the trigger", async () => {
    const user = setup();
    const trigger = screen.getByRole("button", { name: "Open menu" });
    await user.click(trigger);
    await screen.findByRole("dialog");

    await user.keyboard("{Escape}");
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
  });

  it("closes after following a link", async () => {
    const user = setup();
    await user.click(screen.getByRole("button", { name: "Open menu" }));
    await user.click(await screen.findByRole("link", { name: "Shop all" }));

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });
});
