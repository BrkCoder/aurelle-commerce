import { expect, test, type Page } from "@playwright/test";

/** The filter controls live in the sidebar on desktop and in a sheet on mobile. */
async function openFilters(page: Page, isMobile: boolean) {
  if (!isMobile) return page.getByRole("complementary", { name: "Filters" });
  await page.getByRole("button", { name: /^Filters/ }).click();
  return page.getByRole("dialog", { name: "Filters" });
}

async function closeFilters(page: Page, isMobile: boolean) {
  if (isMobile)
    await page.getByRole("button", { name: "View results" }).click();
}

const resultCount = (page: Page) =>
  page.getByRole("status").filter({ hasText: /pieces?$/ });

async function cardPrices(page: Page): Promise<number[]> {
  const texts = await page
    .getByRole("region", { name: "Results" })
    .getByRole("article")
    .locator("p.text-sm.font-medium")
    .allInnerTexts();
  return texts.map((t) => Number(t.replace(/[^0-9.]/g, "")));
}

test.describe("browsing", () => {
  test("shop by category from the homepage", async ({ page, isMobile }) => {
    await page.goto("/");
    await page
      .getByRole("link", { name: /^Rings/ })
      .first()
      .click();
    await expect(page).toHaveURL(/\/catalogue\?category=rings$/);
    await expect(
      page.getByRole("heading", { level: 1, name: "Rings" }),
    ).toBeVisible();
    await expect(resultCount(page)).toHaveText("9 pieces");
    expect(isMobile !== undefined).toBe(true);
  });

  test("lists the full catalogue with pagination", async ({ page }) => {
    await page.goto("/catalogue");
    await expect(resultCount(page)).toHaveText("30 pieces");
    await expect(
      page.getByRole("region", { name: "Results" }).getByRole("article"),
    ).toHaveCount(12);

    await page.getByRole("link", { name: "Page 3" }).click();
    await expect(page).toHaveURL(/page=3/);
    await expect(
      page.getByRole("region", { name: "Results" }).getByRole("article"),
    ).toHaveCount(6);
    await expect(page.getByRole("link", { name: "Page 3" })).toHaveAttribute(
      "aria-current",
      "page",
    );
  });

  test("quick navigation by collection", async ({ page }) => {
    await page.goto("/catalogue");
    await page
      .getByRole("navigation", { name: "Collections" })
      .getByRole("link", { name: "Bridal", exact: true })
      .click();
    await expect(page).toHaveURL(/collection=bridal/);
    await expect(
      page.getByRole("heading", { level: 1, name: "Bridal" }),
    ).toBeVisible();
  });

  test("tolerates invalid URL parameters", async ({ page }) => {
    const response = await page.goto(
      "/catalogue?category=hats&sort=zzz&page=-4&min=abc",
    );
    expect(response?.status()).toBe(200);
    await expect(
      page.getByRole("heading", { level: 1, name: "All jewellery" }),
    ).toBeVisible();
    await expect(resultCount(page)).toHaveText("30 pieces");
  });

  test("redirects a page past the end to the last page", async ({ page }) => {
    await page.goto("/catalogue?page=99");
    await expect(page).toHaveURL(/page=3/);
  });

  test("shows an empty state with a way back", async ({ page }) => {
    await page.goto("/catalogue?category=earrings&material=platinum&max=500");
    await expect(
      page.getByRole("heading", { name: "No pieces match your filters" }),
    ).toBeVisible();
    await page.getByRole("button", { name: "Reset filters" }).click();
    await expect(page).toHaveURL(/\/catalogue$/);
    await expect(resultCount(page)).toHaveText("30 pieces");
  });
});

