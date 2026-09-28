import { useRef, useState } from 'react'
import { AnimatePresence, motion, useMotionValueEvent, useReducedMotion, useScroll } from 'motion/react'
import { cn } from '@/lib/cn'
import { TECH_LAYERS } from '@/data/content'
import { flagship } from '@/data/products'
import { ExplodedShoe } from '@/components/visuals/ExplodedShoe'
import { Eyebrow } from '@/components/primitives/Bits'
import { useIsDesktop } from '@/lib/hooks'
import { DURATION, EASE } from '@/lib/motion'

const clamp01 = (n: number) => Math.min(1, Math.max(0, n))

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
 * Construction, taken apart on scroll.
 *
 * The desktop version pins the shoe and separates it as you read; the mobile
 * version shows it already apart and lets the list scroll normally, because a
 * pinned scroll-jack on a phone is a worse experience than a good static one.
 */
export function Technology() {
  const ref = useRef<HTMLDivElement>(null)
  const isDesktop = useIsDesktop()
  const reduced = useReducedMotion()
  const [progress, setProgress] = useState(0)
  const [active, setActive] = useState<number | null>(null)

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end end'],
  })

  useMotionValueEvent(scrollYProgress, 'change', (p) => {
    /** Rounded so scrolling triggers ~50 renders, not one per frame. */
    setProgress(Math.round(clamp01((p - 0.04) / 0.32) * 50) / 50)
    setActive(p < 0.4 ? null : Math.min(3, Math.floor((p - 0.4) / 0.145)))
  })

  /** A pale colourway: the dark band needs the product to carry the light. */
  const colorway = flagship.colorways[0]
  const staticMode = !isDesktop || reduced

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
      className="on-dark bg-[color:var(--color-ink-deep)]"
      aria-labelledby="tech-heading"
    >
      {staticMode ? (
        <div className="container-aura section-y">
          {heading}
          <div className="mt-10 aspect-[4/3] w-full">
            <ExplodedShoe parts={colorway.parts} shape={flagship.shape} progress={1} active={null} />
          </div>
          <div className="mt-10">
            <LayerList active={null} expand={false} />
          </div>
        </div>
      ) : (
        <div ref={ref} className="relative h-[340vh]">
          <div className="sticky top-0 flex h-screen items-center overflow-hidden">
            <div className="container-aura grid w-full items-center gap-12 lg:grid-cols-12 lg:gap-14">
              <div className="lg:col-span-5">
                {heading}
                <div className="mt-8">
                  <LayerList active={active} expand />
                </div>
              </div>

              <div className="lg:col-span-7">
                <div className="mx-auto h-[74vh] w-full max-w-[46rem]">
                  <ExplodedShoe
                    parts={colorway.parts}
                    shape={flagship.shape}
                    progress={progress}
                    active={active}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
