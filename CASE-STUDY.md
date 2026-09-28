# AURA — Premium Footwear E-commerce Experience

**Role** Design and front-end build
**Type** Concept project
**Stack** React · TypeScript · Vite · Tailwind · Motion

---

## Summary

AURA is a fictional performance-lifestyle footwear brand: shoes built for a
day that does not sort itself neatly into a workout and everything else. This
is its storefront — an eight-product catalogue with working discovery, a full
product page, search, a bag and a prototype checkout, designed and built
front-end first.

The brief was to make a premium consumer brand experience rather than another
SaaS marketing site: large product imagery, editorial typography, real
shopping mechanics.

---

## The design challenge

Three things had to be true at once.

**It had to look like a brand, not a template.** Most DTC storefronts are the
same three-column grid with a different logo. The differentiator had to be
structural, not decorative.

**It had to actually work.** Filters that filter. A gallery that changes. A
bag that survives a refresh. A reviewer who clicks anything should find
something real underneath.

**It could not rely on photography.** A concept brand has no product photos,
and stock sneaker imagery would have made eight models look like eight
different companies.

---

## Design direction

### Gallery, not storefront

One structural idea, committed to: the page behaves like a fashion quarterly
that happens to sell. Huge type, enormous margins, one idea per screen. The
hero puts display type on the left and the product bleeding off the right
edge at a size no product grid would allow.

### Type as the primary element

**Fraunces** — a high-contrast serif with an optical-size axis — is used for
display only, at 300 weight and −0.04em tracking. **Schibsted Grotesk** does
everything functional. Serif display over grotesque UI is the inverse of the
usual arrangement, and it is most of why the page reads as editorial.

### Warm neutrals and one accent

Bone, stone, warm charcoal. Nothing in the palette is a pure grey. Against
that, a single citron accent lands on roughly one per cent of the pixels — a
wishlist fill, a bag count, a "New" badge, the active construction layer.
Used that sparingly it reads as confidence; a second accent would have halved
its value.

Every colour pair is measured rather than eyeballed. `npm run check:contrast`
reads the tokens out of the stylesheet and checks 39 combinations. It caught
three failures during the build, including an input border at 1.67:1 that
looked fine and was not — which is why the system now separates decorative
hairlines from interactive ones.

---

## The product system

**Every shoe on the site is drawn, not photographed.**

One lasting line and one sole-thickness curve generate all eight models,
normalised against real lateral proportions — collar at 0.355 of shoe length
above the ground, heel stack at 0.120, toe box at 0.100. Four parameters
separate the range: stack height, collar height, overlay style and lacing.

That decision paid for itself three times:

- **Colourways repaint the product in real time.** Every part colour — upper,
  overlay, collar, laces, eyelets, midsole, outsole, accent — comes from the
  selected swatch. Choosing a colour changes the shoe you are looking at
  instead of loading another image.
- **The construction section takes the shoe apart.** The same geometry cuts
  into four layers that separate as you scroll. No photograph can do that.
- **The catalogue looks like one studio made it.** Eight models sharing one
  silhouette engine have a family resemblance that eight stock photos never
  would.

Six views — lateral, top, outsole, heel, midfoot, toe — are genuine geometry
or genuine crops, not one picture shown six times. Each product sits on a
graded bed with a contact shadow and a film-grain pass, because a drawn
product on a flat field reads as clip art.

---

## Key UX features

**Discovery.** Category, size, colour and price filters with four sort modes,
applied through pure functions in `data/catalog.ts` so the page stays a view.
A sticky rail on desktop, a full-screen drawer on mobile, removable chips for
everything applied, and an honest empty state. URL parameters (`?category=`,
`?sort=`, `?audience=`) arrive as real, removable filters.

**Product detail.** Six-image gallery with thumbnail navigation and arrow-key
support, live colourway selection, a size grid with sold-out sizes struck
through and disabled, a fit summary derived from the review data, quantity,
and a size guide that leads with how to measure rather than with the table.

**Search.** A full-width overlay that dims the page, with suggested searches,
recently viewed products and live scored results — model name outranks a
colour that happens to match.

**Bag.** A side drawer on desktop, a full-screen sheet on mobile. Quantity
stepping, removal, a free-shipping meter, and a two-second tint on the line
you just added. State persists to `localStorage`.

**Responsive.** The mobile layouts are designed, not stacked. The menu is a
different composition entirely — display-sized links and a browsable product
strip. The hero reorders so type comes first and the product crops in
underneath. The gallery becomes a snap carousel. The layout switch that
matters is 1024, not 768: at tablet width the pinned hero, the desktop nav and
the filter rail all still belong in their phone form.

---

## Implementation

A single design-token file drives everything — Tailwind v4 `@theme` variables
with no second JS theme object. Components are grouped by role (`chrome`,
`primitives`, `product`, `sections`, `visuals`) and nothing in `data/` imports
from `components/`, so the mock catalogue could be swapped for an API in one
folder.

Motion is deliberately constrained: one curve family, four durations, one
spring, all in one file. Reduced motion collapses every entrance to opacity,
turns the pinned construction sequence into a static layout and keeps every
state reachable.

Accessibility was built in rather than audited on: landmarks and heading
order, a skip link, dialogs that trap focus and restore it to their trigger,
real radio and checkbox semantics on selection controls, measured contrast,
and no horizontal overflow at any of five tested widths.

---

## Backend readiness

Commerce is simulated. The bag, wishlist and recently-viewed live in React
state mirrored to `localStorage`; totals are arithmetic over typed mock data.
The data layer is already shaped like an API response, and every filter, sort
and search function is pure and takes its list as an argument — so
substituting a real catalogue is a change of source, not a rewrite.

Checkout validates, submits and shows a confirmation with an order reference.
No card, billing or identity fields are rendered anywhere in the prototype —
the payment step is a labelled placeholder on purpose, so there is nothing to
type real details into.

---

## Portfolio description

**AURA — Premium Footwear E-commerce Experience**

A front-end storefront concept for a performance-lifestyle footwear brand,
designed and built end to end. Editorial art direction — a high-contrast serif
at display scale, warm neutrals and a single restrained accent — over a
complete shopping experience: filterable catalogue, six-view product gallery,
live colourway selection, search overlay, persistent bag and a prototype
checkout.

Every product image is generated from a parametric SVG system rather than
photographed, so selecting a colourway repaints the shoe in real time and the
construction section can separate it into its four layers. React, TypeScript,
Vite, Tailwind and Motion, with measured WCAG contrast, focus-managed dialogs
and mobile layouts designed rather than stacked.
