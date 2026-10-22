# Aurelle: Product Requirements

**Brand:** Aurelle. _Discover Luxury. Experience Elegance._
**Goal:** An elegant, fast, accessible guest-checkout jewellery store that feels like a real luxury brand.

## Scope

| In MVP                                        | Deferred                     |
| --------------------------------------------- | ---------------------------- |
| Homepage, catalogue (search/sort/filter), PDP | User accounts and sign-in    |
| Cart, guest checkout, order confirmation      | AI shopping assistant        |
| Wishlist                                      | Personalised recommendations |
| Responsive shell, error/empty/loading states  | Reviews, gift cards, loyalty |

**Status:** Phase 1 (shell, homepage) and Phase 2 (database-backed catalogue and product detail) are done. Cart, checkout and wishlist (Phase 3) are planned. Search is not scheduled.

## Journeys

1. **Browse:** Homepage → category or "Shop all" → catalogue.
2. **Find:** Catalogue → search, sort, filter (state lives in the URL, so results are shareable and back-button safe) → product.
3. **Decide:** Product detail → view materials, price, add to wishlist or bag.
4. **Buy:** Cart → guest checkout (email, shipping, payment) → order confirmation.
5. **Save:** Any product card → wishlist; wishlist page lists and removes items. Wishlist is stored without an account (assumption: cookie-based; to be decided in its slice).

## Acceptance criteria

### Phase 1: shell and homepage

- [x] Header with logo, primary nav, wishlist and bag links; sticky; footer with shop links.
- [x] Mobile menu is a modal dialog: labelled, focus-trapped, closes on Escape and on link click, returns focus to its trigger.
- [x] "Skip to content" link is the first focusable element.
- [x] Homepage: hero, category grid, signature pieces, brand story, service promises.
- [x] Loading: route-transition indicator; signature pieces stream behind a skeleton.
- [x] Empty: signature pieces shows a message and a catalogue link when there are none.
- [x] Error: unknown URLs return a real HTTP 404 inside the shell; other errors render in the shell; root boundary is a last resort.
- [x] Text/background token pairs meet WCAG AA (enforced by a test).
- [x] Animation respects `prefers-reduced-motion`.

### Phase 2: catalogue and product detail

**Catalogue (`/catalogue`)**

- [x] Products come from PostgreSQL (migrations and an idempotent seed of 30 fictional products across rings, necklaces, bracelets and earrings, in five collections).
- [x] Filters: category, collection, material, availability (in stock), price range. Sorts: Featured, Price low to high, Price high to low, Newest.
- [x] All state is in URL params, validated with Zod; invalid values fall back to defaults and never error. State survives refresh, Back and Forward.
- [x] Filters compose. Variant-level filters (material, stock, price) must hold on the same variant.
- [x] Rapid filter changes never drop a parameter.
- [x] Active filters show as removable chips; one "Reset filters" action clears them (keeping the sort).
- [x] Filtering, sorting and pagination happen in SQL, 12 per page, with a stable order (ties broken by slug).
- [x] A page past the end redirects to the last page; no matches shows an empty state with a reset action.
- [x] Cards show image (second image on hover, desktop), name, price ("From" when variants differ), metals, and badges from real data only (New, Low stock, Sold out).
- [x] Loading shows a skeleton with the grid's footprint; failures show an in-page error with retry.
- [x] Mobile: filters open in a modal drawer with a visible active count; the page never scrolls sideways.

**Product detail (`/products/:slug`)**

- [x] Unknown or malformed slugs return a real 404 inside the shell.
- [x] Gallery: thumbnails, keyboard navigation (arrow keys, Home, End), descriptive alt text, accessible zoom dialog that returns focus to its opener.
- [x] Metal and size selection from real variant rows. Price, stock and SKU follow the selected variant. Selection lives in the URL and survives refresh.
- [x] Sold-out options are shown and labelled, not hidden; "Low stock" shows the real remaining count.
- [x] Specifications, delivery and returns, collection links, breadcrumbs, related products (streamed).
- [x] No Add to Bag control until the cart exists.

**Quality**

- [x] Axe reports no WCAG 2 A/AA violations on home, catalogue (default, filtered, empty), product, sold-out product, 404 and the open dialogs, on five browser projects.
- [x] Lighthouse accessibility 100, best practices 100, SEO 100. Performance 90-91 (catalogue), 89-90 (product), 88 (home), with the real photography in place on a simulated slow-4G mobile profile.

### Later slices (summary)

- **Cart:** server-validated quantities; prices always re-read server-side, never trusted from the client.
- **Checkout:** all input validated with Zod on the server; order totals computed server-side; confirmation page shows order number and summary.
- **Wishlist:** add/remove works without JavaScript (form actions) and with optimistic UI when available.

## Assumptions

- Single currency (USD), prices stored as integer cents with an explicit currency column.
- Product photography is AI-generated, one set of three views per product, shot in the first listed metal (other metals are variants without their own photos).
- Brand copy, delivery and returns promises are placeholders.
- Brand and catalogue are fictional; the footer says so.
- "New" means created within the last 60 days; "Low stock" means 3 or fewer units in total.
- Search is not part of Phase 2.

## Non-goals (through Phase 2)

Cart, checkout, payments, authentication, AI features, personalised recommendations.
