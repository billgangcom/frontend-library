import { useAtom } from '@reatom/npm-react'
import { getBalance } from '../../api/balance.js'
import { formatPrice } from '../../utils/index.js'
import Card from './card.js'
import { getDashInfo } from './model.js'
import NavList from './nav-list.js'

export const Sidebar = () => {
  const [dashInfo] = useAtom(getDashInfo.dataAtom)
  const [balance] = useAtom(getBalance.dataAtom)
  console.log({ dashInfo, balance })

  if (!dashInfo || !balance) {
    return null
  }

  return (
    <div className="w-full xl:border-r border-borderDefault px-4 xl:py-6 xl:max-w-[320px] xl:pr-4">
      <Card email={dashInfo.email} balance={formatPrice(balance)} />
      <NavList />
    </div>
  )
}
