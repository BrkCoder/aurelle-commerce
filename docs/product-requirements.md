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

**Status (phase 1):** shell and homepage on seed data only. Everything else below is planned.

## Journeys

1. **Browse:** Homepage → category or "Shop all" → catalogue.
2. **Find:** Catalogue → search, sort, filter (state lives in the URL, so results are shareable and back-button safe) → product.
3. **Decide:** Product detail → view materials, price, add to wishlist or bag.
4. **Buy:** Cart → guest checkout (email, shipping, payment) → order confirmation.
5. **Save:** Any product card → wishlist; wishlist page lists and removes items. Wishlist is stored without an account (assumption: cookie-based; to be decided in its slice).

## Acceptance criteria

### Phase 1: shell and homepage (this phase)

- [x] Header with logo, primary nav, wishlist and bag links; sticky; footer with shop links.
- [x] Mobile menu is a modal dialog: labelled, focus-trapped, closes on Escape and on link click, returns focus to its trigger.
- [x] "Skip to content" link is the first focusable element.
- [x] Homepage: hero, category grid, signature pieces, brand story, service promises.
- [x] Loading: route-transition indicator; signature pieces stream behind a skeleton.
- [x] Empty: signature pieces shows a message and a catalogue link when there are none.
- [x] Error: unknown URLs return a real HTTP 404 inside the shell; other errors render in the shell; root boundary is a last resort.
- [x] Seed data is isolated in one clearly marked file and schema-validated.
- [x] Text/background token pairs meet WCAG AA (enforced by a test).
- [x] Animation respects `prefers-reduced-motion`.

### Later slices (summary)

- **Catalogue:** URL params validated with Zod; invalid values fall back to defaults, never error. Empty results show a clear reset action.
- **Product detail:** unknown slug returns 404. Price shown in a single currency format.
- **Cart:** server-validated quantities; prices always re-read server-side, never trusted from the client.
- **Checkout:** all input validated with Zod on the server; order totals computed server-side; confirmation page shows order number and summary.
- **Wishlist:** add/remove works without JavaScript (form actions) and with optimistic UI when available.

## Assumptions

- Single currency (USD), prices stored as integer cents.
- Product photography is not yet available; line-art placeholders stand in and are marked `TEMPORARY`.
- Brand copy, delivery and returns promises on the homepage are placeholders.
- Brand is fictional; footer says so.

## Non-goals (this phase)

Backend checkout, payments, authentication, AI features, a database connection.
