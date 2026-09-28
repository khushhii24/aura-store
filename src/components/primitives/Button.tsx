import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { cn } from '@/lib/cn'

export type ButtonVariant = 'solid' | 'outline' | 'quiet' | 'invert' | 'invert-outline'
export type ButtonSize = 'sm' | 'md' | 'lg'

const VARIANT: Record<ButtonVariant, string> = {
  solid: 'btn-solid',
  outline: 'btn-outline',
  quiet: 'btn-quiet',
  invert: 'btn-invert',
  'invert-outline': 'btn-invert-outline',
}

const SIZE: Record<ButtonSize, string> = {
  sm: 'btn-sm',
  md: 'btn-md',
  lg: 'btn-lg',
}

/**
 * Buttons are class-driven so a `<Link>` can wear exactly the same styles
 * without a polymorphic component. One set of rules, two elements.
 */
export const buttonClass = (
  variant: ButtonVariant = 'solid',
  size: ButtonSize = 'md',
  className?: string,
) => cn('btn', VARIANT[variant], SIZE[size], className)

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  children: ReactNode
}

export function Button({ variant, size, className, children, ...rest }: ButtonProps) {
  return (
    <button type="button" className={buttonClass(variant, size, className)} {...rest}>
      {children}
    </button>
  )
}
