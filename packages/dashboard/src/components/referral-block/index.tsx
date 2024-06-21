import { useAtom } from '@reatom/npm-react'
import { Copy } from '../../assets/icons.js'
import { LoadingSpinner } from '../../common/loading-spinner.js'
import { getReferral } from './model.js'
import ReferralList from './referral-list.js'
import ReferralModal from './referral-modal.js'

const ReferralBlock = () => {
  const [data] = useAtom(getReferral.dataAtom)
  const [pending] = useAtom((ctx) => ctx.spy(getReferral.pendingAtom))
  if (pending) return <LoadingSpinner />
  if (!data) return null
  const { isAvailable, isActivated, info } = data.data
  const referralCode = info?.referralCode
  if (!isAvailable) return null
  const affiliateLink = `https://demo.sellpass.io/?r=${referralCode}`
  return (
    <div className="col-span-2 lg:col-span-4 row-span-2">
      <div className="h-full rounded-xl border border-borderDefault p-6">
        <div className="text-xxl font-bold">Refer friends</div>
        <div className="mb-3 text-textSecondary">
          Refer friends. Earn rewards. Make bank.
        </div>
        {isActivated ? (
          <>
            <div className="text-sm text-textSecondary mb-1">
              Affiliate Code
            </div>
            <div className="rounded-xl bg-surface0 text-textPrimary border-textPrimary p-3 mb-4">
              {referralCode}
            </div>
            <div className="text-sm text-textSecondary mb-1">
              Affiliate Link
            </div>
            <div className="rounded-xl bg-surface0 text-textPrimary border-textPrimary p-3 flex justify-between">
              <div>{affiliateLink}</div>
              <button
                type="button"
                onClick={() => navigator.clipboard.writeText(affiliateLink)}
              >
                <Copy />
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="mb-6">
              <ReferralModal />
            </div>
            <ReferralList />
          </>
        )}
      </div>
    </div>
  )
}
export default ReferralBlock