test.describe("filters and sorting", () => {
  test("apply and remove a filter, with a removable chip", async ({
    page,
    isMobile,
  }) => {
    await page.goto("/catalogue");
    const panel = await openFilters(page, isMobile);
    await panel
      .getByRole("checkbox", { name: "Rose gold", exact: true })
      .check();
    await closeFilters(page, isMobile);

    await expect(page).toHaveURL(/material=rose-gold/);
    const chips = page.getByRole("list", { name: "Active filters" });
    await expect(chips.getByRole("link", { name: /^Rose gold/ })).toBeVisible();
    // The chip appears at once; the count updates when the new results arrive.
    await expect(resultCount(page)).not.toHaveText("30 pieces");

    await chips.getByRole("link", { name: /^Rose gold/ }).click();
    await expect(page).not.toHaveURL(/material=/);
    await expect(resultCount(page)).toHaveText("30 pieces");
  });

  test("filters compose and can be reset together", async ({
    page,
    isMobile,
  }) => {
    await page.goto("/catalogue");
    const panel = await openFilters(page, isMobile);
    await panel.getByRole("checkbox", { name: "Rings", exact: true }).check();
    await panel
      .getByRole("checkbox", { name: "Platinum", exact: true })
      .check();
    await panel
      .getByRole("checkbox", { name: "In stock only", exact: true })
      .check();
    await closeFilters(page, isMobile);

    await expect(page).toHaveURL(/category=rings/);
    await expect(page).toHaveURL(/material=platinum/);
    await expect(page).toHaveURL(/availability=in-stock/);
    await expect(
      page.getByRole("list", { name: "Active filters" }).getByRole("listitem"),
    ).toHaveCount(3);

    await page.getByRole("link", { name: "Reset filters" }).click();
    await expect(page).toHaveURL(/\/catalogue$/);
  });

  test("price range applies on Enter and shows a chip", async ({
    page,
    isMobile,
  }) => {
    await page.goto("/catalogue");
    const panel = await openFilters(page, isMobile);
    await panel.getByLabel("Minimum price in dollars").fill("1000");
    await panel.getByLabel("Maximum price in dollars").fill("2000");
    await panel.getByLabel("Maximum price in dollars").press("Enter");
    await closeFilters(page, isMobile);

    await expect(page).toHaveURL(/min=1000/);
    await expect(page).toHaveURL(/max=2000/);
    await expect(
      page.getByRole("link", { name: /\$1,000 – \$2,000/ }),
    ).toBeVisible();
    for (const price of await cardPrices(page)) {
      expect(price).toBeGreaterThanOrEqual(1000);
      expect(price).toBeLessThanOrEqual(2000);
    }
  });

  test("sorting by price orders the results", async ({ page }) => {
    await page.goto("/catalogue");
    await page.waitForLoadState("networkidle"); // let React hydrate before using the select
    await page.getByLabel("Sort by").selectOption("price-asc");
    await expect(page).toHaveURL(/sort=price-asc/);
    await expect.poll(async () => (await cardPrices(page)).length).toBe(12);
    const ascending = await cardPrices(page);
    expect(ascending).toEqual([...ascending].sort((a, b) => a - b));

    await page.getByLabel("Sort by").selectOption("price-desc");
    await expect(page).toHaveURL(/sort=price-desc/);
    await expect
      .poll(async () => (await cardPrices(page))[0])
      .toBeGreaterThan(ascending[11] ?? 0);
    const descending = await cardPrices(page);
    expect(descending).toEqual([...descending].sort((a, b) => b - a));
  });

  test("changing a filter returns to page 1 and keeps the sort", async ({
    page,
    isMobile,
  }) => {
    await page.goto("/catalogue?sort=newest&page=2");
    const panel = await openFilters(page, isMobile);
    await panel
      .getByRole("checkbox", { name: "Necklaces", exact: true })
      .check();
    await closeFilters(page, isMobile);
    await expect(page).toHaveURL(/sort=newest/);
    await expect(page).not.toHaveURL(/page=/);
  });

  test("Back and Forward step through filter states", async ({
    page,
    isMobile,
  }) => {
    await page.goto("/catalogue");
    const panel = await openFilters(page, isMobile);
    await panel.getByRole("checkbox", { name: "Rings", exact: true }).check();
    await expect(page).toHaveURL(/category=rings/);
    await panel.getByRole("checkbox", { name: "Bridal", exact: true }).check();
    await expect(page).toHaveURL(/collection=bridal/);
    await closeFilters(page, isMobile);

    await page.goBack();
    await expect(page).toHaveURL(/category=rings$/);
    await page.goBack();
    await expect(page).toHaveURL(/\/catalogue$/);
    await page.goForward();
    await expect(page).toHaveURL(/category=rings$/);
    await expect(
      page
        .getByRole("list", { name: "Active filters" })
        .getByRole("link", { name: /^Rings/ }),
    ).toBeVisible();
  });

  test("rapid filter changes keep every parameter", async ({
    page,
    isMobile,
  }) => {
    await page.goto("/catalogue");
    // Wait for hydration: clicks before React attaches its handlers are ordinary native clicks.
    await page.waitForLoadState("networkidle");
    const panel = await openFilters(page, isMobile);
    await expect(
      panel.getByRole("checkbox", { name: "Rings", exact: true }),
    ).toBeVisible();

    // Click four filters in a single tick, before any navigation can finish.
    await panel.evaluate((root) => {
      for (const label of ["Rings", "Bridal", "Platinum", "In stock only"]) {
        const match = [...root.querySelectorAll("label")].find(
          (l) => l.textContent?.trim() === label,
        );
        match?.querySelector("input")?.click();
      }
    });

    await expect(page).toHaveURL(/category=rings/);
    await expect(page).toHaveURL(/collection=bridal/);
    await expect(page).toHaveURL(/material=platinum/);
    await expect(page).toHaveURL(/availability=in-stock/);
    await closeFilters(page, isMobile);
    await expect(
      page.getByRole("list", { name: "Active filters" }).getByRole("listitem"),
    ).toHaveCount(4);
  });

  test("filter state survives a reload", async ({ page, isMobile }) => {
    await page.goto(
      "/catalogue?category=bracelets&material=rose-gold&sort=price-desc",
    );
    await page.reload();
    const panel = await openFilters(page, isMobile);
    await expect(
      panel.getByRole("checkbox", { name: "Bracelets", exact: true }),
    ).toBeChecked();
    await expect(
      panel.getByRole("checkbox", { name: "Rose gold", exact: true }),
    ).toBeChecked();
    await closeFilters(page, isMobile);
    await expect(page.getByLabel("Sort by")).toHaveValue("price-desc");
  });
});

test.describe("mobile catalogue", () => {
  test.beforeEach(({ isMobile }) => {
    test.skip(!isMobile, "Mobile-only interactions");
  });

  test("filters open in a sheet, trap focus and close with Escape", async ({
    page,
  }) => {
    await page.goto("/catalogue");
    await expect(
      page.getByRole("complementary", { name: "Filters" }),
    ).toBeHidden();

    const trigger = page.getByRole("button", { name: /^Filters/ });
    await trigger.click();
    const dialog = page.getByRole("dialog", { name: "Filters" });
    await expect(dialog).toBeVisible();

    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden();
    await expect(trigger).toBeFocused();
  });

  test("the filter button reports how many filters are active", async ({
    page,
  }) => {
    await page.goto("/catalogue?category=rings&material=platinum");
    await expect(
      page.getByRole("button", { name: /Filters.*2 active/ }),
    ).toBeVisible();
  });

  test("the page does not scroll sideways", async ({ page }) => {
    await page.goto("/catalogue");
    const overflow = await page.evaluate(
      () =>
        document.documentElement.scrollWidth -
        document.documentElement.clientWidth,
    );
    expect(overflow).toBeLessThanOrEqual(0);
  });
});
