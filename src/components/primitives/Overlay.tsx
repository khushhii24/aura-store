import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import type { ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'
import { cn } from '@/lib/cn'
import { DRAWER_SPRING, DURATION, EASE } from '@/lib/motion'
import { useEscapeKey, useFocusTrap, useIsDesktop, useScrollLock } from '@/lib/hooks'

interface OverlayBase {
  open: boolean
  onClose: () => void
  /** Required: it labels the dialog for screen readers. */
  title: string
  /** Hide the visible title but keep it announced. */
  hideTitle?: boolean
  children: ReactNode
  className?: string
}

function Scrim({ onClose }: { onClose: () => void }) {
  return (
    <motion.div
      className="fixed inset-0 z-40 bg-[#14120e]/45 backdrop-blur-[2px]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: DURATION.ui, ease: EASE }}
      onClick={onClose}
      aria-hidden="true"
    />
  )
}

/**
 * Side drawer on desktop, full-screen sheet on mobile — not the same panel
 * squeezed, which is what the bag needs to feel native on a phone.
 */
export function Drawer({
  open,
  onClose,
  title,
  hideTitle,
  children,
  className,
  footer,
}: OverlayBase & { footer?: ReactNode }) {
  const isDesktop = useIsDesktop()
  const reduced = useReducedMotion()
  useScrollLock(open)
  useEscapeKey(open, onClose)
  const ref = useFocusTrap<HTMLDivElement>(open)

  const motionProps = reduced
    ? { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 } }
    : isDesktop
      ? { initial: { x: '100%' }, animate: { x: 0 }, exit: { x: '100%' } }
      : { initial: { y: '100%' }, animate: { y: 0 }, exit: { y: '100%' } }

  return createPortal(
    <AnimatePresence>
      {open && (
        <>
          <Scrim onClose={onClose} />
          <motion.div
            ref={ref}
            role="dialog"
            aria-modal="true"
            aria-label={title}
            className={cn(
              'fixed z-50 flex flex-col bg-[color:var(--color-surface)]',
              'inset-0 lg:inset-y-0 lg:right-0 lg:left-auto lg:w-[29rem]',
              'lg:border-l lg:border-[color:var(--color-line)]',
              className,
            )}
            {...motionProps}
            transition={reduced ? { duration: DURATION.ui } : DRAWER_SPRING}
          >
            <header className="flex shrink-0 items-center justify-between border-b border-[color:var(--color-line)] px-5 py-4 md:px-7">
              <h2 className={cn('t-label', hideTitle && 'sr-only')}>{title}</h2>
              <button
                type="button"
                onClick={onClose}
                className="-mr-2 ml-auto flex h-10 w-10 items-center justify-center text-[color:var(--color-secondary)] transition-colors hover:text-[color:var(--color-primary)]"
                aria-label={`Close ${title.toLowerCase()}`}
              >
                <X size={18} strokeWidth={1.5} aria-hidden="true" />
              </button>
            </header>

            {/* tabindex makes the scroll region reachable by keyboard in
                browsers without focusless scrolling. */}
            <div
              tabIndex={0}
              className="min-h-0 flex-1 overflow-y-auto overscroll-contain focus-visible:outline-offset-[-3px]"
            >
              {children}
            </div>

            {footer && (
              <div className="shrink-0 border-t border-[color:var(--color-line)]">{footer}</div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body,
  )
}

/**
 * Centred dialog on desktop, bottom sheet on mobile. Used for the size guide.
 */
export function Modal({ open, onClose, title, children, className }: OverlayBase) {
  const isDesktop = useIsDesktop()
  const reduced = useReducedMotion()
  useScrollLock(open)
  useEscapeKey(open, onClose)
  const ref = useFocusTrap<HTMLDivElement>(open)

  const motionProps = reduced
    ? { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 } }
    : isDesktop
      ? {
          initial: { opacity: 0, y: 20, scale: 0.985 },
          animate: { opacity: 1, y: 0, scale: 1 },
          exit: { opacity: 0, y: 12, scale: 0.99 },
        }
      : { initial: { y: '100%' }, animate: { y: 0 }, exit: { y: '100%' } }

  return createPortal(
    <AnimatePresence>
      {open && (
        <>
          <Scrim onClose={onClose} />
          <div className="pointer-events-none fixed inset-0 z-50 flex items-end justify-center lg:items-center lg:p-8">
            <motion.div
              ref={ref}
              role="dialog"
              aria-modal="true"
              aria-label={title}
              className={cn(
                'pointer-events-auto flex max-h-[88vh] w-full flex-col bg-[color:var(--color-surface)]',
                'lg:max-h-[82vh] lg:max-w-[46rem] lg:border lg:border-[color:var(--color-line)]',
                className,
              )}
              {...motionProps}
              transition={
                reduced
                  ? { duration: DURATION.ui }
                  : isDesktop
                    ? { duration: DURATION.ui, ease: EASE }
                    : DRAWER_SPRING
              }
            >
              <header className="flex shrink-0 items-center justify-between border-b border-[color:var(--color-line)] px-5 py-4 md:px-7">
                <h2 className="t-label">{title}</h2>
                <button
                  type="button"
                  onClick={onClose}
                  className="-mr-2 flex h-10 w-10 items-center justify-center text-[color:var(--color-secondary)] transition-colors hover:text-[color:var(--color-primary)]"
                  aria-label={`Close ${title.toLowerCase()}`}
                >
                  <X size={18} strokeWidth={1.5} aria-hidden="true" />
                </button>
              </header>
              {/* tabindex makes the scroll region reachable by keyboard in
                  browsers without focusless scrolling. */}
              <div
                tabIndex={0}
                className="min-h-0 flex-1 overflow-y-auto overscroll-contain focus-visible:outline-offset-[-3px]"
              >
                {children}
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>,
    document.body,
  )
}
