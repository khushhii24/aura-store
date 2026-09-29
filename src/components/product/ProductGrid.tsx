import { cn } from '@/lib/cn'
import type { Product } from '@/data/types'
import { Reveal } from '@/components/primitives/Reveal'
import { ProductCard, type CardLayout } from './ProductCard'
import type { ShoeView } from '@/components/visuals/shoeGeometry'

/**
 * Deterministic variation.
 *
 * A grid where every tile is the same crop, the same tone and the same angle
 * reads as a template. These cycles break the rhythm without randomness, so
 * the page looks the same on every load.
 *
 * Tight crops (detail, heel) are hover-only: at tile size they read as an
 * abstract band of colour rather than a product, which costs more than the
 * variety buys.
 */
const CATALOG_VIEWS: ShoeView[] = ['hero', 'hero', 'top', 'hero', 'hero', 'hero']
const CATALOG_HOVER: ShoeView[] = ['top', 'sole', 'hero', 'profile', 'heel', 'top']

export function CatalogGrid({ products: list }: { products: Product[] }) {
  return (
    <div className="grid grid-cols-1 gap-x-5 gap-y-12 sm:grid-cols-2 md:gap-x-6 lg:grid-cols-3 lg:gap-x-8 lg:gap-y-16">
      {list.map((product, i) => (
        <Reveal key={product.id} delay={Math.min(i, 3) * 0.05} amount={0.15}>
          <ProductCard
            product={product}
            layout="square"
            view={CATALOG_VIEWS[i % CATALOG_VIEWS.length]}
            hoverView={CATALOG_HOVER[i % CATALOG_HOVER.length]}
            flip={i % 3 === 2}
            tone={i % 5 === 3 ? 'dark' : 'stone'}
            priority
          />
        </Reveal>
      ))}
    </div>
  )
}

/**
 * The home-page range. Four products in an asymmetric editorial composition —
 * different spans, different crops, one dark tile to break the stone field.
 */
export function EditorialGrid({ products: list }: { products: Product[] }) {
  const cells: {
    span: string
    layout: CardLayout
    view: ShoeView
    hoverView: ShoeView
    tone: 'stone' | 'dark'
    flip?: boolean
    offset?: string
  }[] = [
    {
      span: 'lg:col-span-7',
      layout: 'wide',
      view: 'hero',
      hoverView: 'detail',
      tone: 'stone',
    },
    {
      span: 'lg:col-span-5',
      layout: 'portrait',
      view: 'top',
      hoverView: 'hero',
      tone: 'dark',
      offset: 'lg:mt-20',
    },
    {
      span: 'lg:col-span-5',
      layout: 'portrait',
      view: 'hero',
      hoverView: 'sole',
      tone: 'stone',
      flip: true,
    },
    {
      span: 'lg:col-span-7',
      layout: 'wide',
      view: 'hero',
      hoverView: 'top',
      tone: 'stone',
      offset: 'lg:mt-20',
    },
  ]

  return (
    <div className="grid grid-cols-1 gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-12 lg:gap-x-8 lg:gap-y-6">
      {list.map((product, i) => {
        const cell = cells[i % cells.length]
        return (
          <Reveal
            key={product.id}
            delay={(i % 2) * 0.06}
            amount={0.15}
            className={cn(cell.span, cell.offset)}
          >
            <ProductCard
              product={product}
              layout={cell.layout}
              view={cell.view}
              hoverView={cell.hoverView}
              tone={cell.tone}
              flip={cell.flip}
              priority
            />
          </Reveal>
        )
      })}
    </div>
  )
}
