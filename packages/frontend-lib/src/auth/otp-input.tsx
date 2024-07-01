import { OTPInput, type SlotProps } from 'input-otp'
import { forwardRef } from 'react'
import { ccn } from '../utils/index.js'

type AuthOTPInputType = {
  value?: string
  onChange?: (newValue: string) => unknown
  onComplete?: (...args: unknown[]) => unknown
}

export const AuthOTPInput = forwardRef<HTMLInputElement, AuthOTPInputType>(
  ({ value, onChange, onComplete }, ref) => {
    return (
      <OTPInput
        ref={ref}
        {...{ value, onChange, onComplete }}
        maxLength={6}
        containerClassName="group flex items-center bg-surface0 mt-1 rounded-xl"
        render={({ slots }) => (
          <div className="flex w-full">
            {slots.map((slot) => (
              <Slot key={crypto.randomUUID()} {...slot} />
            ))}
          </div>
        )}
      />
    )
  },
)

function Slot({ char, isActive }: SlotProps) {
  return (
    <div
      className={ccn(
        'relative w-[calc(100%/6)] sm:w-20 h-12',
        'flex items-center justify-center',
        'transition-all duration-300',
        'border-border border-r last:border-r-0 first:rounded-l-xl last:rounded-r-xl',
        'group-hover:border-brandDefault/20 group-focus-within:border-brandDefault/20',
        'outline outline-0 outline-brandDefault/20',
        isActive && 'outline-2 outline-brandDefault',
      )}
    >
      {char ? <div>{char}</div> : <div className="text-surface200">0</div>}
    </div>
  )
}
