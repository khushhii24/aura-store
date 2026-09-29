# AURA — design system

Every value lives in `src/styles/index.css` as Tailwind v4 `@theme` tokens.
There is no JS theme object and no second source of truth. If a value is not
in that file, it should not be in a component.

`npm run check:contrast` reads the tokens straight out of that stylesheet and
measures every colour pair the UI actually uses. Add a pair to
`scripts/check-contrast.mjs` whenever a new combination appears — do not
eyeball it.

---

## 1. The four rules

Most of what makes this site look expensive comes from restraint.

1. **One accent, on about one per cent of the pixels.** Citron appears on the
   wishlist fill, the bag count, the "New" badge, the active construction
   layer and the invert-button hover. Nowhere else. A second accent would
   halve the value of the first.
2. **The product is lit; the backdrop is not.** Every shoe sits on a bed that
   is darker than the page. A bone product on a bone ground disappears, and
   the fix is to shadow the ground rather than to brighten the product.
3. **Type carries the brand, not decoration.** There are no gradients, no
   glows, no shadows on any surface. The only shadow in the whole system is
   the contact shadow under a shoe.
4. **One entrance curve and one spring.** Inconsistent entrance timing is the
   loudest "assembled from templates" tell there is.

---

## 2. Colour

Warm neutrals throughout. Nothing in the palette is a pure grey — the whole
range is pulled toward yellow, which is what separates it from a default
greyscale UI.

### Page surfaces

| Token | Value | Role |
| --- | --- | --- |
| `--color-canvas` | `#f7f5f1` | The page |
| `--color-stone` | `#efebe4` | Alternating bands |
| `--color-stone-deep` | `#e4ded4` | Wells |
| `--color-surface` | `#fffdfa` | Cards, drawers, modals |
| `--color-ink` | `#1c1b18` | Buttons, display type |
| `--color-ink-deep` | `#0e0d0b` | The one dark editorial band |
| `--color-ink-raised` | `#22201c` | Raised panel inside a dark band |

### Product beds

The surface a product is "photographed" on. Deliberately deeper than the page.

| Token | Value | Role |
| --- | --- | --- |
| `--color-bed-top` | `#ebe5d8` | The lit top of the bed |
| `--color-bed-mid` | `#ded7c6` | Mid falloff |
| `--color-bed-deep` | `#cdc4ae` | The shadowed edge |
| `--color-bed-dark-top` | `#262218` | Lit top of a dark bed |
| `--color-on-bed` | `#4c4840` | Captions laid over a bed |

### Lines

| Token | Value | Role |
| --- | --- | --- |
| `--color-line` | `#e0dacf` | Decorative hairline |
| `--color-line-strong` | `#c7bfb1` | Emphasised rule |
| `--color-control` | `#867f73` | **Interactive** borders — fields, pills, chips |
| `--color-line-dark` | `#2e2b26` | Hairline inside a dark band |

`--color-control` exists because WCAG 1.4.11 wants 3:1 on a boundary that
identifies a component, and `line-strong` measures 1.67:1. Splitting the two
keeps decorative rules delicate without making an input border invisible.

### Text — measured, not guessed

| Token | Value | On canvas | Role |
| --- | --- | --- | --- |
| `--color-primary` | `#1c1b18` | 15.8:1 | Headings |
| `--color-secondary` | `#55514a` | 7.2:1 | Body copy |
| `--color-muted` | `#666258` | 5.6:1 | Labels, meta |
| `--color-on-dark` | `#f4f1eb` | 17.2:1 on ink-deep | Headings on dark |
| `--color-on-dark-secondary` | `#b3ada2` | 8.7:1 | Copy on dark |
| `--color-on-dark-muted` | `#938d83` | 5.9:1 | Labels on dark |

`muted` is the floor of the system and is contrast-pinned rather than
design-picked: it has to clear 4.5:1 on canvas, stone, surface **and** the
deep stone well, and the deep well is what sets its value.

### The accent

| Token | Value | Role |
| --- | --- | --- |
| `--color-signal` | `#c9d64b` | Fills and marks. **Never text on a light ground** (1.6:1). |
| `--color-signal-ink` | `#545c06` | The readable cut, 6.6:1 on canvas |
| `--color-signal-wash` | `#eef2cd` | Tint fills |

---

## 3. Typography

Two families, one job each.

**Fraunces Variable** — display only, at optical size 120–144, weight 300–400,
tracking −0.03em to −0.042em, leading 0.85–1.02. A high-contrast serif set
very large and very tight is what makes the page read as editorial rather
than as a storefront template.

**Schibsted Grotesk Variable** — everything functional: navigation, product
names, prices, labels, buttons, forms.

| Class | Size | Use |
| --- | --- | --- |
| `.t-display` | clamp(3.25rem, 12vw, 10.5rem) | The hero, once per site |
| `.t-h1` | clamp(2.5rem, 6.2vw, 5rem) | Section openers |
| `.t-h2` | clamp(1.875rem, 4.4vw, 3.25rem) | Sub-sections |
| `.t-h3` | clamp(1.25rem, 2.2vw, 1.75rem) | Card and panel titles |
| `.t-lede` | clamp(1.0625rem, 1.4vw, 1.25rem) | Standfirst |
| `.t-body` | 1rem / 1.65 | Copy |
| `.t-small` | 0.875rem | Meta, captions |
| `.t-label` | 0.6875rem, 0.16em, caps | The connective tissue of the system |
| `.t-nav` | 0.75rem, 0.14em, caps | Navigation and buttons |
| `.t-product` / `.t-price` | 0.9375rem | Product names and prices, tabular |

