import { expect, test, type Page } from "@playwright/test";

const price = (page: Page) =>
  page.getByRole("status").filter({ hasText: /^\$/ }).locator("p").first();

test.describe("product detail", () => {
  test("opens from the catalogue with breadcrumbs and details", async ({
    page,
  }) => {
    await page.goto("/catalogue?category=rings");
    await page.getByRole("link", { name: "Lumière Solitaire Ring" }).click();

    await expect(page).toHaveURL(/\/products\/lumiere-solitaire-ring/);
    await expect(
      page.getByRole("heading", { level: 1, name: "Lumière Solitaire Ring" }),
    ).toBeVisible();
    const breadcrumb = page.getByRole("navigation", { name: "Breadcrumb" });
    await expect(breadcrumb.getByRole("link", { name: "Rings" })).toBeVisible();
    await expect(
      breadcrumb.getByText("Lumière Solitaire Ring"),
    ).toHaveAttribute("aria-current", "page");
    await expect(
      page.getByRole("heading", { name: "Specifications" }),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "You may also love" }),
    ).toBeVisible();
    await expect(page.getByRole("button", { name: /add to bag/i })).toHaveCount(
      0,
    );
  });

  test("changing metal updates price, and the choice survives a reload", async ({
    page,
  }) => {
    await page.goto("/products/lumiere-solitaire-ring");
    const before = await price(page).innerText();

    await page.getByRole("link", { name: "Platinum" }).click();
    await expect(page).toHaveURL(/material=platinum/);
    await expect(page.getByRole("link", { name: "Platinum" })).toHaveAttribute(
      "aria-current",
      "true",
    );
    await expect.poll(() => price(page).innerText()).not.toBe(before);
    const platinumPrice = await price(page).innerText();

    await page.reload();
    await expect(page.getByRole("link", { name: "Platinum" })).toHaveAttribute(
      "aria-current",
      "true",
    );
    await expect(price(page)).toHaveText(platinumPrice);
  });

  test("changing size updates the selection and SKU", async ({ page }) => {
    await page.goto("/products/opale-sculpted-bangle");
    const sku = page.getByText(/^SKU /);
    const first = await sku.innerText();

    await page.getByRole("link", { name: "18 cm" }).click();
    await expect(page).toHaveURL(/size=18/);
    await expect(page.getByRole("link", { name: "18 cm" })).toHaveAttribute(
      "aria-current",
      "true",
    );
    await expect.poll(() => sku.innerText()).not.toBe(first);
  });

  test("variant choices replace history entries instead of stacking them", async ({
    page,
  }) => {
    await page.goto("/catalogue?category=rings");
    await page.getByRole("link", { name: "Lumière Solitaire Ring" }).click();
    await page.getByRole("link", { name: "Platinum" }).click();
    await page.getByRole("link", { name: "White gold" }).click();
    await page.goBack();
    await expect(page).toHaveURL(/\/catalogue\?category=rings/);
  });

  test("sold-out variants are labelled, and a fully sold-out piece says so", async ({
    page,
  }) => {
    await page.goto("/products/noor-sapphire-cocktail-ring");
    await expect(
      page.getByText("Sold out", { exact: false }).first(),
    ).toBeVisible();
  });

  test("unknown and malformed slugs are real 404s inside the shell", async ({
    page,
  }) => {
    const missing = await page.goto("/products/no-such-piece");
    expect(missing?.status()).toBe(404);
    await expect(
      page.getByRole("heading", { name: "This page has slipped away" }),
    ).toBeVisible();
    await expect(page.getByRole("banner")).toBeVisible();

    const malformed = await page.goto("/products/NOT_A_SLUG");
    expect(malformed?.status()).toBe(404);
  });

  test("related products link to other pieces", async ({ page }) => {
    await page.goto("/products/lumiere-solitaire-ring");
    const related = page.getByRole("region", { name: "You may also love" });
    await expect(related.getByRole("article")).toHaveCount(4);
    await related.getByRole("article").first().getByRole("link").click();
    await expect(page).toHaveURL(/\/products\/(?!lumiere-solitaire-ring)/);
  });
});

test.describe("gallery", () => {
  test("thumbnails are one tab stop and move with the arrow keys", async ({
    page,
  }) => {
    await page.goto("/products/lumiere-solitaire-ring");
    const thumbs = page
      .getByRole("radiogroup", { name: "Product images" })
      .getByRole("radio");
    await expect(thumbs).toHaveCount(3);
    await expect(thumbs.nth(0)).toBeChecked();

    await thumbs.nth(0).focus();
    await page.keyboard.press("ArrowRight");
    await expect(thumbs.nth(1)).toBeChecked();
    await expect(thumbs.nth(1)).toBeFocused();
    await expect(page.getByText("Image 2 of 3")).toBeAttached();

    await page.keyboard.press("End");
    await expect(thumbs.nth(2)).toBeChecked();
    await page.keyboard.press("ArrowRight");
    await expect(thumbs.nth(0)).toBeChecked();
  });

  test("main image has descriptive alt text matching the selected thumbnail", async ({
    page,
  }) => {
    await page.goto("/products/lumiere-solitaire-ring");
    await expect(
      page.getByRole("img", { name: "Lumière Solitaire Ring, front view" }),
    ).toBeVisible();
    await page
      .getByRole("radio", { name: "Lumière Solitaire Ring, detail view" })
      .click();
    await expect(
      page.getByRole("img", { name: "Lumière Solitaire Ring, detail view" }),
    ).toBeVisible();
  });

  test("zoom opens as a modal, can be toggled, and returns focus on Escape", async ({
    page,
  }) => {
    await page.goto("/products/lumiere-solitaire-ring");
    const opener = page.getByRole("button", { name: /Enlarge image/ });
    await opener.focus();
    await page.keyboard.press("Enter");

    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible();
    const toggle = dialog.getByRole("button", { name: "Zoom in" });
    await toggle.click();
    await expect(
      dialog.getByRole("button", { name: "Zoom out" }),
    ).toHaveAttribute("aria-pressed", "true");

    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden();
    await expect(opener).toBeFocused();
  });
});

test.describe("keyboard", () => {
  test("a product card is a single tab stop that activates with Enter", async ({
    page,
  }) => {
    await page.goto("/catalogue");
    const card = page.getByRole("article").first();
    await expect(card.getByRole("link")).toHaveCount(1);
    await card.getByRole("link").focus();
    await page.keyboard.press("Enter");
    await expect(page).toHaveURL(/\/products\//);
  });

  test("variant options are reachable and operable by keyboard", async ({
    page,
  }) => {
    await page.goto("/products/lumiere-solitaire-ring");
    const link = page.getByRole("link", { name: "White gold" });
    await link.focus();
    await page.keyboard.press("Enter");
    await expect(page).toHaveURL(/material=white-gold/);
  });
});
