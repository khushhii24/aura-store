# AURA — premium footwear e-commerce experience

A front-end storefront concept for a fictional performance-lifestyle footwear
brand. Eight products, a working catalogue with filtering and sorting, a full
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
React Router 7 · lucide-react

No UI kit, no component library, no CSS framework beyond Tailwind's engine.
Every control in `src/components/primitives` is written for this project.

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
  components/
    chrome/        Navbar, MobileMenu, SearchOverlay, BagDrawer, Footer
    primitives/    Button, Overlay (Drawer + Modal), Accordion, Reveal, Bits
    product/       ProductCard, ProductGrid, ProductFilters, ProductGallery,
                   ProductInfo, SizeGuide, WishlistButton
    sections/      Hero, FeaturedProduct, Collection, ProductStory,
                   Technology, BrandStory, SocialProof, FinalCTA
    visuals/       shoeGeometry, ShoeVisual, ExplodedShoe, ShoeScene, Wordmark
  data/            products, colorways, reviews, catalog, content, types
  lib/             cn, color, format, hooks, motion
  pages/           Home, Shop, ProductDetail, About, Wishlist, Checkout, NotFound
  store/           shop.tsx — bag, wishlist, recently viewed, overlay state
  styles/          index.css — every design token
```

Nothing in `data/` imports from `components/`. The UI depends on the data,
never the reverse, so swapping the arrays for a commerce API is a change in
one folder.

---

## Product imagery

Every shoe on the site is generated from
`src/components/visuals/shoeGeometry.ts` rather than photographed. One lasting
line and one thickness curve produce all eight models; four parameters
(`stack`, `collar`, `overlay`, `lacing`) separate a flat court shoe from a
40mm-stack road runner.

This is the reason selecting a colourway repaints the product in real time,
the reason the construction section can take the shoe apart into four layers,
and the reason the catalogue looks like it came out of one studio.

See `DESIGN-SYSTEM.md` for the proportions and the rest of the tokens.

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
- Contrast is measured, not assumed — `npm run check:contrast` covers 39
  pairs including borders (3:1) and text (4.5:1).
- `prefers-reduced-motion` removes all travel, the pinned scroll sequence and
  smooth scrolling while keeping every state reachable.
- Verified at 390 / 768 / 1024 / 1280 / 1440 with no horizontal overflow.

---

## Deploy

Static SPA. Build with `npm run build`, serve `dist/`.

`vercel.json` rewrites all paths to `index.html` so deep links such as
`/product/aura-one` resolve on refresh. Any static host works with the
equivalent rewrite.
