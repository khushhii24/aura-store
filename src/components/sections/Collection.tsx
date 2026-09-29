import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { featuredProducts } from '@/data/products'
import { EditorialGrid } from '@/components/product/ProductGrid'
import { Reveal } from '@/components/primitives/Reveal'
import { Eyebrow } from '@/components/primitives/Bits'

export function Collection() {
  return (
    <section id="collection" className="section-y bg-[color:var(--color-stone)]" aria-labelledby="collection-heading">
      <div className="container-aura">
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <Eyebrow>The range</Eyebrow>
              <h2 id="collection-heading" className="t-h1 mt-6 max-w-[14ch]">
                Four shoes. One idea.
              </h2>
            </div>
            <Link to="/shop" className="group t-nav flex items-center gap-3 pb-2">
              <span className="link-draw">View all six</span>
              <ArrowRight
                size={15}
                strokeWidth={1.5}
                aria-hidden="true"
                className="transition-transform duration-[var(--duration-ui)] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1"
              />
            </Link>
          </div>
        </Reveal>

        <div className="mt-14 lg:mt-20">
          <EditorialGrid products={featuredProducts} />
        </div>
      </div>
    </section>
  )
}
