# Aurelle

A premium fine-jewellery storefront. _Discover Luxury. Experience Elegance._

Built as one full-stack **React Router** application (framework mode, SSR) with TypeScript (strict), Tailwind CSS v4, PostgreSQL + Drizzle ORM and Zod. The brand and catalogue are fictional.

## Status

| Phase | Scope                                                                       | State       |
| ----- | --------------------------------------------------------------------------- | ----------- |
| 1     | Storefront shell, homepage, tooling                                         | Done        |
| 2     | Database-backed catalogue (filters, sorting, pagination) and product detail | Done        |
| 3     | Cart, guest checkout, order confirmation, wishlist                          | Not started |

## Quick start

```bash
npm install
npm run dev          # http://localhost:5173
```

With no `DATABASE_URL`, the app runs on an **in-memory demo database**: real PostgreSQL (PGlite, compiled to WASM) with the real migrations applied and the 30-product catalogue seeded on first request. Data resets on restart. That is enough to explore and test everything built so far.

### Using a real PostgreSQL

```bash
cp .env.example .env          # set DATABASE_URL
npm run db:setup              # apply migrations, then seed (idempotent)
npm run dev
```

| Variable          | Purpose                                                                                                                                                          |
| ----------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `DATABASE_URL`    | PostgreSQL connection string. When set it always wins.                                                                                                           |
| `AURELLE_DEMO_DB` | Set to `1` to allow the in-memory database in a production build. Unset, a production build without `DATABASE_URL` refuses to start. Used by the Playwright run. |

## Scripts

| Command                                       | What it does                                                                                    |
| --------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| `npm run dev`                                 | Dev server with HMR                                                                             |
| `npm run build` / `npm start`                 | Production build / serve it                                                                     |
| `npm run typecheck`                           | Route typegen + `tsc` (strict)                                                                  |
| `npm run lint`                                | ESLint (type-aware, jsx-a11y, feature-boundary rule)                                            |
| `npm run format` / `format:check`             | Prettier                                                                                        |
| `npm test`                                    | Vitest: unit, component and PGlite integration tests                                            |
| `npm run test:e2e`                            | Playwright on Chromium, Firefox, WebKit, mobile Chrome and Safari, against the production build |
| `npm run check`                               | typecheck, lint, format check, tests, build                                                     |
| `npm run images:process`                      | Convert `incoming-images/` into optimised files in `public/images/products/`                    |
| `npm run db:generate`                         | Generate a SQL migration from `app/db/schema.ts`                                                |
| `npm run db:migrate` / `db:seed` / `db:setup` | Apply migrations / seed the catalogue / both (needs `DATABASE_URL`)                             |

First-time e2e setup: `npx playwright install chromium firefox webkit`.

## What is built

- **Storefront shell:** responsive header, accessible mobile menu, footer, skip link, route-transition indicator.
- **Homepage:** hero, category grid, signature pieces (streamed behind a skeleton), brand story.
- **Catalogue** (`/catalogue`): server-side filtering by category, collection, material, availability and price; four sort orders; 12 per page. All state lives in the URL, so it survives refresh, Back/Forward and sharing. Active filters are removable chips with a single "Reset filters". Filters are a sidebar on desktop and a drawer on mobile.
- **Product detail** (`/products/:slug`): gallery with keyboard navigation and an accessible zoom dialog, variant selection (metal and size) driven by real variant rows with per-variant price and stock, specifications, delivery and returns, related products, breadcrumbs.
- **States:** skeletons, empty states, in-shell error and 404 pages (with real HTTP statuses).

Not built yet: cart, checkout, accounts, wishlist, search. There is deliberately no "Add to bag" control until the cart exists.

## Project layout

See [docs/architecture.md](docs/architecture.md) for boundaries, data flow and tradeoffs.

```
app/
  routes/              thin route modules (loaders, composition)
  features/
    catalogue/         taxonomy, URL query parsing, server queries, cards, filters
    product-detail/    gallery, variant selector, product information
    home/              homepage sections
    storefront-shell/  layout, header, mobile menu, footer
  components/          shared UI (shadcn-style primitives in ui/)
  db/                  Drizzle schema, DB client, seed
  lib/                 pure helpers
drizzle/               generated SQL migrations (committed)
e2e/                   Playwright specs
docs/                  requirements, architecture, design system
```

## Product images

Product photography is AI-generated (prompts in [docs/image-prompts.md](docs/image-prompts.md)); the fictional catalogue and brand are not real. Originals live in `incoming-images/<slug>/<1-3>.png` (git-ignored); `npm run images:process` converts them to AVIF (400, 800, 1200 and 1600 px wide) plus one 800 px WebP fallback in `public/images/products/` (about 15 MB for all 30 products), served through `<picture>`. Re-run it with `-- --force` after replacing a source image.

Still `TEMPORARY`: the homepage promises and the delivery and returns copy are invented.

## Further reading

- [docs/product-requirements.md](docs/product-requirements.md)
- [docs/architecture.md](docs/architecture.md)
- [docs/design-system.md](docs/design-system.md)
- [CLAUDE.md](CLAUDE.md): conventions for working in this repository
