import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const pages = [
  ["homepage", "/"],
  ["catalogue", "/catalogue"],
  [
    "filtered catalogue",
    "/catalogue?category=rings&material=rose-gold&availability=in-stock&min=500&max=5000",
  ],
  ["empty catalogue", "/catalogue?category=earrings&material=platinum&max=500"],
  ["product", "/products/lumiere-solitaire-ring"],
  ["sold-out product", "/products/noor-sapphire-cocktail-ring"],
  ["404", "/products/nope"],
] as const;

for (const [name, path] of pages) {
  test(`${name} has no WCAG A/AA violations`, async ({ page }) => {
    await page.goto(path);
    await page.waitForLoadState("networkidle");
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
      .analyze();
    expect(
      results.violations.map(
        (v) =>
          `${v.id} (${v.impact}): ${v.nodes.map((n) => n.target.join(" ")).join(" | ")}`,
      ),
    ).toEqual([]);
  });
}

test("filter sheet and zoom dialog have no violations when open", async ({
  page,
  isMobile,
}) => {
  if (isMobile) {
    await page.goto("/catalogue");
    await page.waitForLoadState("networkidle");
    await page.getByRole("button", { name: /^Filters/ }).click();
  } else {
    await page.goto("/products/lumiere-solitaire-ring");
    await page.waitForLoadState("networkidle");
    await page.getByRole("button", { name: /Enlarge image/ }).click();
  }

  // Axe reads blended colours, so wait for the open animation to finish: mid-fade
  // the dialog is semi-transparent and reports contrast that no user ever sees.
  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();
  await expect(dialog).toHaveCSS("opacity", "1");
  await page.waitForTimeout(100);

  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa"])
    .analyze();
  expect(results.violations.map((v) => v.id)).toEqual([]);
});
