# AURA — premium footwear e-commerce experience

[![verify](https://github.com/khushhii24/aura-store/actions/workflows/ci.yml/badge.svg)](https://github.com/khushhii24/aura-store/actions/workflows/ci.yml)

**Live:** https://khushhii24.github.io/aura-store/

A front-end storefront concept for a fictional performance-lifestyle footwear
brand. Six products, a working catalogue with filtering and sorting, a full
product page, search, wishlist, a shopping bag and a prototype checkout —
all running on mock data and React state, with no backend.

**AURA is not a real company.** Products, prices, reviews and press mentions
are invented for this project. No orders are taken and no payments are
processed.

---

## Run it

```bash
npm install
npm run dev        # http://localhost:5173
```

| Script | What it does |
| --- | --- |
| `npm run dev` | Vite dev server |
| `npm run build` | Type-check then build to `dist/` |
| `npm run preview` | Serve the production build |
| `npm run typecheck` | TypeScript, no emit |
| `npm run check:contrast` | Measure every colour pair the UI uses against WCAG |
| `npm run verify` | typecheck → contrast → build |

---

## Stack

React 19 · TypeScript (strict) · Vite 8 · Tailwind v4 · Motion v13 ·
React Router 7 · lucide-react · three

No UI kit, no component library, no CSS framework beyond Tailwind's engine.
Every control in `src/components/primitives` is written for this project.

`three` is the one dependency added for a single feature, the 3D product view.
It is code-split behind the "View in 3D" toggle, so the 139 kB gzipped engine
never touches the main bundle (101 kB gzipped) unless someone asks for it.

---

## Routes

| Route | |
| --- | --- |
| `/` | Home — hero, flagship, range, product story, construction, brand, reviews |
| `/shop` | Catalogue with filters and sorting; `?audience=`, `?category=`, `?sort=` |
| `/product/:slug` | Product detail — gallery, colourways, sizes, size guide, bag |
| `/about` | Brand story, technology, materials, shipping, returns |
| `/wishlist` | Saved products |
| `/checkout` | Prototype checkout |

Search, the bag, the size guide and the mobile menu are overlays available
from anywhere.

---

## Project shape

```
src/
  assets/
    photography/   bundled WebP, see CREDITS.md
  components/
    chrome/        Navbar, MobileMenu, SearchOverlay, BagDrawer, Footer
    primitives/    Button, Overlay (Drawer + Modal), Accordion, Reveal, Bits
    product/       ProductCard, ProductGrid, ProductFilters, ProductGallery,
                   ProductInfo, SizeGuide, WishlistButton
    sections/      Hero, FeaturedProduct, Collection, ProductStory,
                   Technology, BrandStory, SocialProof, FinalCTA
    visuals/       shoeGeometry, shoeShading, ShoeVisual, ExplodedShoe,
                   ShoeScene, Photo, Wordmark
  data/            products, colorways, reviews, catalog, content,
                   photography, types
  lib/             cn, color, format, hooks, motion
  pages/           Home, Shop, ProductDetail, About, Wishlist, Checkout, NotFound
  store/           shop.tsx — bag, wishlist, recently viewed, overlay state
  styles/          index.css — every design token
```

Nothing in `data/` imports from `components/`. The UI depends on the data,
never the reverse, so swapping the arrays for a commerce API is a change in
one folder.

---

## Imagery

**Four models are photographed, two are rendered.** Fifteen images, bundled locally as WebP in `src/assets/products/` rather than hot-linked. AURA ONE has four
angles from one shoot and carries a thumbnail gallery; the rest have one
frame each.

**FORM and LOW are generated, not photographed.** Both of their photographs
carried a competitor's trademark — adidas three-stripes on one, the Puma cat
on the other — and no clean replacement existed. Their imagery is rendered
from the same parametric geometry as the 3D viewer, by the dev-only
`render.html` entry, which is excluded from the build because `vite build`
only takes `index.html` as an input. Regenerate with `npm run dev` and
`/render.html?slug=aura-form&az=1.05&el=0.42&dist=0.88`.

**The construction section is photographed.** The four layers each carry a
real macro of a shoe rather than a drawing. Three are crops of the flagship's
own shoot; the outsole is a separate photograph, because the flagship's sole
carries a debossed maker's mark that is illegible at gallery size and very
legible in a crop.

**Materials and atmosphere are photographed too** — knit, canvas, leather and
grain macros on the materials page, street scenes in the brand section. See
`src/assets/photography/` and `CREDITS.md`.

**The 3D view is generated, not downloaded.** Every product can be turned in
3D from the PDP. The mesh is lofted at runtime from the same parametric
geometry that draws the construction diagram — the lasting line, the
per-architecture thickness profile, the toe shape and a last-width profile —
so each model gets its own solid: ONE is a wedge, LOW a flat vulcanised
cupsole with a blunt toe, GLIDE a rockered slab on a thicker stack. This is
also why it is generated rather than licensed: every downloadable sneaker
model that was tried carried someone else's trademark, including one with
three stripes moulded into the heel counter. See `src/components/visuals/
shoeMesh.ts`.

Every photograph was checked by eye at full resolution for third-party
branding, because the stock alt text cannot be trusted: one image labelled
"a pair of white shoes" is a pair of Air Force 1s. Two candidates were cut
late for exactly that — "Saint Laurent Paris" on a tongue, a monogram across
a heel counter.

Three things took their shape from what licensed unbranded footwear
photography actually supports, all recorded in `CREDITS.md`: six models
rather than eight, multiple angles for the flagship only, and one colourway
per model (the selector reports the colour rather than offering a choice the
imagery cannot honour).

**The construction section is still generated**, from
`src/components/visuals/shoeGeometry.ts` — it takes the shoe apart into four
layers as you scroll, which no photograph does.

One shared grade (`.photo-grade`) puts images from a dozen photographers onto
the same palette. See `DESIGN-SYSTEM.md`.

---

## Commerce state

`src/store/shop.tsx` holds the bag, the wishlist and recently-viewed, mirrored
into `localStorage` so a refresh does not empty the bag. Totals are arithmetic
over mock data:

```
subtotal   sum of price × quantity
shipping   free over $150, otherwise $8 (express $18, collect free)
tax        8.875% of subtotal, labelled "estimated"
```

Checkout validates and shows a confirmation screen with an order reference.
**No card, billing or identity fields are rendered anywhere in the
prototype** — the payment step is a labelled placeholder on purpose, so there
is nothing to type real details into.

---

## Accessibility

- Semantic landmarks, one `<h1>` per route, no heading-level jumps.
- Skip link to `#main`.
- Every dialog is `role="dialog" aria-modal="true"` with an accessible name,
  traps Tab, closes on Escape, and restores focus to whatever opened it.
- Selection controls use real radio/checkbox semantics or `aria-pressed`;
  sold-out sizes are `disabled` and announced.
- Contrast is measured, not assumed, and enforced — `npm run check:contrast`
  exits non-zero on any failure and runs on every push. It covers 39
  token pairs including borders (3:1) and text (4.5:1). Text over photography
  is measured separately against the image's own brightest pixels, which is
  how the construction band's backdrop ended up capped at 14% opacity.
- `prefers-reduced-motion` removes all travel, the pinned scroll sequence and
  smooth scrolling while keeping every state reachable. The 3D view holds
  still under it — verified by comparing rendered frames 2.5s apart, not by
  reading the code.
- The 3D canvas is `role="img"` with a descriptive label and is **not** in the
  tab order. It was `role="application"` with `tabIndex={0}`, which promises a
  screen reader that keystrokes will be handled when nothing handles them;
  rotation is driven by a real button beside the view instead.
- Wheel-zoom is off, so scrolling past the 3D view scrolls the page rather
  than zooming the model.
- Verified at 390 / 768 / 1024 / 1280 / 1440 with no horizontal overflow.

---

## Deploy

Static SPA — build with `npm run build`, serve `dist/`. Live on GitHub Pages
at https://khushhii24.github.io/aura-store/, deployed by the `deploy` job in
`.github/workflows/ci.yml`. It runs only on a push to `main`, only after
`verify` passes, and ships the artifact that passed rather than rebuilding,
so what goes live is what was checked.

Two things a client-side router needs from a static host, both handled:

- **A base path.** Pages serves a project site from `/aura-store/`, so the
  build is based there while dev stays at `/`. The router takes its basename
  from `import.meta.env.BASE_URL`, so neither is hardcoded. Deploying
  somewhere that serves from the root? Build with `BASE_PATH=/`.
- **A fallback for deep links.** Pages has no rewrite rule; it serves
  `404.html` for anything not on disk. The build writes a copy of the shell
  there, so `/shop` and `/product/aura-one` survive a direct hit or a
  refresh — but they are answered with HTTP 404 and the app in the body. It
  renders correctly; a crawler sees 404 on every route but `/`.

`vercel.json` is the fix for that, and needs no setup beyond importing the
repo: it rewrites every unmatched path to `index.html` with a real 200, and
sets `BASE_PATH=/` at build time so the bundle is based at the root rather
than under `/aura-store/`. Vercel serves static files before applying
rewrites, so hashed assets are unaffected.
