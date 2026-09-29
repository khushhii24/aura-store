import { Link } from 'react-router-dom'
import { motion, useReducedMotion } from 'motion/react'
import { ArrowDown } from 'lucide-react'
import { price } from '@/lib/format'
import { flagship } from '@/data/products'
import { MaskLine } from '@/components/primitives/Reveal'
import { Photo } from '@/components/visuals/Photo'
import { DURATION, EASE } from '@/lib/motion'

/**
 * The hero commits to one structural idea: the type is the stage and the
 * product crosses it.
 *
 * Desktop pins the shoe so it bleeds off the right edge at a size no product
 * grid would allow. Phones get a different composition entirely — type first,
 * then the product in flow underneath, cropped by the section. Floating it
 * behind the copy at 390px put a shoe through the middle of the sentence.
 */
export function Hero() {
  const reduced = useReducedMotion()
  const colorway = flagship.colorways[0]
  const hero = flagship.images[0]

  return (
    <section className="image-bed grain relative flex flex-col overflow-hidden lg:min-h-[calc(100svh-6.5rem)] lg:justify-center">
      <div className="container-aura relative z-10 w-full pt-12 pb-8 md:pt-16 lg:pb-24">
        <motion.p
          className="t-label text-[color:var(--color-on-bed)]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: DURATION.reveal, ease: EASE }}
        >
          Autumn 2025 — The everyday range
        </motion.p>

        <h1 className="t-display mt-5 max-w-[16ch] md:mt-6">
          <MaskLine delay={0.06}>Move</MaskLine>
          <MaskLine delay={0.14}>differently.</MaskLine>
        </h1>

        <motion.div
          className="mt-7 max-w-md md:mt-10"
          initial={reduced ? { opacity: 0 } : { opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: DURATION.reveal, ease: EASE, delay: 0.42 }}
        >
          <p className="t-lede">Performance engineered for everyday movement.</p>

          <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Link to="/shop" className="btn btn-solid btn-lg">
              Shop the collection
            </Link>
            <Link to="/about" className="btn btn-outline btn-lg">
              Explore AURA
            </Link>
          </div>
        </motion.div>
      </div>

      {/* One instance, two compositions: in flow on a phone, pinned on desktop. */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none relative aspect-[4/3] w-full md:aspect-[16/9] lg:absolute lg:inset-y-0 lg:right-0 lg:aspect-auto lg:w-[52%]"
        initial={reduced ? { opacity: 0 } : { opacity: 0, x: 30, scale: 1.02 }}
        animate={{ opacity: 1, x: 0, scale: 1 }}
        transition={{ duration: reduced ? DURATION.ui : 1.1, ease: EASE, delay: 0.16 }}
      >
        {hero && <Photo photo={hero} alt="" priority className="h-full w-full" />}
      </motion.div>

      <motion.div
        className="container-aura relative z-10 flex w-full flex-wrap items-end justify-between gap-x-6 gap-y-4 pt-7 pb-8 lg:pt-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: DURATION.reveal, ease: EASE, delay: 0.6 }}
      >
        <a
          href="#collection"
          className="t-label group flex items-center gap-3 text-[color:var(--color-on-bed)] transition-colors hover:text-[color:var(--color-primary)]"
        >
          <span className="flex h-9 w-9 items-center justify-center border border-[color:var(--color-on-bed)] transition-colors group-hover:border-[color:var(--color-ink)]">
            <ArrowDown size={14} strokeWidth={1.5} aria-hidden="true" />
          </span>
          Scroll
        </a>

        {/* The colourway is dropped below sm — the full credit does not fit
            on a 390px line and wrapping it reads as a mistake. */}
        <p className="t-label ml-auto text-right whitespace-nowrap text-[color:var(--color-on-bed)]">
          AURA {flagship.name}
          <span className="hidden sm:inline">
            <span className="mx-2 text-[color:var(--color-line-strong)]">/</span>
            {colorway.name}
          </span>
          <span className="mx-2 text-[color:var(--color-line-strong)]">/</span>
          <span className="tabular">{price(flagship.price)}</span>
        </p>
      </motion.div>
    </section>
  )
}
