import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Check } from 'lucide-react'
import { FOOTER_COLUMNS, LEGAL_LINKS, SOCIAL_LINKS } from '@/data/content'
import { Wordmark } from '@/components/visuals/Wordmark'

/** Newsletter UI only — nothing is sent anywhere. */
function Newsletter() {
  const [email, setEmail] = useState('')
  const [done, setDone] = useState(false)

  return (
    <form
      className="max-w-sm"
      onSubmit={(e) => {
        e.preventDefault()
        if (email.trim().length === 0) return
        setDone(true)
        setEmail('')
      }}
    >
      <h2 className="t-h3">Move with us.</h2>
      <p className="t-body mt-2.5 text-[color:var(--color-on-dark-secondary)]">
        New models, restocks and the occasional long read. Roughly monthly.
      </p>

      <div className="mt-5 flex items-center border-b border-[color:var(--color-line-dark)] focus-within:border-[color:var(--color-on-dark)]">
        <label htmlFor="newsletter" className="sr-only">
          Email address
        </label>
        <input
          id="newsletter"
          type="email"
          required
          value={email}
          onChange={(e) => {
            setEmail(e.target.value)
            setDone(false)
          }}
          placeholder="your@email.com"
          className="h-12 min-w-0 flex-1 bg-transparent text-[0.9375rem] text-[color:var(--color-on-dark)] outline-none placeholder:text-[color:var(--color-on-dark-muted)]"
        />
        <button
          type="submit"
          className="flex h-12 w-12 shrink-0 items-center justify-center text-[color:var(--color-on-dark)] transition-opacity hover:opacity-65"
          aria-label="Sign up for the AURA newsletter"
        >
          <ArrowRight size={18} strokeWidth={1.5} aria-hidden="true" />
        </button>
      </div>

      <p className="t-small mt-3 flex items-center gap-2 text-[color:var(--color-on-dark-muted)]" aria-live="polite">
        {done ? (
          <>
            <Check size={14} strokeWidth={1.75} aria-hidden="true" />
            Thanks — this is a prototype, so nothing was actually sent.
          </>
        ) : (
          'No spam. Unsubscribe in one click.'
        )}
      </p>
    </form>
  )
}

export function Footer({ onOpenSizeGuide }: { onOpenSizeGuide: () => void }) {
  return (
    <footer className="on-dark bg-[color:var(--color-ink-deep)]">
      <div className="container-aura section-y-tight">
        <div className="grid gap-12 lg:grid-cols-[1fr_auto] lg:gap-20">
          <Newsletter />

          <div className="grid grid-cols-2 gap-x-8 gap-y-10 sm:grid-cols-4 lg:gap-x-14">
            {FOOTER_COLUMNS.map((column) => (
              <nav key={column.heading} aria-label={column.heading}>
                <h2 className="t-label text-[color:var(--color-on-dark-muted)]">
                  {column.heading}
                </h2>
                <ul className="mt-4 space-y-2.5">
                  {column.links.map((link) =>
                    link.to === '#size-guide' ? (
                      <li key={link.label}>
                        <button
                          type="button"
                          onClick={onOpenSizeGuide}
                          className="t-small link-draw text-left text-[color:var(--color-on-dark-secondary)] hover:text-[color:var(--color-on-dark)]"
                        >
                          {link.label}
                        </button>
                      </li>
                    ) : (
                      <li key={link.label}>
                        <Link
                          to={link.to}
                          className="t-small link-draw text-[color:var(--color-on-dark-secondary)] hover:text-[color:var(--color-on-dark)]"
                        >
                          {link.label}
                        </Link>
                      </li>
                    ),
                  )}
                </ul>
              </nav>
            ))}
          </div>
        </div>

        {/* The wordmark as a rule across the base of the page. */}
        <div className="mt-16 border-t border-[color:var(--color-line-dark)] pt-8 lg:mt-24">
          <Link to="/" aria-label="AURA — home" className="block">
            <Wordmark className="block text-[clamp(2.5rem,11vw,9rem)] leading-none text-[color:var(--color-ink-raised)] transition-colors duration-[var(--duration-ui)] hover:text-[color:var(--color-line-dark)]" />
          </Link>
        </div>

        <div className="mt-10 flex flex-col gap-6 border-t border-[color:var(--color-line-dark)] pt-7 md:flex-row md:items-center md:justify-between">
          <ul className="flex flex-wrap gap-x-6 gap-y-2">
            {SOCIAL_LINKS.map((s) => (
              <li key={s.label}>
                <a
                  href={s.href}
                  className="t-label link-draw text-[color:var(--color-on-dark-muted)] hover:text-[color:var(--color-on-dark)]"
                >
                  {s.label}
                </a>
              </li>
            ))}
          </ul>

          <ul className="flex flex-wrap gap-x-6 gap-y-2">
            {LEGAL_LINKS.map((l) => (
              <li key={l.label}>
                <a
                  href={l.href}
                  className="t-label link-draw text-[color:var(--color-on-dark-muted)] hover:text-[color:var(--color-on-dark)]"
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <p className="t-small mt-8 max-w-2xl text-[color:var(--color-on-dark-muted)]">
          AURA is a fictional brand built as a front-end portfolio project. Products, prices,
          reviews and publications on this site are invented; no orders are taken and no payments
          are processed.
        </p>
      </div>
    </footer>
  )
}