`.t-wordmark` sets AURA at 0.34em tracking with a matching `text-indent`, so
the trailing letter-space is optically cancelled and the mark centres
correctly against anything.

---

## 4. Space and layout

- `.container-aura` — max 96rem, gutters 1.25rem / 2.5rem / 4rem.
- `.section-y` — `clamp(4.5rem, 9vw, 9rem)`; `.section-y-tight` — `clamp(3rem, 6vw, 5.5rem)`.
- Product tiles are square in the catalogue; the editorial grid mixes 16/11
  and 4/5 across a 12-column bed with a 5rem vertical offset on alternating
  cells.

Breakpoints in use: `sm` 640, `md` 768, `lg` 1024, `xl` 1280. The layout
switch that matters is **`lg`**, not `md`: the pinned hero, the desktop
navigation, the filter rail and the side-drawer bag all turn on together at
1024, because at 768 there is not enough width for any of them.

---

## 5. Controls

| Class | Height | Notes |
| --- | --- | --- |
| `.btn-lg` / `.btn-md` / `.btn-sm` | 3.5 / 3 / 2.25rem | Caps, 0.14em tracking |
| `.btn-solid` | — | Ink fill. One per view. |
| `.btn-outline` / `.btn-quiet` | — | Hairline; outline inverts on hover |
| `.btn-invert` / `.btn-invert-outline` | — | For dark bands; invert hovers to signal |
| `.field` | 3.25rem | `--color-control` border |
| `.pill` | 2.75rem | Size selection; disabled draws a strike-through |
| `.chip` | 2.25rem | Filters; `aria-pressed` drives the active fill |
| `.badge` | 1.375rem | `signal` for New, `ink` for everything else |

No control has a radius above 2px except the swatch dots and the bag count.
Square corners are doing real work here — they are most of what separates
this from a default component library.

---

## 6. Motion

One curve family, four durations, one spring. All of it in `src/lib/motion.ts`.

```
EASE            cubic-bezier(0.16, 1, 0.3, 1)
EASE_EDITORIAL  cubic-bezier(0.22, 1, 0.36, 1)   // mask-line reveals only

micro   160ms   hover, colour, border
ui      280ms   overlays, accordions, chips
reveal  520ms   scroll entrances
image   700ms   product crossfades and colourway repaints

DRAWER_SPRING   stiffness 380, damping 40, mass 0.9
```

- `<Reveal>` is the only scroll entrance: 26px of travel plus a fade.
- `<MaskLine>` is reserved for the two or three biggest headlines.
- Drawers spring; modals and overlays ease.

**Reduced motion** collapses every entrance to opacity, swaps the drawer
spring for a fade, drops gallery scaling, stops the construction pin from
running at all (the exploded view renders already separated), and removes
smooth scrolling. Every state stays reachable; nothing slides.

---

## 7. Photography

One grade across every photograph, in `.photo-grade`:

```css
filter: saturate(0.72) sepia(0.1) contrast(1.04);
```

Ten photographers' images pull in ten directions otherwise. A shared
desaturation and warm tint puts them on the same palette as the rest of the
site, which is most of why they read as one brand's picture library.

Every image goes through `<Photo>`, which also reserves space from the
intrinsic dimensions so nothing shifts as photographs arrive.

**Text never sits on a photograph.** Captions go underneath. This is a
measured rule, not a taste one: light text over the street photography
measured 3.1:1 even through a 70% scrim, and the only scrim heavy enough to
fix it ruins the picture. Where a photograph sits *behind* an interface — the
construction band — its opacity is capped by measuring the composite against
the image's brightest pixels, not by eye. That is why the backdrop there is
at 14% and not 22%.

## 8. Product imagery

Products are photographed. Six models, nine images, bundled locally as WebP.
Only AURA ONE has multiple angles, so the colour control reports the colourway
rather than offering a choice the imagery cannot honour.

The construction section is photographed too: four macros, one per layer.

The generated geometry in `src/components/visuals/shoeGeometry.ts` did the
product rendering first, then the construction diagram, and now has one job
left — the 3D view. It builds every shoe from one lasting line and a
thickness curve, normalised against real lateral proportions:

```
collar top      0.355 L above ground
sole at heel    0.120 L     sole at forefoot  0.085 L
toe box         0.100 L     throat            0.235 L
```

Four numbers separate the models: `stack`, `collar`, `overlay` and `lacing`.

### The 3D view

`shoeMesh.ts` lofts a solid from those same numbers, so the 3D model of each
product matches that product rather than being one shoe recoloured. Bands of
the loft become the outsole, midsole and upper; the collar opening is cut into
the section rather than laid on the surface, and the lining rides in vertex
colour so the upper stays a single mesh.

Two constants are viewing decisions rather than anatomy, and are marked as
such in the source: how deep the footbed sits, and the camera's elevation.
Taken to their literal values the opening disappears behind the near rim at
any sane product angle, and the opening is the cue that separates a shoe from
a clog.

Every part colour comes from the selected colourway, so choosing a swatch
repaints the product rather than swapping an image. Contour lines are derived
per colourway in `src/lib/color.ts` (dark edge on a pale shoe, light edge on a
dark one) rather than stored, so adding a colourway stays a four-line change.
