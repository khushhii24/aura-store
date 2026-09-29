# Credits

## Photography

The material and atmosphere photography on this site comes from
[Unsplash](https://unsplash.com), used under the
[Unsplash License](https://unsplash.com/license) — free for commercial use,
no permission or attribution required. Attribution is given here anyway as
good practice.

All images are downloaded, re-encoded as WebP and bundled into the repo
(`src/assets/photography/`) rather than hot-linked, so the site has no
runtime dependency on anyone else's CDN.

| File | Unsplash photo ID |
| --- | --- |
| `knit-bone.webp` | `photo-1643313260651-9c335822ecde` |
| `knit-sand.webp` | `photo-1602706294170-1fed8eecd9f9` |
| `knit-charcoal.webp` | `photo-1636716016297-a7b3f4b5e3e8` |
| `woven-canvas.webp` | `photo-1606203230902-89be7eb9fbe6` |
| `grain-beige.webp` | `photo-1776278515755-5ee2090ad0cb` |
| `leather-tan.webp` | `photo-1778882990603-0073e03bcc24` |
| `leather-black.webp` | `photo-1787243293233-92f3188cde4b` |
| `motion-figures.webp` | `photo-1776483522194-f5e1f90444a5` |
| `street-legs.webp` | `photo-1758539324961-2febd04bc30d` |
| `street-walk.webp` | `photo-1606049925382-6badf6de768e` |

| `construction/outsole.webp` | `ozIjZd7ZZ9s` |

Each of the first group resolves at `https://images.unsplash.com/<id>`.

### Construction photography

The four images in the construction section are photographs of a real shoe.
`construction/upper.webp`, `construction/cushioning.webp` and
`construction/midsole.webp` are crops of the AURA ONE shoot listed below.

`construction/outsole.webp` is a **different** photograph, and deliberately
so. The AURA ONE sole carries a debossed maker's mark reading "theGom(R)".
It is tonal and illegible at the size the gallery shows it, which is why the
gallery keeps it — but a construction crop is a close-up, and at that size it
is perfectly readable. So the outsole layer uses an unrelated, unbranded
tread photograph instead.

Unsplash+ results were excluded throughout: they carry a paid licence rather
than the free Unsplash License, and several strong sole photographs had to be
dropped for that reason alone.

### Product photography

| File | Unsplash photo ID | Used for |
| --- | --- | --- |
| `one-1…one-4.webp` | `photo-1603808033192-082d6919d3e1`, `-1603808033596-5d1fa1629eae`, `-1603808033176-9d134e6f2c74`, `-1603808033587-935942847de4` | AURA ONE |
| `run.webp` | `photo-1562183241-b937e95585b6` | AURA RUN |
| `glide.webp` | `photo-1560769629-975ec94e6a86` | AURA GLIDE |
| `step.webp` | `photo-1631087606988-a6be38fccaf6` | AURA STEP |

**Every one was checked by eye at full resolution for third-party branding.**
The stock alt text is not reliable for this: one image labelled "a pair of
white shoes" is a pair of Nike Air Force 1s. Two strong candidates were cut
late for exactly this reason — one had "Saint Laurent Paris" printed on the
tongue, another a monogram across the heel counter.

### Known residuals, and one open problem

**AURA ONE** carries a small debossed maker's mark on the outsole reading
"theGom(R)". It is tonal and illegible at any size the site displays it. It
is legible in a close crop, which is why the construction section sources its
outsole image elsewhere.

**AURA SHIFT — cut.** A later pass found "mahabis", a real footwear brand,
embossed on the sole of the near shoe, and the photograph turned out to come
from that brand's own Unsplash account. It could not be cropped out without
cutting the soles off both shoes. Seven replacement candidates were checked
and every one failed: ornate dress slippers, a Puma with its formstrip and
"PROFOAM" in frame, an all-black high-top with its own embossed sole mark, a
Vans Sk8-Hi, a second image from the same mahabis account, formal dress
shoes, and a CGI render carrying a logo. So SHIFT was dropped, the way AURA
TRAIL was dropped before it. That is the second model this constraint has
cost, and it is the honest price of not shipping someone else's product
under this brand's name.

### Uploader audit

Every remaining product photograph was traced back to its Unsplash uploader:

| File | Uploader | Brand account? |
| --- | --- | --- |
| `one-1…one-4.webp` | Mojtaba Fahiminia (@fahiminia) | No |
| `run.webp` | Martin Katler (@martinkatler) | No |
| `glide.webp` | Irene Kredenets (@ikredenets) | No |
| `step.webp` | Rauf Alvi (@rauf_alvi2001) | No |
| `construction/outsole.webp` | Jordan Hou | No |

AURA SHIFT's mahabis photograph was the only brand-account upload. On that
measure the rest of the catalogue is clean.

**The uploader check has a blind spot**, and it is the bigger one. A brand
publishing its own catalogue shots is one risk; an independent photographer
shooting branded retail product is the other, and it is far more common.
Re-inspecting each image at high zoom with the tonal range lifted — the step
that catches white-on-white — found two more:

- **AURA FORM** carried the adidas three-stripes, three stitched parallel
  bands across the lateral side. Tonal white-on-white, structurally the
  trademark. The product copy sitting above it read "no logo anywhere you
  can see it from across a room".
- **AURA LOW** carried the Puma leaping cat and wordmark in black on white
  leather. Faint at card size, unmistakable in the bundled asset.

Neither was found by the uploader check. Both were found by looking properly.

**Both photographs are gone.** Rather than cut two more models, FORM and LOW
are now rendered from the same parametric geometry that drives the 3D
viewer, by the dev-only `render.html` entry. No third party's product is
involved, so there is nothing to inspect. It also removed the constraint
that had held the catalogue to one photograph per model: generation is free,
so FORM and LOW carry four angles each, and LOW got the gum outsole its own
copy had always described and its photograph never showed.

**A check that was missing.** The uploader's name on Unsplash is itself a
branding signal — brands publish their own product photography there. SHIFT
was found by eye, late; it would have been caught immediately by reading who
uploaded it. That check now belongs in the sourcing process alongside
inspecting every sole, tongue and heel at full resolution.

**AURA RUN** is a recognisable silhouette — the web-overlay upper is closely
associated with one manufacturer's model. No wordmark or three-stripe mark is
legible in the frame, so this is a likeness judgement rather than a visible
trademark, and it is noted for the same reason.

This is what the earlier claim that every image was checked should have said.
Checking caught the obvious marks and missed a tonal one on a white sole; the
rule that fixed it was to inspect every sole, tongue and heel at full
resolution rather than scanning the image as a whole.

This is why the catalogue is six models rather than eight. AURA TRAIL was
cut because no eighth unbranded shoe was available, and an eighth product
with a Nike photograph under it would have been worse than one fewer
product. AURA SHIFT was cut because the photograph under it turned out to be
a competitor's own.

Only AURA ONE has more than one photograph — four angles from a single
shoot, which is why it carries the flagship gallery. That is the honest
ceiling of what free licensed unbranded footwear photography supports, and
it is why the colour selector reports a colour rather than offering a choice
the imagery cannot honour.

## Type

- **Fraunces** — Undercase, SIL Open Font License 1.1
- **Schibsted Grotesk** — Schibsted, SIL Open Font License 1.1

Both are bundled via [Fontsource](https://fontsource.org) and self-hosted.

## Icons

- **Lucide** — ISC License

## 3D

- **three.js** — MIT License

No 3D model is downloaded, bundled or licensed. The shoe mesh is generated at
runtime from this project's own parametric geometry. That was not the first
approach: a Khronos-hosted glTF sneaker was integrated and then removed, along
with the `@google/model-viewer` dependency and a 7.8 MB asset, because at full
resolution it carried three stripes moulded into the heel counter.
