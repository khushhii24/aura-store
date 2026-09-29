import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { cn } from '@/lib/cn'
import type { Product } from '@/data/types'
import { DURATION, EASE } from '@/lib/motion'

/**
 * The product gallery.
 *
 * AURA ONE has four angles from one shoot and gets thumbnails; the rest have
 * a single photograph, so the gallery collapses to one frame rather than
 * padding itself out with the same picture four times.
 */
export function ProductGallery({ product }: { product: Product }) {
  const [index, setIndex] = useState(0)
  const reduced = useReducedMotion()
  const scrollerRef = useRef<HTMLDivElement>(null)
  const images = product.images

  useEffect(() => setIndex(0), [product.slug])

  if (images.length === 0) return null
  const current = images[Math.min(index, images.length - 1)]
  const many = images.length > 1

  const onKeyDown = (event: React.KeyboardEvent) => {
    if (!many) return
    if (event.key === 'ArrowRight') {
      event.preventDefault()
      setIndex((i) => (i + 1) % images.length)
    }
    if (event.key === 'ArrowLeft') {
      event.preventDefault()
      setIndex((i) => (i - 1 + images.length) % images.length)
    }
  }

  const scrollToIndex = (i: number) => {
    const node = scrollerRef.current
    if (!node) return
    node.scrollTo({ left: i * node.clientWidth, behavior: reduced ? 'auto' : 'smooth' })
  }

  return (
    <div className="lg:flex lg:gap-5">
      {many && (
        <div
          className="hidden shrink-0 flex-col gap-2.5 lg:flex"
          role="tablist"
          aria-label={`AURA ${product.name} images`}
          aria-orientation="vertical"
        >
          {images.map((image, i) => (
            <button
              key={image.src}
              type="button"
              role="tab"
              aria-selected={i === index}
              aria-controls="gallery-frame"
              onClick={() => setIndex(i)}
              className={cn(
                'relative h-[4.75rem] w-[4.75rem] overflow-hidden bg-[color:var(--color-bed-mid)] transition-all duration-[var(--duration-micro)]',
                i === index ? 'ring-1 ring-[color:var(--color-ink)]' : 'opacity-70 hover:opacity-100',
              )}
            >
              <img
                src={image.src}
                alt=""
                loading="lazy"
                decoding="async"
                className="photo-grade absolute inset-0 h-full w-full object-cover"
              />
              <span className="sr-only">{image.label}</span>
            </button>
          ))}
        </div>
      )}

      <div className="min-w-0 flex-1">
      <div
        id="gallery-frame"
        role={many ? 'tabpanel' : undefined}
        tabIndex={many ? 0 : undefined}
        onKeyDown={onKeyDown}
        aria-label={many ? current.alt : undefined}
        className="relative hidden aspect-[4/3] w-full overflow-hidden bg-[color:var(--color-bed-mid)] lg:block"
      >
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.img
            key={current.src}
            src={current.src}
            alt={current.alt}
            width={current.width}
            height={current.height}
            decoding="async"
            className="photo-grade absolute inset-0 h-full w-full object-cover"
            initial={{ opacity: 0, scale: reduced ? 1 : 1.015 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduced ? DURATION.micro : DURATION.image, ease: EASE }}
          />
        </AnimatePresence>

      </div>

      {/* Under the frame, not on it. Photographs have mid-tones, and a
          difference blend over a mid-tone gives no contrast at all. */}
      <p className="t-label mt-4 hidden text-[color:var(--color-muted)] lg:block">
        {current.label}
        {many && (
          <>
            <span className="mx-2 text-[color:var(--color-line-strong)]">/</span>
            <span className="tabular">
              {String(index + 1).padStart(2, '0')} — {String(images.length).padStart(2, '0')}
            </span>
          </>
        )}
      </p>
      </div>

      {/* ------------------------------------------------------------ mobile */}
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
          {images.map((image) => (
            <div
              key={image.src}
              className="relative aspect-[4/3] w-full shrink-0 snap-center overflow-hidden bg-[color:var(--color-bed-mid)]"
            >
              <img
                src={image.src}
                alt={image.alt}
                width={image.width}
                height={image.height}
                loading="lazy"
                decoding="async"
                className="photo-grade absolute inset-0 h-full w-full object-cover"
              />
            </div>
          ))}
        </div>

        <div className="mt-4 flex items-center justify-between px-5">
          <p className="t-label text-[color:var(--color-muted)]">{current.label}</p>
          {many && (
            <div className="flex gap-1.5" role="tablist" aria-label="Gallery position">
              {images.map((image, i) => (
                <button
                  key={image.src}
                  type="button"
                  role="tab"
                  aria-selected={i === index}
                  aria-label={`Show ${image.label.toLowerCase()}`}
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
          )}
        </div>
      </div>
    </div>
  )
}
