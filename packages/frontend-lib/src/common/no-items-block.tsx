import { InfoCircle } from '../assets/icons.js'
import { ccn } from '../utils/index.js'
type NoItemsBlockProps = {
  title: string
  description: string
}

export const NoItemsBlock = ({ title, description }: NoItemsBlockProps) => (
  <div className={ccn('flex-center', 'flex-1', 'flex-col')}>
    <InfoCircle />
    <div className="font-bold text-textSecondary mt-3 mb-1">{title}</div>
    <div className="text-textSecondary">{description}</div>
  </div>
)
