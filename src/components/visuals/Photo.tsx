import { cn } from '@/lib/cn'
/** Structural: takes anything with a src, alt and intrinsic size — the
 *  material photography and the product photography both satisfy it. */
interface PhotoData {
  src: string
  alt: string
  width: number
  height: number
}

interface PhotoProps {
  photo: PhotoData
  className?: string
  /** Above-the-fold images opt out of lazy loading. */
  priority?: boolean
  /** Overrides the alt text; pass '' to mark it decorative. */
  alt?: string
  /** A dark wash for laying type over the image. */
  scrim?: 'none' | 'soft' | 'strong'
  children?: React.ReactNode
}

/**
 * Every photograph on the site goes through here.
 *
 * Two jobs beyond rendering an image. It reserves the space from the
 * intrinsic dimensions so nothing shifts as photos arrive, and it applies
 * one shared grade — a slight desaturation and a warm multiply — so images
 * from ten different photographers sit on AURA's palette instead of pulling
 * in ten directions.
 */
export function Photo({
  photo,
  className,
  priority = false,
  alt,
  scrim = 'none',
  children,
}: PhotoProps) {
  const text = alt ?? photo.alt

  return (
    <div className={cn('relative isolate overflow-hidden bg-[color:var(--color-bed-mid)]', className)}>
      <img
        src={photo.src}
        alt={text}
        width={photo.width}
        height={photo.height}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        aria-hidden={text === '' || undefined}
        className="photo-grade absolute inset-0 h-full w-full object-cover"
      />
      {scrim !== 'none' && (
        <div
          aria-hidden="true"
          className={cn(
            'absolute inset-0',
            scrim === 'soft'
              ? 'bg-gradient-to-t from-[#14120e]/70 via-[#14120e]/25 to-transparent'
              : 'bg-[#14120e]/62',
          )}
        />
      )}
      {children}
    </div>
  )
}
