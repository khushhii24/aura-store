import { Suspense, lazy, useEffect, useState } from 'react'
import {
  BrowserRouter,
  Outlet,
  Route,
  Routes,
  useLocation,
} from 'react-router-dom'
import { ShopProvider, useShop } from '@/store/shop'
import { Navbar } from '@/components/chrome/Navbar'
import { MobileMenu } from '@/components/chrome/MobileMenu'
import { SearchOverlay } from '@/components/chrome/SearchOverlay'
import { BagDrawer } from '@/components/chrome/BagDrawer'
import { Footer } from '@/components/chrome/Footer'
import { SizeGuide } from '@/components/product/SizeGuide'
import { Home } from '@/pages/Home'
import { Shop } from '@/pages/Shop'
import { ProductDetail } from '@/pages/ProductDetail'
import { NotFound } from '@/pages/NotFound'

/**
 * Home, shop and the product page are the paths that matter for first paint,
 * so they stay in the main bundle. The rest split out.
 */
const About = lazy(() => import('@/pages/About').then((m) => ({ default: m.About })))
const Wishlist = lazy(() => import('@/pages/Wishlist').then((m) => ({ default: m.Wishlist })))
const Checkout = lazy(() => import('@/pages/Checkout').then((m) => ({ default: m.Checkout })))

/** New route, top of the page — except when the URL carries a hash. */
function ScrollToTop() {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    if (hash) {
      const target = document.querySelector(hash)
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' })
        return
      }
    }
    window.scrollTo({ top: 0, behavior: 'auto' })
  }, [pathname, hash])

  return null
}

function Layout() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false)
  const { pathname } = useLocation()
  const { closeOverlay } = useShop()

  /** Any navigation closes every overlay. */
  useEffect(() => {
    setMenuOpen(false)
    closeOverlay()
  }, [pathname, closeOverlay])

  return (
    <>
      <a
        href="#main"
        className="btn btn-solid btn-md sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[60]"
      >
        Skip to content
      </a>

      <Navbar onOpenMenu={() => setMenuOpen(true)} />

      <main id="main" tabIndex={-1}>
        <Suspense fallback={<div className="min-h-[60vh]" aria-busy="true" />}>
          <Outlet context={{ openSizeGuide: () => setSizeGuideOpen(true) }} />
        </Suspense>
      </main>

      <Footer onOpenSizeGuide={() => setSizeGuideOpen(true)} />

      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
      <SearchOverlay />
      <BagDrawer />
      <SizeGuide open={sizeGuideOpen} onClose={() => setSizeGuideOpen(false)} />
    </>
  )
}

export function App() {
  /* Pages serves this from /aura-store/, dev serves it from /. Taking the
     basename from BASE_URL means neither is hardcoded and links stay correct
     in both. React Router wants it without the trailing slash. */
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL.replace(/\/$/, '')}>
      <ShopProvider>
        <ScrollToTop />
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/product/:slug" element={<ProductDetail />} />
            <Route path="/about" element={<About />} />
            <Route path="/wishlist" element={<Wishlist />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </ShopProvider>
    </BrowserRouter>
  )
}
