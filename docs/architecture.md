# Aurelle: Architecture

One full-stack React Router (framework mode, SSR) application. No separate API service.

## Stack

React 19 · TypeScript (strict) · React Router 8 · Tailwind CSS v4 · shadcn/ui-style primitives on Radix · Motion · PostgreSQL + Drizzle ORM · Zod · Vitest + React Testing Library · Playwright.

## Layout

```
app/
  routes.ts            route table (layouts nest: shell > error boundary > pages)
  routes/              thin route modules: loader/action + compose feature components
  features/<name>/     one folder per business capability
    index.ts           PUBLIC client-safe API (components, types)
    *.server.ts        server-only logic and data access
    *.schema.ts        Zod schemas and inferred types
    components/        feature UI (private; import via index.ts)
  components/          shared, feature-agnostic UI (ui/ holds shadcn-style primitives)
  db/                  Drizzle schema + lazy client (db.server.ts)
  lib/                 pure helpers (cn, formatPrice)
e2e/                   Playwright specs
docs/                  PRD, architecture, design system
```

### Current features

| Feature            | Responsibility                                                        |
| ------------------ | --------------------------------------------------------------------- |
| `catalogue`        | Product type, categories taxonomy, product card/image, server reads   |
| `storefront-shell` | Layout, header, mobile menu, footer, navigation, route-transition cue |
| `home`             | Homepage sections                                                     |

Planned: `cart`, `checkout`, `orders`, `wishlist`.

## Boundaries (enforced where practical)

- **Server-only code** lives in `*.server.ts`; React Router refuses to bundle it for the client.
- **Features expose `index.ts`.** ESLint forbids importing `~/features/*/components/*` from outside; use the index or a `*.server.ts` file.
- **Dependency direction:** `routes` → `features` → `components`/`lib`/`db`. Features may import another feature's public index (e.g. shell reads catalogue categories) but never its internals. Shared UI never imports features.
- **Routes stay thin.** Business rules (pricing, totals, stock) live in feature `.server.ts` files, not in routes or components.

## Data flow

```
Request → route loader (server) → feature .server.ts → seed data now / Drizzle later
        → loader data → component render (SSR) → hydrate
Mutation → <Form> → route action → Zod parse → feature .server.ts → redirect
```

- **Reads** use loaders; **writes** use actions with plain `<Form>`s, so they work without JS.
- **URL is the state** for search, sort, filter and pagination. No global state library.
- **Untrusted input** (query params, form data, cookies) is parsed with Zod at the route boundary.
- **Money** is integer cents everywhere; formatted only at display.
- **Streaming:** the homepage loader returns the products promise un-awaited; `<Suspense>` + `<Await>` show a skeleton, with an in-place error fallback.

## Key tradeoffs

| Decision                                     | Why                                                                              | Cost / revisit when                                                            |
| -------------------------------------------- | -------------------------------------------------------------------------------- | ------------------------------------------------------------------------------ |
| Seed data behind a `.server.ts` function     | Ships UI now; swapping to Drizzle changes one file                               | Delete `seed-data.server.ts` in the catalogue slice                            |
| Drizzle schema present but unused            | Fixes the data model early; `db:generate` ready                                  | Schema duplicates the Zod shape; consider `drizzle-zod` once more tables exist |
| Error boundary on a nested pathless route    | A boundary replaces its own route; nesting keeps header/footer visible on errors | One extra route file                                                           |
| ESLint 9 (not 10)                            | `eslint-plugin-jsx-a11y` does not yet support 10; a11y linting is a requirement  | Upgrade when the plugin does                                                   |
| TypeScript 5.9 (not 7)                       | 7 is a native rewrite; typescript-eslint support is not settled                  | Revisit after tooling catches up                                               |
| Google Fonts via `<link>`                    | Matches scaffold, zero setup                                                     | Self-host (`@fontsource`) for privacy and fewer origins                        |
| Motion for hero reveal only                  | Restrained by design; CSS handles hover/transition                               | Add per-need, never decoratively                                               |
| Placeholder links (`/catalogue`, `/cart`, …) | Navigation is final; targets return the styled 404 until their slice lands       | Resolved by the next slice                                                     |
| Vitest config separate from `vite.config.ts` | React Router's Vite plugin is not wanted in unit tests                           | None                                                                           |

## Testing strategy

- **Unit:** pure logic, Zod schemas, server functions (`*.test.ts`).
- **Component:** React Testing Library for behaviour and accessibility roles (`*.test.tsx`).
- **E2E:** Playwright against the production build, desktop and mobile projects (`e2e/`).
- Prefer role/label queries over test ids.
