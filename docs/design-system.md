# Aurelle: Design System

Tokens live in `app/app.css` (`@theme`). Use the tokens, not raw hex.

## Principles

Quiet, editorial, generous whitespace. Let product and type carry the page. Motion is slow, small and optional. Mobile first.

## Colour

| Token            | Hex       | Use                                               |
| ---------------- | --------- | ------------------------------------------------- |
| `ivory`          | `#FAF7F2` | Page background                                   |
| `sand`           | `#E8DFD2` | Panels, skeletons, image grounds, hover fills     |
| `champagne`      | `#B69A73` | Accents, rules, icons, large text, text on dark   |
| `champagne-deep` | `#7A6444` | **Small accent text on ivory** (added; see below) |
| `mocha`          | `#4A3B35` | Secondary text, feature bands, button hover       |
| `onyx`           | `#181715` | Primary text, primary button, footer              |

Semantic roles (shadcn naming): `background`, `foreground`, `muted`, `muted-foreground`, `primary`, `primary-foreground`, `accent`, `border`, `ring`, `destructive`.

**Contrast rules** (verified by `app/lib/design-tokens.test.ts`):

- Raw `champagne` on ivory is ~2.5:1, so it fails for text. Use `champagne-deep` for small accent text on light grounds; `champagne` is for decoration.
- `champagne` on `onyx` passes. On `mocha` it is ~4:1, so use it only for large text (24px+).
- Body text: `onyx` or `mocha` on `ivory`/`sand`.

## Typography

- **Headings:** Cormorant Garamond (serif), weights 400-600, italic for emphasis. Tight tracking (`-0.01em`), balanced wrapping.
- **Body/UI:** Inter 400/500.
- **Eyebrows, nav, buttons:** 12px, uppercase, `0.18em` tracking (hero eyebrow `0.32em`).
- **Wordmark:** serif, uppercase, `0.32em` tracking.

| Role       | Size (mobile → desktop)                     |
| ---------- | ------------------------------------------- |
| Hero h1    | `text-6xl` → `text-8xl`, leading ~1         |
| Section h2 | `text-4xl` → `text-5xl`                     |
| Card h3    | `text-xl`/`text-2xl`                        |
| Body       | 16px (`text-base`), `text-lg` for lead copy |
| Meta       | `text-sm`                                   |

## Spacing and layout

- Container: `max-w-360` (90rem), gutters `px-5` mobile, `px-10` ≥md.
- Section rhythm: `mt-24` mobile, `mt-32` ≥md. Dark bands use `py-20`/`py-28`.
- Grids: product/category 2 columns mobile, 4 ≥lg; gaps `gap-x-4 gap-y-10` (`lg:gap-x-6`).
- Images: portrait `aspect-[4/5]`.
- Corners are square by default; borders are hairline (`border` at 18% mocha).

## Components

- **Button** (`components/ui/button.tsx`): `primary` (onyx), `outline`, `ghost`, `light`; sizes `default` (48px), `sm`, `icon` (44px touch target).
- **Sheet** (`components/ui/sheet.tsx`): Radix Dialog, slides from the left.
- **StatusMessage:** shared empty / error / not-found block.
- **Product card:** one stretched link (single tab stop), name serif, material muted, price medium.
- Add further shadcn components with the CLI (`components.json` is configured), then restyle to these tokens.

## Interaction and motion

- Durations: 300ms colour/hover, 700ms image scale, 800ms hero reveal. Easing `--ease-luxe` (`cubic-bezier(.22,1,.36,1)`).
- Hover: colour shifts and subtle scale (≤105%). No bouncing, parallax or autoplay.
- Motion library only for entrance sequences; `MotionConfig reducedMotion="user"` at the root. CSS animations honour a global `prefers-reduced-motion` override.
- Loading: skeletons match final layout; route transitions show a thin champagne bar and a polite live-region message.

## Accessibility

- Visible focus: 2px `ring` outline, 3px offset, on every interactive element.
- Touch targets ≥44px.
- Landmarks: skip link, `header`, labelled `nav`s, `main#main`, `footer`.
- Icon-only controls carry `sr-only` labels; decorative SVGs are `aria-hidden`.
- Modal menu: focus trap, Escape, focus return (Radix).
- Don't convey meaning with colour alone.

## Imagery

Product photography: soft natural light, neutral sand/ivory grounds, 4:5 portrait, one subject per frame. Until delivered, `ProductImage` renders line-art placeholders (marked `TEMPORARY`).
