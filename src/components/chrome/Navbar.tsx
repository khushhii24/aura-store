import { Link, NavLink, useLocation } from 'react-router-dom'
import { Menu, Search, ShoppingBag, User } from 'lucide-react'
import { cn } from '@/lib/cn'
import { ANNOUNCEMENTS, NAV_LINKS } from '@/data/content'
import { useScrolledPast } from '@/lib/hooks'
import { useShop } from '@/store/shop'
import { Wordmark } from '@/components/visuals/Wordmark'

/**
 * A static bar, not a rotating ticker. Auto-advancing text needs a pause
 * control to be accessible, and three short lines fit side by side anyway.
 */
function AnnouncementBar() {
  return (
    <div className="bg-[color:var(--color-ink)] text-[color:var(--color-on-dark)]">
      <div className="container-aura flex h-9 items-center justify-center gap-6">
        {ANNOUNCEMENTS.map((text, i) => (
          <p
            key={text}
            className={cn(
              't-label text-[color:var(--color-on-dark-muted)]',
              i > 0 && 'hidden md:block',
            )}
          >
            {i > 0 && (
              <span aria-hidden="true" className="mr-6 text-[color:var(--color-line-dark)]">
                ·
              </span>
            )}
            {text}
          </p>
        ))}
      </div>
    </div>
  )
}

function IconButton({
  label,
  onClick,
  children,
  badge,
}: {
  label: string
  onClick?: () => void
  children: React.ReactNode
  badge?: number
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="relative flex h-10 w-10 items-center justify-center text-[color:var(--color-primary)] transition-opacity hover:opacity-60"
    >
      {children}
      {badge !== undefined && badge > 0 && (
        <span
          className="tabular absolute top-1 right-0.5 flex h-[17px] min-w-[17px] items-center justify-center bg-[color:var(--color-signal)] px-1 text-[10px] font-medium text-[color:var(--color-ink)]"
          aria-hidden="true"
        >
          {badge}
        </span>
      )}
    </button>
  )
}

export function Navbar({ onOpenMenu }: { onOpenMenu: () => void }) {
  const scrolled = useScrolledPast(16)
  const { bagCount, wishlistCount, openOverlay } = useShop()
  const { pathname, search } = useLocation()

  return (
    <header className="sticky top-0 z-30">
      <AnnouncementBar />

      <div
        className={cn(
          'transition-[background-color,border-color,backdrop-filter] duration-[var(--duration-ui)] ease-[cubic-bezier(0.16,1,0.3,1)]',
          scrolled
            ? 'border-b border-[color:var(--color-line)] bg-[color:var(--color-canvas)]/88 backdrop-blur-md'
            : 'border-b border-transparent bg-[color:var(--color-canvas)]',
        )}
      >
        <nav className="container-aura flex h-16 items-center md:h-[4.5rem]" aria-label="Main">
          {/* ------------------------------------------------------- left */}
          <div className="flex flex-1 items-center gap-1">
            <button
              type="button"
              onClick={onOpenMenu}
              aria-label="Open menu"
              className="-ml-2.5 flex h-10 w-10 items-center justify-center lg:hidden"
            >
              <Menu size={19} strokeWidth={1.5} aria-hidden="true" />
            </button>

            <Link
              to="/"
              className="hidden text-[0.9375rem] lg:block"
              aria-label="AURA — home"
            >
              <Wordmark />
            </Link>
          </div>

          {/* ----------------------------------------------------- centre */}
          <Link
            to="/"
            className="absolute left-1/2 -translate-x-1/2 text-[0.9375rem] lg:hidden"
            aria-label="AURA — home"
          >
            <Wordmark />
          </Link>

          <ul className="hidden items-center gap-9 lg:flex">
            {NAV_LINKS.map((link) => {
              const active = `${pathname}${search}` === link.to
              return (
                <li key={link.label}>
                  <NavLink
                    to={link.to}
                    className={cn('t-nav link-draw', active && 'link-underline')}
                  >
                    {link.label}
                  </NavLink>
                </li>
              )
            })}
          </ul>

          {/* ------------------------------------------------------ right */}
          <div className="flex flex-1 items-center justify-end gap-0.5 md:gap-1">
            <IconButton label="Search products" onClick={() => openOverlay('search')}>
              <Search size={18} strokeWidth={1.5} aria-hidden="true" />
            </IconButton>

            <Link
              to="/about#contact"
              aria-label="Account"
              className="hidden h-10 w-10 items-center justify-center text-[color:var(--color-primary)] transition-opacity hover:opacity-60 md:flex"
            >
              <User size={18} strokeWidth={1.5} aria-hidden="true" />
            </Link>

            <Link
              to="/wishlist"
              aria-label={`Wishlist${wishlistCount ? `, ${wishlistCount} saved` : ''}`}
              className="relative flex h-10 w-10 items-center justify-center text-[color:var(--color-primary)] transition-opacity hover:opacity-60"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
                <path
                  d="M12 20.4 3.9 12.6a4.9 4.9 0 0 1 0-7 5.1 5.1 0 0 1 7.2 0l.9.9.9-.9a5.1 5.1 0 0 1 7.2 0 4.9 4.9 0 0 1 0 7Z"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.4"
                  strokeLinejoin="round"
                />
              </svg>
              {wishlistCount > 0 && (
                <span
                  className="absolute top-2 right-1.5 h-1.5 w-1.5 rounded-full bg-[color:var(--color-signal)]"
                  aria-hidden="true"
                />
              )}
            </Link>

            <IconButton
              label={`Bag${bagCount ? `, ${bagCount} items` : ', empty'}`}
              onClick={() => openOverlay('bag')}
              badge={bagCount}
            >
              <ShoppingBag size={18} strokeWidth={1.5} aria-hidden="true" />
            </IconButton>
          </div>
        </nav>
      </div>
    </header>
  )
}
