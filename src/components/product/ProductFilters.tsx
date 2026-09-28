import { ChevronDown, SlidersHorizontal, X } from 'lucide-react'
import { cn } from '@/lib/cn'
import {
  CATEGORIES,
  COLOR_FAMILIES,
  PRICE_BANDS,
  SORTS,
  countActiveFilters,
  type FilterState,
  type PriceBand,
  type SortValue,
} from '@/data/catalog'
import { SIZE_RUN } from '@/data/products'
import type { Category, ColorFamily } from '@/data/types'

export interface FilterControls {
  filters: FilterState
  setFilters: (next: FilterState) => void
  sort: SortValue
  setSort: (next: SortValue) => void
}

/** Toggle a value in one of the filter arrays. */
function toggle<T>(list: T[], value: T): T[] {
  return list.includes(value) ? list.filter((v) => v !== value) : [...list, value]
}

function GroupHeading({ children }: { children: string }) {
  return (
    <h3 className="t-label mb-4 text-[color:var(--color-muted)]">
      {children}
    </h3>
  )
}

/**
 * The filter groups. Rendered in a sticky rail on desktop and inside a
 * full-screen drawer on mobile — same component, so the two never drift.
 */
export function FilterPanel({ filters, setFilters }: Pick<FilterControls, 'filters' | 'setFilters'>) {
  const set = (patch: Partial<FilterState>) => setFilters({ ...filters, ...patch })

  return (
    <div className="space-y-10">
      <fieldset>
        <legend className="sr-only">Category</legend>
        <GroupHeading>Category</GroupHeading>
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((c) => (
            <button
              key={c.value}
              type="button"
              className="chip"
              aria-pressed={filters.categories.includes(c.value)}
              onClick={() => set({ categories: toggle<Category>(filters.categories, c.value) })}
            >
              {c.label}
            </button>
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend className="sr-only">Size</legend>
        <GroupHeading>Size (US)</GroupHeading>
        <div className="grid grid-cols-5 gap-1.5">
          {SIZE_RUN.map((size) => (
            <button
              key={size}
              type="button"
              className="pill min-w-0 px-0"
              aria-pressed={filters.sizes.includes(size)}
              onClick={() => set({ sizes: toggle(filters.sizes, size) })}
            >
              {size}
            </button>
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend className="sr-only">Colour</legend>
        <GroupHeading>Colour</GroupHeading>
        <div className="grid grid-cols-2 gap-x-3 gap-y-2">
          {COLOR_FAMILIES.map((c) => {
            const on = filters.colors.includes(c.value)
            return (
              <button
                key={c.value}
                type="button"
                aria-pressed={on}
                onClick={() => set({ colors: toggle<ColorFamily>(filters.colors, c.value) })}
                className={cn(
                  'flex w-full items-center gap-3 py-1 text-left text-sm transition-colors',
                  on ? 'text-[color:var(--color-primary)]' : 'text-[color:var(--color-secondary)]',
                  'hover:text-[color:var(--color-primary)]',
                )}
              >
                <span
                  className={cn(
                    'h-4 w-4 shrink-0 rounded-full',
                    on && 'ring-1 ring-[color:var(--color-ink)] ring-offset-2',
                  )}
                  style={{
                    background: c.swatch,
                    boxShadow: 'inset 0 0 0 1px rgb(28 27 24 / 0.2)',
                  }}
                />
                {c.label}
              </button>
            )
          })}
        </div>
      </fieldset>

      <fieldset>
        <legend className="sr-only">Price</legend>
        <GroupHeading>Price</GroupHeading>
        <div className="grid grid-cols-2 gap-x-3 gap-y-2">
          {PRICE_BANDS.map((band) => {
            const on = filters.prices.includes(band.value)
            return (
              <label
                key={band.value}
                className="flex cursor-pointer items-center gap-3 py-1 text-sm text-[color:var(--color-secondary)] transition-colors hover:text-[color:var(--color-primary)]"
              >
                <input
                  type="checkbox"
                  checked={on}
                  onChange={() => set({ prices: toggle<PriceBand>(filters.prices, band.value) })}
                  className="h-4 w-4 shrink-0 appearance-none border border-[color:var(--color-control)] transition-colors checked:border-[color:var(--color-ink)] checked:bg-[color:var(--color-ink)]"
                />
                <span className={cn(on && 'text-[color:var(--color-primary)]')}>{band.label}</span>
              </label>
            )
          })}
        </div>
      </fieldset>
    </div>
  )
}

/** The sort control. A native select — reliable with a keyboard on every platform. */
export function SortSelect({ sort, setSort }: Pick<FilterControls, 'sort' | 'setSort'>) {
  return (
    <div className="relative">
      <label htmlFor="sort" className="sr-only">
        Sort products
      </label>
      <select
        id="sort"
        value={sort}
        onChange={(e) => setSort(e.target.value as SortValue)}
        className="t-nav h-10 cursor-pointer appearance-none border border-[color:var(--color-control)] bg-transparent pr-9 pl-3.5 text-[color:var(--color-primary)] transition-colors hover:border-[color:var(--color-ink)]"
      >
        {SORTS.map((s) => (
          <option key={s.value} value={s.value}>
            {s.label}
          </option>
        ))}
      </select>
      <ChevronDown
        size={14}
        strokeWidth={1.5}
        className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-[color:var(--color-secondary)]"
        aria-hidden="true"
      />
    </div>
  )
}

export function MobileFilterTrigger({
  filters,
  onOpen,
}: {
  filters: FilterState
  onOpen: () => void
}) {
  const n = countActiveFilters(filters)
  return (
    <button
      type="button"
      onClick={onOpen}
      className="t-nav flex h-10 items-center gap-2.5 border border-[color:var(--color-control)] px-3.5 transition-colors hover:border-[color:var(--color-ink)] lg:hidden"
    >
      <SlidersHorizontal size={14} strokeWidth={1.5} aria-hidden="true" />
      Filters
      {n > 0 && (
        <span className="badge badge-signal -mr-1 h-5 px-1.5" aria-hidden="true">
          {n}
        </span>
      )}
      <span className="sr-only">{n > 0 ? `, ${n} applied` : ''}</span>
    </button>
  )
}

/** Removable chips for everything currently applied. */
export function ActiveFilterChips({
  filters,
  setFilters,
}: Pick<FilterControls, 'filters' | 'setFilters'>) {
  const n = countActiveFilters(filters)
  if (n === 0) return null

  const chips: { key: string; label: string; remove: () => void }[] = [
    ...filters.categories.map((v) => ({
      key: `c-${v}`,
      label: CATEGORIES.find((c) => c.value === v)?.label ?? v,
      remove: () => setFilters({ ...filters, categories: filters.categories.filter((x) => x !== v) }),
    })),
    ...filters.sizes.map((v) => ({
      key: `s-${v}`,
      label: `US ${v}`,
      remove: () => setFilters({ ...filters, sizes: filters.sizes.filter((x) => x !== v) }),
    })),
    ...filters.colors.map((v) => ({
      key: `col-${v}`,
      label: COLOR_FAMILIES.find((c) => c.value === v)?.label ?? v,
      remove: () => setFilters({ ...filters, colors: filters.colors.filter((x) => x !== v) }),
    })),
    ...filters.prices.map((v) => ({
      key: `p-${v}`,
      label: PRICE_BANDS.find((b) => b.value === v)?.label ?? v,
      remove: () => setFilters({ ...filters, prices: filters.prices.filter((x) => x !== v) }),
    })),
  ]

  return (
    <ul className="flex flex-wrap items-center gap-2">
      {chips.map((chip) => (
        <li key={chip.key}>
          <button
            type="button"
            onClick={chip.remove}
            className="chip gap-2 hover:border-[color:var(--color-ink)]"
          >
            {chip.label}
            <X size={12} strokeWidth={2} aria-hidden="true" />
            <span className="sr-only">Remove filter</span>
          </button>
        </li>
      ))}
    </ul>
  )
}
