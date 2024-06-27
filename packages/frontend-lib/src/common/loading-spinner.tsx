import { ccn } from '../utils/index.js'

export const LoadingSpinner = () => {
  return (
    <div className="flex-center w-full h-full">
      <div
        className={ccn(
          'size-12',
          'border-4',
          'rounded-full',
          'border-x-borderDefault',
          'border-t-borderDefault',
          'border-b-transparent',
          'animate-spin',
        )}
      />
    </div>
  )
}
