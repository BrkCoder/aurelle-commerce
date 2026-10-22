# Aurelle

Luxury jewellery storefront. One React Router (framework mode, SSR) app. Docs: `README.md`, `docs/product-requirements.md`, `docs/architecture.md`, `docs/design-system.md`.

## Commands

- `npm run dev`: dev server. With no `DATABASE_URL` it uses an in-memory demo Postgres (PGlite), migrated and seeded on first request.
- `npm run typecheck`: typegen + `tsc`. `npm run lint` / `npm run format`
- `npm test`: Vitest (unit, component, PGlite integration). `npm run test:e2e`: Playwright on 5 browser projects against the production build
- `npm run build`; `npm run check`: typecheck, lint, format check, tests, build (no e2e)
- `npm run db:generate`: new migration after editing `app/db/schema.ts` (commit `drizzle/`). `db:migrate` / `db:seed` / `db:setup` need `DATABASE_URL`

## Conventions

- Strict TypeScript. No `any` (lint error). Use `import type` / inline `type` imports. `~/` aliases `app/`.
- Features live in `app/features/<name>/`: `index.ts` is the public, client-safe API; server logic in `*.server.ts`; pure domain logic in plain `.ts` (unit-tested). Never import another feature's `components/` directly (lint-enforced).
- Routes are thin: loader + composition. Business rules live in features, never duplicated in components.
- Server queries take `db` as a parameter (`Db` from `~/db/db.server`) so they run unchanged on PGlite in tests. Get it with `await getDb()` in loaders.
- **The URL is the state** for filters, sort, page and variant choice. No global state library. Parse URLs with Zod in the feature's `*-query.ts`; invalid values fall back to defaults, never throw.
- Filtering, sorting and pagination happen in SQL. Every ordering must end in a unique column (`slug`) so pages are deterministic.
- Variant-level filters (material, stock, price) apply to the _same_ variant (one `EXISTS`).
- Money is integer cents + a currency code; format with `formatPrice`.
- Migrations are generated, never hand-edited. The seed must stay idempotent (upsert on natural keys).
- Style with Tailwind tokens from `app/app.css`; never raw hex. Use `champagne-deep` (not `champagne`) for small text on ivory.
- Avoid `useEffect`; prefer derived values, loaders and URL state. Use `useSyncExternalStore` for external state.
- Animation is CSS (`animate-fade-up`). Never animate the LCP element. No animation library is installed.
- Fonts are self-hosted (Fontsource). Do not add third-party stylesheets.
- No inert controls: do not add Add to Bag / checkout buttons before the cart exists.
- Placeholder content is marked `TEMPORARY` (placeholder images and route, homepage and policy copy). Remove when replaced.
- Never commit secrets. `.env` is git-ignored; document variables in `.env.example`.

## Gotchas (each cost real debugging time)

- **Rapid clicks:** use `goTo(updater)` from `use-catalogue-query.ts`, never build the next URL from render-time state. React Router's pending location isn't visible until React re-renders.
- **Error boundaries replace their own route.** Storefront errors are caught on `routes/storefront-boundary.tsx`, below the layout, so the shell stays visible. Boundaries need their own `<title>` (route `meta` doesn't run).
- **Radix returns focus only to its own `Trigger`.** For a controlled dialog opened by another button, restore focus in `onCloseAutoFocus`.
- **`sr-only` is `position: absolute`.** Inside a scroll region that isn't `relative`, it escapes the clip and can make an ancestor scrollable (this broke the mobile filter sheet).
- **`<select>` in WebKit** won't shrink below its widest option unless it is `w-full min-w-0`.
- **Route `meta` receives `loaderData`**, not `data` (React Router 8).
- **Scripted string replaces on Prettier-formatted files silently miss.** Use proper edits and verify.

## Testing

- Tests sit next to code (`*.test.ts[x]`); integration tests start with `// @vitest-environment node` and use `test/test-db.ts`. Query by role/label.
- E2E: wait for hydration (`networkidle`) before interacting quickly; wait for dialog animations to finish before running axe (mid-fade colours report false contrast failures). Run Firefox/WebKit axe with limited workers.
- Never claim tests pass without running them.

## Pinned for a reason

- ESLint 9: `eslint-plugin-jsx-a11y` doesn't support 10 yet.
- TypeScript 5.9: typescript-eslint support for 7 not settled.
