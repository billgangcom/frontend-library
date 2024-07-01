import React from 'react'

export enum IconPosition {
  Left = 0,
  Right = 1,
}

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  icon?: React.ReactNode
  iconPosition?: IconPosition
  className?: string
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    { icon = null, iconPosition = IconPosition.Left, className = '', ...props },
    ref,
  ) => (
    <div className={`relative flex items-center w-full ${className}`}>
      {icon && iconPosition === IconPosition.Left && (
        <div className="absolute inset-y-0 left-4 flex items-center">
          {icon}
        </div>
      )}

      <input
        ref={ref}
        className={`outline-brandDefault block h-12 w-full rounded-xl border-none bg-surface0 p-3 align-middle placeholder:text-surface200 ${
          icon ? (iconPosition === IconPosition.Left ? 'pl-9' : 'pr-10') : ''
        }`}
        {...props}
      />

      {icon && iconPosition === IconPosition.Right && (
        <div className="absolute inset-y-0 right-[14px] flex items-center">
          {icon}
        </div>
      )}
    </div>
  ),
)
