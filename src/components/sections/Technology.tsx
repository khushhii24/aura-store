import { useRef, useState } from 'react'
import { AnimatePresence, motion, useMotionValueEvent, useReducedMotion, useScroll } from 'motion/react'
import { cn } from '@/lib/cn'
import { TECH_LAYERS } from '@/data/content'
import { Eyebrow } from '@/components/primitives/Bits'
import { useIsDesktop } from '@/lib/hooks'
import { PHOTOS } from '@/data/photography'
import { Photo } from '@/components/visuals/Photo'
import { DURATION, EASE } from '@/lib/motion'

const clamp = (n: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, n))

/**
 * One photograph per layer, in the order the copy names them.
 *
 * These are photographs of a real shoe rather than the drawing that used to
 * sit here. Three are cut from the flagship's own shoot; the outsole is a
 * separate photograph, because the flagship's sole carries a debossed
 * maker's mark that is illegible at gallery size and very legible in a crop.
 */
const LAYER_PHOTOS = [
  PHOTOS.constructionUpper,
  PHOTOS.constructionCushioning,
  PHOTOS.constructionMidsole,
  PHOTOS.constructionOutsole,
]

/**
 * The pinned list.
 *
 * Only the active layer shows its full copy — an earlier version showed all
 * four at once and had to be clipped to fit the viewport, which hid the
 * fourth layer entirely.
 */
function LayerList({ active, expand }: { active: number | null; expand: boolean }) {
  return (
    <ol>
      {TECH_LAYERS.map((layer, i) => {
        const on = active === i
        return (
          <li
            key={layer.id}
            className={cn(
              'border-t border-[color:var(--color-line-dark)] py-4 transition-opacity duration-[var(--duration-ui)]',
              active !== null && !on ? 'opacity-40' : 'opacity-100',
            )}
          >
            <div className="flex items-baseline gap-5">
              <span
                className={cn(
                  't-label tabular transition-colors duration-[var(--duration-ui)]',
                  on ? 'text-[color:var(--color-signal)]' : 'text-[color:var(--color-on-dark-muted)]',
                )}
              >
                {layer.number}
              </span>
              <div className="min-w-0 flex-1">
                <h3 className="t-h3">{layer.name}</h3>
                <p className="t-label mt-1.5 text-[color:var(--color-on-dark-muted)]">
                  {layer.summary}
                </p>

                {expand ? (
                  <AnimatePresence initial={false}>
                    {on && (
                      <motion.p
                        className="t-body max-w-prose overflow-hidden"
                        initial={{ height: 0, opacity: 0, marginTop: 0 }}
                        animate={{ height: 'auto', opacity: 1, marginTop: 12 }}
                        exit={{ height: 0, opacity: 0, marginTop: 0 }}
                        transition={{ duration: DURATION.ui, ease: EASE }}
                      >
                        {layer.copy}
                      </motion.p>
                    )}
                  </AnimatePresence>
                ) : (
                  <p className="t-body mt-3 max-w-prose">{layer.copy}</p>
                )}
              </div>
            </div>
          </li>
        )
      })}
    </ol>
  )
}

/**
 * Construction, read one layer at a time.
 *
 * The desktop version pins the photograph and cross-fades it as you scroll;
 * the mobile version gives each layer its own photograph in normal document
 * flow, because a pinned scroll-jack on a phone is a worse experience than a
 * good static one.
 */
export function Technology() {
  const ref = useRef<HTMLDivElement>(null)
  const isDesktop = useIsDesktop()
  const reduced = useReducedMotion()
  const [active, setActive] = useState(0)

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end end'],
  })

  useMotionValueEvent(scrollYProgress, 'change', (p) => {
    /* A short lead-in so the section settles before the first layer, then
       one layer per quarter of what is left. */
    setActive(clamp(Math.floor((p - 0.06) / 0.225), 0, 3))
  })

  const staticMode = !isDesktop || reduced
  const photo = LAYER_PHOTOS[active]

  const heading = (
    <>
      <Eyebrow className="text-[color:var(--color-on-dark-muted)]">Construction</Eyebrow>
      <h2 id="tech-heading" className="t-h1 mt-5 max-w-[14ch]">
        Four layers, one shoe.
      </h2>
      <p className="t-lede mt-5 max-w-prose">
        Everything between your foot and the pavement, in the order you meet it.
      </p>
    </>
  )

  return (
    <section
      id="technology"
      className="on-dark relative isolate bg-[color:var(--color-ink-deep)]"
      aria-labelledby="tech-heading"
    >
      {/* A real material under the band, barely there — enough to stop it
          being a flat black rectangle. Opacity is capped at 0.14 because the
          measured contrast of on-dark-muted over the texture's brightest
          pixels was 4.15:1 at 0.22. */}
      <img
        src={PHOTOS.knitCharcoal.src}
        alt=""
        aria-hidden="true"
        loading="lazy"
        decoding="async"
        className="photo-grade pointer-events-none absolute inset-0 -z-10 h-full w-full object-cover opacity-[0.14]"
      />

      {staticMode ? (
        <div className="container-aura section-y">
          {heading}
          {/* Each layer carries its own photograph rather than one shared
              image, so nothing depends on a scroll position that does not
              exist here. */}
          <ol className="mt-10">
            {TECH_LAYERS.map((layer, i) => (
              <li key={layer.id} className="border-t border-[color:var(--color-line-dark)] py-8">
                <Photo photo={LAYER_PHOTOS[i]} className="aspect-[4/3] w-full" />
                <div className="mt-5 flex items-baseline gap-5">
                  <span className="t-label tabular text-[color:var(--color-on-dark-muted)]">
                    {layer.number}
                  </span>
                  <div className="min-w-0 flex-1">
                    <h3 className="t-h3">{layer.name}</h3>
                    <p className="t-label mt-1.5 text-[color:var(--color-on-dark-muted)]">
                      {layer.summary}
                    </p>
                    <p className="t-body mt-3 max-w-prose">{layer.copy}</p>
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </div>
      ) : (
        <div ref={ref} className="relative h-[300vh]">
          <div className="sticky top-0 flex h-screen items-center overflow-hidden">
            <div className="container-aura grid w-full items-center gap-12 lg:grid-cols-12 lg:gap-14">
              <div className="lg:col-span-5">
                {heading}
                <div className="mt-8">
                  <LayerList active={active} expand />
                </div>
              </div>

              <div className="lg:col-span-7">
                <div className="mx-auto w-full max-w-[46rem]">
                  <div className="relative aspect-[4/3] w-full overflow-hidden">
                    <AnimatePresence initial={false} mode="popLayout">
                      <motion.div
                        key={TECH_LAYERS[active].id}
                        className="absolute inset-0"
                        initial={{ opacity: 0, scale: 1.02 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: DURATION.ui, ease: EASE }}
                      >
                        <Photo photo={photo} className="h-full w-full" priority={active === 0} />
                      </motion.div>
                    </AnimatePresence>
                  </div>
                  {/* The photograph carries its own alternative text; this
                      caption is for everyone reading the page. */}
                  <p
                    className="t-label mt-4 text-[color:var(--color-on-dark-muted)]"
                    aria-hidden="true"
                  >
                    {TECH_LAYERS[active].number} — {TECH_LAYERS[active].name}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
