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

Each resolves at `https://images.unsplash.com/<id>`.

### Product photography

| File | Unsplash photo ID | Used for |
| --- | --- | --- |
| `one-1…one-4.webp` | `photo-1603808033192-082d6919d3e1`, `-1603808033596-5d1fa1629eae`, `-1603808033176-9d134e6f2c74`, `-1603808033587-935942847de4` | AURA ONE |
| `run.webp` | `photo-1562183241-b937e95585b6` | AURA RUN |
| `form.webp` | `photo-1625860191460-10a66c7384fb` | AURA FORM |
| `shift.webp` | `photo-1606846859455-1af0b84947f3` | AURA SHIFT |
| `glide.webp` | `photo-1560769629-975ec94e6a86` | AURA GLIDE |
| `low.webp` | `photo-1608384177866-0bca0d225435` | AURA LOW |
| `step.webp` | `photo-1631087606988-a6be38fccaf6` | AURA STEP |

**Every one was checked by eye at full resolution for third-party branding.**
The stock alt text is not reliable for this: one image labelled "a pair of
white shoes" is a pair of Nike Air Force 1s. Two strong candidates were cut
late for exactly this reason — one had "Saint Laurent Paris" printed on the
tongue, another a monogram across the heel counter.

Known residual: the AURA ONE shoe carries a small debossed maker's mark on
the outsole, tonal and illegible at any size the site displays it. Nothing
appears on any upper.

This is also why the catalogue is seven models rather than eight. There was
no eighth unbranded shoe available, and an eighth product with a Nike photo
under it would have been worse than one fewer product. AURA TRAIL was cut.

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
