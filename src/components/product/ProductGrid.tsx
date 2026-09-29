import { cn } from '@/lib/cn'
import type { Product } from '@/data/types'
import { Reveal } from '@/components/primitives/Reveal'
import { ProductCard, type CardLayout } from './ProductCard'

/**
 * Variation now comes from the photographs themselves — each product was shot
 * by a different photographer on a different ground, which the shared grade
 * pulls together without flattening. The grid stays a plain rhythm and lets
 * the pictures do the work.
 */
export function CatalogGrid({ products: list }: { products: Product[] }) {
  return (
    <div className="grid grid-cols-1 gap-x-5 gap-y-12 sm:grid-cols-2 md:gap-x-6 lg:grid-cols-3 lg:gap-x-8 lg:gap-y-16">
      {list.map((product, i) => (
        <Reveal key={product.id} delay={Math.min(i, 3) * 0.05} amount={0.15}>
          <ProductCard
            product={product}
            layout="square"
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
  const cells: { span: string; layout: CardLayout; offset?: string }[] = [
    { span: 'lg:col-span-7', layout: 'wide' },
    { span: 'lg:col-span-5', layout: 'portrait', offset: 'lg:mt-20' },
    { span: 'lg:col-span-5', layout: 'portrait' },
    { span: 'lg:col-span-7', layout: 'wide', offset: 'lg:mt-20' },
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
            <ProductCard product={product} layout={cell.layout} priority />
          </Reveal>
        )
      })}
    </div>
  )
}
