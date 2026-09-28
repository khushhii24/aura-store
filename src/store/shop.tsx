import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import { products } from '@/data/products'
import type { Colorway, Product } from '@/data/types'
import { usePersistentState } from '@/lib/hooks'

/**
 * The entire commerce layer.
 *
 * Bag, wishlist and recently-viewed all live in React state and mirror into
 * localStorage. There is no server: this is a frontend prototype, and every
 * total below is arithmetic on mock data.
 */

export interface BagLineInput {
  slug: string
  colorwayId: string
  size: number
  quantity?: number
}

export interface BagLine extends Required<BagLineInput> {
  id: string
}

/** A bag line joined back to the catalogue, ready to render. */
export interface ResolvedLine extends BagLine {
  product: Product
  colorway: Colorway
  lineTotal: number
}

export interface WishlistEntry {
  slug: string
  colorwayId: string
}

type OverlayName = 'search' | 'bag' | 'menu' | null

export const FREE_SHIPPING_THRESHOLD = 150
export const STANDARD_SHIPPING = 8
export const TAX_RATE = 0.0875

const lineId = (slug: string, colorwayId: string, size: number) => `${slug}__${colorwayId}__${size}`

interface ShopValue {
  /* bag */
  lines: ResolvedLine[]
  bagCount: number
  subtotal: number
  shipping: number
  tax: number
  total: number
  freeShippingRemaining: number
  addToBag: (input: BagLineInput) => void
  removeLine: (id: string) => void
  setQuantity: (id: string, quantity: number) => void
  clearBag: () => void
  lastAdded: string | null

  /* wishlist */
  wishlist: WishlistEntry[]
  isWished: (slug: string, colorwayId?: string) => boolean
  toggleWish: (entry: WishlistEntry) => void
  wishlistCount: number

  /* recently viewed */
  recentlyViewed: string[]
  markViewed: (slug: string) => void

  /* overlays */
  overlay: OverlayName
  openOverlay: (name: Exclude<OverlayName, null>) => void
  closeOverlay: () => void
}

const ShopContext = createContext<ShopValue | null>(null)

export function ShopProvider({ children }: { children: ReactNode }) {
  const [bag, setBag] = usePersistentState<BagLine[]>('aura.bag', [])
  const [wishlist, setWishlist] = usePersistentState<WishlistEntry[]>('aura.wishlist', [])
  const [recentlyViewed, setRecentlyViewed] = usePersistentState<string[]>('aura.viewed', [])
  const [overlay, setOverlay] = useState<OverlayName>(null)
  const [lastAdded, setLastAdded] = useState<string | null>(null)
  const addedTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  /** The "just added" tint is a two-second acknowledgement, not a state the
   *  line keeps for the rest of the session. */
  useEffect(() => {
    if (!lastAdded) return
    if (addedTimer.current) clearTimeout(addedTimer.current)
    addedTimer.current = setTimeout(() => setLastAdded(null), 2200)
    return () => {
      if (addedTimer.current) clearTimeout(addedTimer.current)
    }
  }, [lastAdded])

  /* ---------------------------------------------------------------- bag */

  const addToBag = useCallback(
    ({ slug, colorwayId, size, quantity = 1 }: BagLineInput) => {
      const id = lineId(slug, colorwayId, size)
      setBag((current) => {
        const existing = current.find((line) => line.id === id)
        if (existing) {
          return current.map((line) =>
            line.id === id ? { ...line, quantity: Math.min(line.quantity + quantity, 10) } : line,
          )
        }
        return [...current, { id, slug, colorwayId, size, quantity }]
      })
      setLastAdded(id)
      setOverlay('bag')
    },
    [setBag],
  )

  const removeLine = useCallback(
    (id: string) => setBag((current) => current.filter((line) => line.id !== id)),
    [setBag],
  )

  const setQuantity = useCallback(
    (id: string, quantity: number) => {
      if (quantity < 1) {
        removeLine(id)
        return
      }
      setBag((current) =>
        current.map((line) =>
          line.id === id ? { ...line, quantity: Math.min(quantity, 10) } : line,
        ),
      )
    },
    [removeLine, setBag],
  )

  const clearBag = useCallback(() => setBag([]), [setBag])

  /** Join bag lines to the catalogue, dropping anything that no longer exists. */
  const lines = useMemo<ResolvedLine[]>(() => {
    return bag.flatMap((line) => {
      const product = products.find((p) => p.slug === line.slug)
      if (!product) return []
      const colorway =
        product.colorways.find((c) => c.id === line.colorwayId) ?? product.colorways[0]
      return [{ ...line, product, colorway, lineTotal: product.price * line.quantity }]
    })
  }, [bag])

  const bagCount = useMemo(() => lines.reduce((n, l) => n + l.quantity, 0), [lines])
  const subtotal = useMemo(() => lines.reduce((n, l) => n + l.lineTotal, 0), [lines])
  const shipping = subtotal === 0 || subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : STANDARD_SHIPPING
  const tax = Math.round(subtotal * TAX_RATE * 100) / 100
  const total = subtotal + shipping + tax
  const freeShippingRemaining = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal)

  /* ----------------------------------------------------------- wishlist */

  const isWished = useCallback(
    (slug: string, colorwayId?: string) =>
      wishlist.some((w) => w.slug === slug && (!colorwayId || w.colorwayId === colorwayId)),
    [wishlist],
  )

  const toggleWish = useCallback(
    (entry: WishlistEntry) => {
      setWishlist((current) => {
        const exists = current.some(
          (w) => w.slug === entry.slug && w.colorwayId === entry.colorwayId,
        )
        return exists
          ? current.filter((w) => !(w.slug === entry.slug && w.colorwayId === entry.colorwayId))
          : [entry, ...current]
      })
    },
    [setWishlist],
  )

  /* ---------------------------------------------------- recently viewed */

  const markViewed = useCallback(
    (slug: string) =>
      setRecentlyViewed((current) => [slug, ...current.filter((s) => s !== slug)].slice(0, 4)),
    [setRecentlyViewed],
  )

  /* ------------------------------------------------------------ overlay */

  const openOverlay = useCallback((name: Exclude<OverlayName, null>) => setOverlay(name), [])
  const closeOverlay = useCallback(() => setOverlay(null), [])

  const value = useMemo<ShopValue>(
    () => ({
      lines,
      bagCount,
      subtotal,
      shipping,
      tax,
      total,
      freeShippingRemaining,
      addToBag,
      removeLine,
      setQuantity,
      clearBag,
      lastAdded,
      wishlist,
      isWished,
      toggleWish,
      wishlistCount: wishlist.length,
      recentlyViewed,
      markViewed,
      overlay,
      openOverlay,
      closeOverlay,
    }),
    [
      lines,
      bagCount,
      subtotal,
      shipping,
      tax,
      total,
      freeShippingRemaining,
      addToBag,
      removeLine,
      setQuantity,
      clearBag,
      lastAdded,
      wishlist,
      isWished,
      toggleWish,
      recentlyViewed,
      markViewed,
      overlay,
      openOverlay,
      closeOverlay,
    ],
  )

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>
}

export function useShop() {
  const ctx = useContext(ShopContext)
  if (!ctx) throw new Error('useShop must be used inside <ShopProvider>')
  return ctx
}
