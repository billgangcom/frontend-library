import React from 'react'
import { ccn } from '../utils/index.js'

export type DialogProps = React.ComponentPropsWithoutRef<'div'>

export const Dialog = React.forwardRef<HTMLDivElement, DialogProps>(
  ({ className, style, ...props }, ref) => {
    return (
      <div
        ref={ref}
        {...props}
        className={ccn(
          'fixed',
          'inset-4',
          'm-auto',
          'z-50',
          'h-fit',
          'overflow-x-auto',
          'rounded-3xl',
          'bg-white',
          className,
        )}
        style={{
          maxHeight: 'calc(100vh - 2 * 12px)',
          maxWidth: 650,
          ...style,
        }}
      />
    )
  },
)
