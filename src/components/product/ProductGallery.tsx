import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { cn } from '@/lib/cn'
import type { Colorway, Product } from '@/data/types'
import { ShoeVisual } from '@/components/visuals/ShoeVisual'
import { VIEW_LABEL, type ShoeView } from '@/components/visuals/shoeGeometry'
import { DURATION, EASE } from '@/lib/motion'

/** Ordered so the first three thumbnails are unmistakably different from
 *  each other — three pale crops in a row read as the same picture. */
const VIEWS: ShoeView[] = ['profile', 'top', 'sole', 'heel', 'detail', 'toe']

interface ProductGalleryProps {
  product: Product
  colorway: Colorway
}

/**
 * Six genuine angles of the same shoe, not one image shown six times.
 * Thumbnails drive the main frame; the main frame crossfades rather than
 * cutting, which is the difference between a gallery and a slideshow.
 */
export function ProductGallery({ product, colorway }: ProductGalleryProps) {
  const [index, setIndex] = useState(0)
  const reduced = useReducedMotion()
  const scrollerRef = useRef<HTMLDivElement>(null)

  /** A new colourway always returns to the lateral shot. */
  useEffect(() => setIndex(0), [colorway.id])

  const view = VIEWS[index]

  const onKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'ArrowRight') {
      event.preventDefault()
      setIndex((i) => (i + 1) % VIEWS.length)
    }
    if (event.key === 'ArrowLeft') {
      event.preventDefault()
      setIndex((i) => (i - 1 + VIEWS.length) % VIEWS.length)
    }
  }

  /** Mobile: the strip is the gallery. Keep it in sync when a dot is used. */
  const scrollToIndex = (i: number) => {
    const node = scrollerRef.current
    if (!node) return
    node.scrollTo({ left: i * node.clientWidth, behavior: reduced ? 'auto' : 'smooth' })
  }

  return (
    <div className="lg:flex lg:gap-5">
      {/* ------------------------------------------------ desktop thumbnails */}
      <div
        className="hidden shrink-0 flex-col gap-2.5 lg:flex"
        role="tablist"
        aria-label={`AURA ${product.name} images`}
        aria-orientation="vertical"
      >
        {VIEWS.map((v, i) => (
          <button
            key={v}
            type="button"
            role="tab"
            aria-selected={i === index}
            aria-controls="gallery-frame"
            onClick={() => setIndex(i)}
            className={cn(
              'image-bed relative h-[4.75rem] w-[4.75rem] overflow-hidden transition-all duration-[var(--duration-micro)]',
              i === index
                ? 'ring-1 ring-[color:var(--color-ink)]'
                : 'opacity-70 hover:opacity-100',
            )}
          >
            <span className="absolute inset-0 flex items-center justify-center">
              <ShoeVisual parts={colorway.parts} shape={product.shape} view={v} label={null} />
            </span>
            <span className="sr-only">{VIEW_LABEL[v]} view</span>
          </button>
        ))}
      </div>

      {/* ------------------------------------------------------ main frame */}
      <div
        id="gallery-frame"
        role="tabpanel"
        tabIndex={0}
        onKeyDown={onKeyDown}
        aria-label={`${VIEW_LABEL[view]} view of AURA ${product.name} in ${colorway.name}`}
        className="image-bed grain relative hidden aspect-[4/3] w-full lg:block"
      >
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.div
            key={view}
            className="absolute inset-0 flex items-center justify-center"
            initial={{ opacity: 0, scale: reduced ? 1 : 1.015 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduced ? DURATION.micro : DURATION.image, ease: EASE }}
          >
            <ShoeVisual
              parts={colorway.parts}
              shape={product.shape}
              view={view}
              label={`AURA ${product.name} in ${colorway.name}, ${VIEW_LABEL[view].toLowerCase()} view`}
            />
          </motion.div>
        </AnimatePresence>

        <p className="t-label absolute bottom-5 left-5 text-[color:var(--color-on-bed)]">
          {VIEW_LABEL[view]}
          <span className="mx-2 text-[color:var(--color-line-strong)]">/</span>
          <span className="tabular">
            {String(index + 1).padStart(2, '0')} — {String(VIEWS.length).padStart(2, '0')}
          </span>
        </p>
      </div>

      {/* ---------------------------------------------------------- mobile */}
      <div className="lg:hidden">
        <div
          ref={scrollerRef}
          className="no-scrollbar flex snap-x snap-mandatory overflow-x-auto overscroll-x-contain"
          onScroll={(e) => {
            const node = e.currentTarget
            const next = Math.round(node.scrollLeft / node.clientWidth)
            if (next !== index) setIndex(next)
          }}
        >
          {VIEWS.map((v) => (
            <div
              key={v}
              className="image-bed grain relative aspect-[4/3] w-full shrink-0 snap-center"
            >
              <span className="absolute inset-0 flex items-center justify-center">
                <ShoeVisual
                  parts={colorway.parts}
                  shape={product.shape}
                  view={v}
                  label={`AURA ${product.name} in ${colorway.name}, ${VIEW_LABEL[v].toLowerCase()} view`}
                />
              </span>
            </div>
          ))}
        </div>

        <div className="mt-4 flex items-center justify-between px-5">
          <p className="t-label text-[color:var(--color-muted)]">{VIEW_LABEL[view]}</p>
          <div className="flex gap-1.5" role="tablist" aria-label="Gallery position">
            {VIEWS.map((v, i) => (
              <button
                key={v}
                type="button"
                role="tab"
                aria-selected={i === index}
                aria-label={`Show ${VIEW_LABEL[v].toLowerCase()} view`}
                onClick={() => scrollToIndex(i)}
                className={cn(
                  'h-1.5 transition-all duration-[var(--duration-ui)]',
                  i === index
                    ? 'w-6 bg-[color:var(--color-ink)]'
                    : 'w-1.5 bg-[color:var(--color-line-strong)]',
                )}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
