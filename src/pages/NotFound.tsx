import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { flagship } from '@/data/products'
import { ShoeVisual } from '@/components/visuals/ShoeVisual'

export function NotFound() {
  useEffect(() => {
    document.title = 'Page not found — AURA'
  }, [])

  return (
    <section className="image-bed grain relative flex min-h-[70vh] items-center overflow-hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-[-20%] bottom-[-10%] w-[110%] opacity-70 md:w-[70%]"
      >
        <ShoeVisual parts={flagship.colorways[0].parts} shape={flagship.shape} label={null} />
      </div>

      <div className="container-aura relative z-10 py-24">
        <p className="t-label text-[color:var(--color-on-bed)]">Error 404</p>
        <h1 className="t-h1 mt-6 max-w-[14ch]">This one went the other way.</h1>
        <p className="t-lede mt-5 max-w-sm">
          The page you were after does not exist. The collection is still where you left it.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link to="/shop" className="btn btn-solid btn-lg">
            Shop the collection
          </Link>
          <Link to="/" className="btn btn-outline btn-lg">
            Back to home
          </Link>
        </div>
      </div>
    </section>
  )
}
