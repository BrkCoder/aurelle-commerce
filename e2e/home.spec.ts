import { expect, test } from "@playwright/test";

test("homepage renders hero, categories and signature pieces", async ({
  page,
}) => {
  await page.goto("/");
  await expect(
    page.getByRole("heading", { level: 1, name: /Discover Luxury/ }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Shop by category" }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Signature pieces" }),
  ).toBeVisible();
  await expect(page.getByRole("article")).toHaveCount(4);
});

test("unknown URLs return a styled 404 inside the shell", async ({ page }) => {
  const response = await page.goto("/does-not-exist");
  expect(response?.status()).toBe(404);
  await expect(
    page.getByRole("heading", { name: "This page has slipped away" }),
  ).toBeVisible();
  await expect(page.getByRole("banner")).toBeVisible();
});

test("mobile menu opens and closes with the keyboard", async ({
  page,
  isMobile,
}) => {
  test.skip(!isMobile, "Menu button is hidden at desktop widths");
  await page.goto("/");
  await page.getByRole("button", { name: "Open menu" }).click();
  await expect(page.getByRole("dialog", { name: "Menu" })).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toBeHidden();
});
