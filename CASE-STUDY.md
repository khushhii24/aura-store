# AURA — Premium Footwear E-commerce Experience

**Role** Design and front-end build
**Type** Concept project
**Stack** React · TypeScript · Vite · Tailwind · Motion

---

## Summary

AURA is a fictional performance-lifestyle footwear brand: shoes built for a
day that does not sort itself neatly into a workout and everything else. This
is its storefront — a six-product catalogue with working discovery, a full
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

**Photography was a licensing problem, not a sourcing one.** A concept brand
has no product shots of its own, and almost every licensable studio
photograph of a sneaker is somebody else's branded product. The catalogue had
to be built around what passed that filter.

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

Photography needed the same treatment. Where an image sits behind an
interface, I sampled the image's own brightest pixels and computed the
composite rather than judging by eye: the construction band's backdrop
measured 4.15:1 for its smallest label at 22% opacity, so it is capped at
14%. Where text would have sat *on* a photograph, the measurement said 3.1:1
even through a 70% scrim — so the captions moved underneath instead.

---

## Imagery

The products are photographed. Getting there was the most instructive part of
the build, because the obvious approach does not survive contact with the
licensing.

Free stock photography of sneakers is almost entirely **identifiable branded
product** — Nike, Adidas, Jordan, Vans. The alt text actively hides it: one
image captioned "a pair of white shoes" is a pair of Air Force 1s. Putting
one of those under "AURA ONE — $180" presents another company's product as
this brand's. So every candidate was opened at full resolution and checked by
eye; two strong ones were cut late, one with "Saint Laurent Paris" printed on
the tongue and one with a monogram across the heel counter.

What survived that filter shaped the catalogue rather than the other way
round:

- **Six models, not eight.** Two were cut rather than shipped. There was no eighth unbranded shoe, and an
  eighth product with a Nike photo under it is worse than one fewer product.
- **One shoot has four angles**, so AURA ONE carries the thumbnail gallery
  and the rest collapse to a single frame instead of padding out with the
  same picture four times.
- **One colourway per model**, so the selector reports a colour rather than
  offering a choice the imagery cannot honour, and the colour filter is
  trimmed to the families the catalogue actually carries.

Materials and atmosphere are photographed too — knit, canvas, leather and
grain macros against each material claim, street scenes in the brand section
where the headline is "built for the way life actually moves" and another
product shot would have said nothing.

One shared grade — a desaturation and a warm tint — puts images from a dozen
photographers onto one palette, which is most of why a catalogue shot on a
dozen different grounds still reads as one brand.

The **construction section stays generated**, from a parametric geometry
normalised against real lateral proportions. It takes the shoe apart into
four layers as you scroll, which is the one thing a photograph cannot do.

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

### The construction section

"Four layers, one shoe" used to show a generated exploded diagram. It now
shows four photographs of a real shoe, one per layer, cross-fading as the
section scrolls.

Swapping a drawing for a photograph exposed something the drawing had been
hiding: the copy claimed an engineered knit upper while the flagship's
photographs are of a leather and nubuck sneaker. A drawing can be whatever
the copy says; a photograph cannot. The layer copy was rewritten to describe
construction rather than fibre, which is true of the shoe in the picture.

The same pass removed a real registered trademark ("Ortholite(R)") that had
been sitting in the fictional brand's own spec copy — the same class of
problem as the branded imagery, and inconsistent to keep while cutting
photographs for exactly that.

### Generating the 3D product view

The PDP turns each shoe in 3D. There is no downloaded model: the mesh is
lofted at runtime from the same numbers that draw the construction diagram,
so every product gets a solid matching its own sole architecture. That
decision was forced — a licensed glTF sneaker was integrated first and cut
when three stripes turned up moulded into its heel counter at full
resolution.

Four bugs in that loft are worth recording, because each one had an obvious
wrong answer:

1. **The canoe.** The drawing already had a width profile, so the mesh used
   it. Wrong profile: it is a silhouette *offset* for the three-quarter view,
   near zero at heel and toe because that is where the far outline converges
   on the near one. As an absolute half-width it tapers both ends to a point.
   Replaced with an actual last-width profile.
2. **The knife edge.** Doming the section above the lasting line collapses
   the top to 11% width. A toe box is broad and rounds over only at the very
   end, so the section became a superellipse.
3. **The bowtie.** Capping the loft with a triangle fan to the centroid puts
   one shared point in the middle of a ring that runs the whole length of the
   shoe, which rendered as a crease straight down the middle. Sewing each
   point to its mirror closes it as a flat ribbon.
4. **Inside out.** The band winding produced face normals pointing inward, so
   the shoe rendered as a see-through shell. Found by working the cross
   product rather than flipping it and looking: on the lateral side
   `(b-a) x (c-a)` has to come out `+z`.

The collar opening needed a fifth answer. A dark disc laid on the surface
cannot work, because the loft's top surface is always drawn over it. Instead
the cross-section climbs to a rim and then turns inward and *down*, so the
loft closes on a sunken footbed and the opening is genuinely cut into the
solid. Upper and lining share one mesh, separated by vertex colour.

Geometry was verified numerically, not by eye — a probe loads the builder
outside the browser and reports well depth, opening width and cap heights per
product, which is how "the opening exists but the camera is too low to see
it" was told apart from "the opening is not being cut".

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

Photography carries the materials and the atmosphere; the products are
generated from a parametric SVG system, so selecting a colourway repaints the
shoe in real time and the construction section can separate it into its four
layers. React, TypeScript,
Vite, Tailwind and Motion, with measured WCAG contrast, focus-managed dialogs
and mobile layouts designed rather than stacked.
