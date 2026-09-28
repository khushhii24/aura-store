import { useId, useState, type ReactNode } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { Plus } from 'lucide-react'
import { cn } from '@/lib/cn'
import { DURATION, EASE } from '@/lib/motion'

interface AccordionItemProps {
  title: string
  children: ReactNode
  defaultOpen?: boolean
  className?: string
}

export function AccordionItem({ title, children, defaultOpen = false, className }: AccordionItemProps) {
  const [open, setOpen] = useState(defaultOpen)
  const reduced = useReducedMotion()
  const panelId = useId()

  return (
    <div className={cn('border-b border-[color:var(--color-line)]', className)}>
      <h3>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls={panelId}
          className="group flex w-full items-center justify-between gap-4 py-5 text-left"
        >
          <span className="t-product">{title}</span>
          <Plus
            size={16}
            strokeWidth={1.5}
            aria-hidden="true"
            className={cn(
              'shrink-0 text-[color:var(--color-secondary)] transition-transform duration-[var(--duration-ui)] ease-[cubic-bezier(0.16,1,0.3,1)]',
              open && 'rotate-45',
            )}
          />
        </button>
      </h3>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id={panelId}
            key="panel"
            initial={reduced ? { opacity: 0 } : { height: 0, opacity: 0 }}
            animate={reduced ? { opacity: 1 } : { height: 'auto', opacity: 1 }}
            exit={reduced ? { opacity: 0 } : { height: 0, opacity: 0 }}
            transition={{ duration: DURATION.ui, ease: EASE }}
            className="overflow-hidden"
          >
            <div className="pb-6">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
