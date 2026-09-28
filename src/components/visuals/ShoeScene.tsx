import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'
import type { ShoeParts, ShoeShape } from '@/data/types'
import { ShoeVisual } from './ShoeVisual'
import type { ShoeView } from './shoeGeometry'

interface ShoeSceneProps {
  parts: ShoeParts
  shape: ShoeShape
  view?: ShoeView
  flip?: boolean
  /** The bed the product is "shot" on. */
  tone?: 'stone' | 'dark' | 'plain'
  /** Scales the shoe inside the bed. 1 fills the frame. */
  scale?: number
  className?: string
  label?: string | null
  /** Captions, badges, wishlist buttons — anything laid over the shot. */
  children?: ReactNode
}

/**
 * The photographic treatment.
 *
 * A stone bed with a soft top-light falloff, a contact shadow under the shoe
 * and a film-grain pass. This is what stands in for a lighting setup, and it
 * is the reason a drawn product does not read as clip art.
 */
export function ShoeScene({
  parts,
  shape,
  view = 'profile',
  flip,
  tone = 'stone',
  scale = 1,
  className,
  label,
  children,
}: ShoeSceneProps) {
  return (
    <div
      className={cn(
        'relative isolate overflow-hidden',
        tone === 'stone' && 'image-bed grain',
        tone === 'dark' && 'image-bed-deep grain grain-dark',
        tone === 'plain' && 'bg-transparent',
        className,
      )}
    >
      <div
        className="absolute inset-0 flex items-center justify-center"
        style={scale === 1 ? undefined : { transform: `scale(${scale})` }}
      >
        <ShoeVisual parts={parts} shape={shape} view={view} flip={flip} label={label} />
      </div>
      {children}
    </div>
  )
}
