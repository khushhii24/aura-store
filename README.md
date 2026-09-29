# AURA — premium footwear e-commerce experience

A front-end storefront concept for a fictional performance-lifestyle footwear
brand. Seven products, a working catalogue with filtering and sorting, a full
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

The site mixes two media, deliberately.

**Photography** carries the materials and the atmosphere: knit, canvas,
leather and grain macros on the materials page, and street scenes in the
brand section. All from Unsplash under the Unsplash License, re-encoded as
WebP and bundled into `src/assets/photography/` rather than hot-linked. See
`CREDITS.md`.

**The products are drawn**, from
`src/components/visuals/shoeGeometry.ts`. One lasting line and one thickness
curve produce all eight models; sole architecture, toe shape, toe spring and
outsole construction separate a vulcanised court shoe from a 40mm-stack road
runner.

That split is not a stylistic preference. Every commercially licensed studio
photograph of a sneaker available is an identifiable Nike, Adidas, Jordan or
Vans — the stock alt text often hides it, and one labelled "a pair of white
shoes" turned out to be Air Force 1s. Putting one of those under
"AURA ONE — $180" would present another company's product as this brand's.
Textures and street scenes carry no such claim.

Drawing the products also buys three things a photograph cannot: colourways
repaint the shoe live, the construction section takes it apart into four
layers, and eight models share a family resemblance.

See `DESIGN-SYSTEM.md` for the proportions, the photo grade and the rest of
the tokens.

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
  token pairs including borders (3:1) and text (4.5:1). Text over photography
  is measured separately against the image's own brightest pixels, which is
  how the construction band's backdrop ended up capped at 14% opacity.
- `prefers-reduced-motion` removes all travel, the pinned scroll sequence and
  smooth scrolling while keeping every state reachable.
- Verified at 390 / 768 / 1024 / 1280 / 1440 with no horizontal overflow.

---

## Deploy

Static SPA. Build with `npm run build`, serve `dist/`.

`vercel.json` rewrites all paths to `index.html` so deep links such as
`/product/aura-one` resolve on refresh. Any static host works with the
equivalent rewrite.
