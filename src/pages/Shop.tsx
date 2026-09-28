import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { cn } from '@/lib/cn'
import {
  applyFilters,
  applySort,
  countActiveFilters,
  emptyFilters,
  type FilterState,
  type SortValue,
} from '@/data/catalog'
import { products } from '@/data/products'
import type { Category } from '@/data/types'
import { CatalogGrid } from '@/components/product/ProductGrid'
import {
  ActiveFilterChips,
  FilterPanel,
  MobileFilterTrigger,
  SortSelect,
} from '@/components/product/ProductFilters'
import { Drawer } from '@/components/primitives/Overlay'
import { Button } from '@/components/primitives/Button'
import { Eyebrow } from '@/components/primitives/Bits'
import { Reveal } from '@/components/primitives/Reveal'

type Audience = 'men' | 'women' | null

/**
 * AURA is a unisex range, so Men and Women are merchandising views rather
 * than separate catalogues: the lead order changes, the products do not.
 * Inventing gendered SKUs to make a filter look busy would be dishonest data.
 */
const LEAD_ORDER: Record<'men' | 'women', string[]> = {
  men: ['aura-one', 'aura-run', 'aura-trail', 'aura-shift'],
  women: ['aura-form', 'aura-one', 'aura-low', 'aura-step'],
}

const COPY: Record<'all' | 'men' | 'women', { title: string; intro: string }> = {
  all: {
    title: 'The collection',
    intro:
      'Eight models on one platform. Every pair shares the same midsole, the same last and the same 30-day wear test.',
  },
  men: {
    title: "Men's footwear",
    intro:
      'Every AURA model is unisex and made in one size run. Sizes below are US men’s — the size guide converts to UK, EU and centimetres.',
  },
  women: {
    title: "Women's footwear",
    intro:
      'Every AURA model is unisex and made in one size run. Sizes below are US men’s; most women take 1.5 sizes down from their usual US women’s size.',
  },
}

export function Shop() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [filters, setFilters] = useState<FilterState>(emptyFilters)
  const [drawerOpen, setDrawerOpen] = useState(false)

  const audience = (searchParams.get('audience') as Audience) ?? null
  const sort = (searchParams.get('sort') as SortValue) ?? 'featured'
  const categoryParam = searchParams.get('category') as Category | null

  /** A category arriving in the URL becomes a real, removable filter chip. */
  useEffect(() => {
    if (!categoryParam) return
    setFilters((current) =>
      current.categories.includes(categoryParam)
        ? current
        : { ...current, categories: [...current.categories, categoryParam] },
    )
    const next = new URLSearchParams(searchParams)
    next.delete('category')
    setSearchParams(next, { replace: true })
  }, [categoryParam, searchParams, setSearchParams])

  useEffect(() => {
    document.title = `${COPY[audience ?? 'all'].title} — AURA`
  }, [audience])

  const setSort = (value: SortValue) => {
    const next = new URLSearchParams(searchParams)
    if (value === 'featured') next.delete('sort')
    else next.set('sort', value)
    setSearchParams(next, { replace: true })
  }

  const visible = useMemo(() => {
    const base = audience
      ? [...products].sort((a, b) => {
          const order = LEAD_ORDER[audience]
          const ai = order.indexOf(a.slug)
          const bi = order.indexOf(b.slug)
          return (ai === -1 ? 99 : ai) - (bi === -1 ? 99 : bi)
        })
      : products

    return applySort(applyFilters(base, filters), audience && sort === 'featured' ? 'featured' : sort)
  }, [audience, filters, sort])

  const activeCount = countActiveFilters(filters)
  const copy = COPY[audience ?? 'all']

  return (
    <>
      <header className="border-b border-[color:var(--color-line)] bg-[color:var(--color-stone)]">
        <div className="container-aura py-14 md:py-20">
          <Eyebrow>Shop</Eyebrow>
          <h1 className="t-h1 mt-6 max-w-[14ch]">{copy.title}</h1>
          <p className="t-lede mt-5 max-w-xl">{copy.intro}</p>
        </div>
      </header>

      <div className="container-aura py-10 md:py-14">
        <div className="lg:grid lg:grid-cols-[15rem_1fr] lg:gap-14">
          {/* --------------------------------------------------- filter rail */}
          <aside className="hidden lg:block">
            <div className="sticky top-32">
              <div className="flex items-baseline justify-between">
                <h2 className="t-label">Filter</h2>
                {activeCount > 0 && (
                  <button
                    type="button"
                    onClick={() => setFilters(emptyFilters)}
                    className="t-label link-draw text-[color:var(--color-muted)] hover:text-[color:var(--color-primary)]"
                  >
                    Clear ({activeCount})
                  </button>
                )}
              </div>
              <div className="mt-8 max-h-[calc(100vh-14rem)] overflow-y-auto pr-2 pb-4">
                <FilterPanel filters={filters} setFilters={setFilters} />
              </div>
            </div>
          </aside>

          {/* -------------------------------------------------------- results */}
          <div>
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[color:var(--color-line)] pb-5">
              <p className="t-label text-[color:var(--color-muted)]" aria-live="polite">
                {visible.length} {visible.length === 1 ? 'style' : 'styles'}
              </p>
              <div className="flex items-center gap-2.5">
                <MobileFilterTrigger filters={filters} onOpen={() => setDrawerOpen(true)} />
                <SortSelect sort={sort} setSort={setSort} />
              </div>
            </div>

            {activeCount > 0 && (
              <div className="mt-5 flex flex-wrap items-center gap-3">
                <ActiveFilterChips filters={filters} setFilters={setFilters} />
                <button
                  type="button"
                  onClick={() => setFilters(emptyFilters)}
                  className="t-label link-draw text-[color:var(--color-muted)] hover:text-[color:var(--color-primary)]"
                >
                  Clear all
                </button>
              </div>
            )}

            <div className={cn('mt-10 md:mt-12')}>
              {visible.length > 0 ? (
                <CatalogGrid products={visible} />
              ) : (
                <Reveal className="max-w-md py-16">
                  <h2 className="t-h3">Nothing matches that combination.</h2>
                  <p className="t-body mt-3">
                    Try removing a filter — size and colour together narrow the range fastest.
                  </p>
                  <Button className="mt-6" onClick={() => setFilters(emptyFilters)}>
                    Clear all filters
                  </Button>
                </Reveal>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* --------------------------------------------------- mobile filters */}
      <Drawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        title="Filter"
        footer={
          <div className="flex gap-3 px-5 py-5">
            <Button
              variant="quiet"
              size="lg"
              className="flex-1"
              onClick={() => setFilters(emptyFilters)}
              disabled={activeCount === 0}
            >
              Clear
            </Button>
            <Button size="lg" className="flex-[2]" onClick={() => setDrawerOpen(false)}>
              Show {visible.length} {visible.length === 1 ? 'style' : 'styles'}
            </Button>
          </div>
        }
      >
        <div className="px-5 py-7">
          <FilterPanel filters={filters} setFilters={setFilters} />
        </div>
      </Drawer>
    </>
  )
}
