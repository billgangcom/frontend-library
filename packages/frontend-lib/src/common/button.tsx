import React from 'react'
import { twMerge } from 'tailwind-merge'
import { ccn } from '../utils/index.js'

const variants = {
  primary: ccn(
    'bg-brandDefault',
    'text-surface100',
    'border-brandDefault',
    'border',
  ),
  primaryRounded: ccn(
    'bg-surface0',
    'text-brandDefault',
    'border-brandDefault',
    'border',
  ),
  secondary: ccn('bg-surface0', 'text-textPrimary'),
}

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: keyof typeof variants
  className?: string
  isSquare?: boolean
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', className, isSquare = false, ...props }, ref) => (
    <button
      className={twMerge(
        ccn(
          'rounded-xl',
          'py-2',
          'px-4',
          'text-sm',
          'disabled:opacity-50',
          'flex-center',
          'flex-shrink-0',
        ),
        variants[variant],
        isSquare ? 'w-8 h-8 p-0 flex-center rounded-lg' : 'w-fit h-9',
        className,
      )}
      {...props}
      ref={ref}
    />
  ),
)
