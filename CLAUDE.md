# Aurelle

Luxury jewellery storefront. One React Router (framework mode, SSR) app. Docs: `docs/product-requirements.md`, `docs/architecture.md`, `docs/design-system.md`.

## Commands

- `npm run dev`: dev server
- `npm run typecheck`: typegen + `tsc`
- `npm run lint` / `npm run format`
- `npm test`: Vitest (unit + component); `npm run test:e2e`: Playwright against the production build
- `npm run build`; `npm run check`: all of the above except e2e
- `npm run db:generate` / `db:migrate`: Drizzle (needs `DATABASE_URL`, see `.env.example`)

## Conventions

- Strict TypeScript. No `any` (lint error). Use `import type` / inline `type` imports.
- `~/` aliases `app/`.
- Features live in `app/features/<name>/`: `index.ts` is the public, client-safe API; server logic in `*.server.ts`; Zod in `*.schema.ts`. Never import another feature's `components/` directly (lint-enforced).
- Routes are thin: loader/action + composition. Business logic goes in feature `.server.ts` files. Never duplicate it in components.
- Reads via loaders, writes via actions with `<Form>`. Search/sort/filter state lives in the URL. No global state library.
- Validate all untrusted input (params, query, form data) with Zod at the route boundary.
- Money is integer cents; format with `formatPrice`.
- Style with Tailwind tokens from `app/app.css`; never raw hex. Use `champagne-deep` (not `champagne`) for small text on ivory.
- Avoid `useEffect` unless syncing with an external system. Prefer derived values and loaders.
- Animations via Motion must respect reduced motion (root `MotionConfig` handles it). Prefer CSS for simple transitions.
- Error boundaries replace their own route: storefront errors are caught on `routes/storefront-boundary.tsx`, below the layout, so the shell stays visible.
- Placeholder content is marked `TEMPORARY` (seed data, placeholder images, promise copy). Remove when replaced.
- Tests sit next to code (`*.test.ts[x]`); query by role/label. Never claim tests pass without running them.
- Never commit secrets. `.env` is git-ignored; document variables in `.env.example`.

## Pinned for a reason

- ESLint 9: `eslint-plugin-jsx-a11y` doesn't support 10 yet.
- TypeScript 5.9: typescript-eslint support for 7 not settled.
