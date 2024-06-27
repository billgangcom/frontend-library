import { useAtom } from '@reatom/npm-react'

import { getBalanceSettings } from '../../api/balance.js'
import {
  Bag,
  Billgang,
  Calendar,
  Crown,
  D4RK,
  Eye,
  Heart,
  Medal,
  SealDollar,
  Star,
  TopArrow,
} from '../../assets/icons.js'
import { IconWrapper } from '../../common/icon-wrapper.js'
import { LoadingSpinner } from '../../common/loading-spinner.js'
// import ChartItem from '../../components/chart-item/index.js'
import ReferralBlock from '../../components/referral-block/index.js'
import StatItem from '../../components/stat-item/index.js'
import {
  convertCfImageIdToUrl,
  formatPrice,
  formatTimestamp,
} from '../../utils/index.js'
import { getHome } from './model.js'

const POWERED_BY = 'Billgang'
const STORE = 'D4RK'

const StatContainer = ({ children }: { children: React.ReactNode }) => (
  <div className="gap-2 lg:gap-4 grid grid-cols-2 lg:grid-cols-1 col-span-2 lg:col-span-1 ">
    {children}
  </div>
)
export const Home = () => {
  const [data] = useAtom(getHome.dataAtom)
  const [pending] = useAtom((ctx) => ctx.spy(getHome.pendingAtom))

  useAtom(getBalanceSettings.dataAtom)

  if (pending) return <LoadingSpinner />
  if (!data) return null

  return (
    <div className="grid w-full gap-4 grid-cols-2 lg:grid-cols-4 lg:pb-6">
      <ReferralBlock />
      {/* <ChartItem
      title="Referrals"
      value={charts.referrals}
      data={charts.data}
      />
      <ChartItem
      title="Earned" value={charts.earned} data={charts.data}
      />
      <ChartItem
      title="Total Revenue"
      value={charts.totalRevenue}
      data={charts.data}
      />
      <ChartItem
      title="Earn Percent"
      value={charts.earnPercent}
      data={charts.data}
      />

      <div className="col-span-1 h-6 text-lg font-bold sm:col-span-2 lg:col-span-4">
        Your statistics
      </div> */}
      <StatContainer>
        <StatItem
          Icon={Calendar}
          title="Customer since"
          value={formatTimestamp(data.createdAt)}
        />
        <StatItem
          Icon={SealDollar}
          title="Total spent"
          value={formatPrice({ amount: data.totalSpent })}
        />
        <StatItem Icon={Medal} title="Top" value={`#${data.ratingPlacement}`}>
          <div className="text-xs text-textSecondary flex items-center mt-2">
            <IconWrapper Icon={TopArrow} className="mx-1" />
            Spend ${data.spendMoreUsdForNextPlace} more to be #
            {data.ratingPlacement + 1}
          </div>
        </StatItem>
        <StatItem
          Icon={Star}
          title="Average review"
          value={data.averageReview}
        />
      </StatContainer>

      {data.topSpenderProduct && (
        <StatItem
          className="col-span-2 lg:col-span-1"
          image={convertCfImageIdToUrl(data.topSpenderProduct.image.cfId)}
          imageName={data.topSpenderProduct.name}
          Icon={Crown}
          title="Top spent"
          value={`${formatPrice({
            amount: data.topSpenderProduct.amountSpentUsd || 0,
          })} spent`}
        />
      )}
      <StatContainer>
        <StatItem Icon={Bag} title="Purchases" value={data.totalPurchases} />
        <StatItem Icon={Eye} title="Visits" value={data.visits} />
        <StatItem Icon={Billgang} title="Powered by" value={POWERED_BY} />
        <StatItem Icon={D4RK} title="Store" value={STORE} />
      </StatContainer>
      {data.favoriteProduct && (
        <StatItem
          image={convertCfImageIdToUrl(data.favoriteProduct.image.cfId)}
          imageName={data.favoriteProduct.name}
          Icon={Heart}
          title="Favorite product"
          value={`bought ${data.favoriteProduct.purchasedTimes} times`}
        />
      )}
    </div>
  )
}
