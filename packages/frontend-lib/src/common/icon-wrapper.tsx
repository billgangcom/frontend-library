import type React from 'react'
import { ccn } from '../utils/index.js'
const iconSizes = {
  sm: 'w-4 h-4',
  s: 'w-4 h-4',
  m: 'w-[21px] h-[21px]',
  l: 'w-[28px] h-[28px]',
}

const colorVariants = {
  brandDefault: 'fill-brandDefault',
  textPrimary: 'fill-textPrimary',
  textSecondary: 'fill-textSecondary',
  surface100: 'fill-surface100',
  signalDanger: 'fill-signalDanger',
}

const containerSizeClassNamesMap = {
  s: '',
  sm: 'icon-wrapper w-10 h-10',
  m: 'icon-wrapper w-11 h-11',
  l: 'icon-wrapper w-12 h-12',
}

type IconWrapperProps = {
  Icon?: React.FunctionComponent
  color?: keyof typeof colorVariants
  size?: keyof typeof iconSizes
  className?: string
}

export const IconWrapper = ({
  Icon,
  color = 'brandDefault',
  size = 's',
  className,
}: IconWrapperProps) => (
  <div className={ccn(containerSizeClassNamesMap[size], className)}>
    <div className={ccn(colorVariants[color], iconSizes[size], 'flex-center')}>
      {Icon && <Icon />}
    </div>
  </div>
)
