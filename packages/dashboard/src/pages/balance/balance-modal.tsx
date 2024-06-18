import * as Ariakit from '@ariakit/react'
import { useAction, useAtom } from '@reatom/npm-react'
import { z } from 'zod'

import { Button } from '../../common/button.js'
import { IconWrapper } from '../../common/icon-wrapper.js'
import { Input } from '../../common/input.js'
import { LoadingSpinner } from '../../common/loading-spinner.js'
import { Modal } from '../../common/modal.js'

import {
  type BalanceTopUpSettings,
  getGatewaysDetail,
} from '../../api/balance.js'
import {
  // ApplePayGooglePay,
  // CashApp,
  // Cryptocurrency,
  // DebitCreditCard,
  DocumentCloud,
  Dollar,
  Fire,
  // PayPal,
  Plus,
  ShieldSearch,
} from '../../assets/icons.js'
import { ccn, convertCfImageIdToUrl, formatPrice } from '../../utils/index.js'
import { validateFormStore } from '../../utils/validateFormStore.js'
import { requestTopUpBalance } from './model.js'

// const gateways = [
//   {
//     name: 'Cryptocurrency',
//     icon: <Cryptocurrency />,
//   },
//   {
//     name: 'Debit / Credit Card',
//     icon: <DebitCreditCard />,
//   },
//   {
//     name: 'Cash App',
//     icon: <CashApp />,
//   },
//   {
//     name: 'PayPal',
//     icon: <PayPal />,
//   },
//   {
//     name: 'Apple Pay / Google Pay',
//     icon: <ApplePayGooglePay />,
//   },
// ]

const balanceValidation = z.object({
  amount: z.coerce
    .number({ message: 'The balance field should be number.' })
    .min(1, { message: 'The balance field cannot be empty.' }),
  gateway: z.string().min(1, { message: 'Select pay method' }),
})
const BonusBlock = ({
  enterAnother,
  bonusPercent,
  currency,
}: { enterAnother: number; bonusPercent: number; currency: string }) => (
  <div className="text-sm text-brandDefault py-2 px-3 inline-flex bg-surface0 rounded-xl mt-3 mb-4">
    <Fire />
    <div className="ml-2">
      {enterAnother > 0 || Number.isNaN(enterAnother)
        ? `Enter another ${formatPrice({
            amount: enterAnother,
            currency,
          })} and receive an additional bonus of
          ${bonusPercent}%`
        : `You will receive an additional bonus of
          ${bonusPercent}%`}
    </div>
  </div>
)

export const BalanceModal = (balanceSettings: BalanceTopUpSettings) => {
  const [gatewaysDetail] = useAtom(getGatewaysDetail.dataAtom)
  const [pending] = useAtom(requestTopUpBalance.pendingAtom)
  const formStore = Ariakit.useFormStore({
    defaultValues: { amount: '', gateway: '' },
  })
  const topUp = useAction(requestTopUpBalance)

  const dialogStore = Ariakit.useDialogStore({ defaultOpen: false })
  formStore.useSubmit(async () => {
    const order = await topUp({ price: { amount, currency }, gateway })
    console.log({ order })
    dialogStore.hide()
  })
  const gateway = formStore.useValue(formStore.names.gateway)
  const amount = formStore.useValue(formStore.names.amount)

  formStore.useValidate((state) =>
    validateFormStore(state, balanceValidation, formStore),
  )
  if (!balanceSettings || !balanceSettings?.isEnabled) {
    return null
  }
  const {
    topUpSettings: {
      currency,
      topUpBonusEnabled,
      bonusPercent,
      minimumTopUpForBonus,
    },
  } = balanceSettings
  const parsedAmount = Number(amount)
  const enterAnother =
    topUpBonusEnabled && !Number.isNaN(parsedAmount)
      ? minimumTopUpForBonus - Number(parsedAmount)
      : minimumTopUpForBonus

  return (
    <>
      <Button
        onClick={dialogStore.show}
        className="mr-4 flex-center mb-2 md:mb-0 w-full md:w-auto"
      >
        <IconWrapper color="surface100" Icon={Plus} />
        <span className="ml-1">Add balance</span>
      </Button>
      <Modal store={dialogStore} title="Top Up Account Balance">
        <Ariakit.Form store={formStore}>
          <Ariakit.FormLabel
            className="text-sm text-textSecondary"
            name={formStore.names.amount}
          >
            Enter Amount
          </Ariakit.FormLabel>
          <Ariakit.FormInput
            name={formStore.names.amount}
            render={<Input placeholder="0" icon={<Dollar />} />}
          />
          <Ariakit.FormError
            className="text-signalDanger"
            name={formStore.names.amount}
          />
          {topUpBonusEnabled && enterAnother !== undefined && (
            <BonusBlock {...{ enterAnother, bonusPercent, currency }} />
          )}
          {gatewaysDetail && (
            <div className="pt-6 mt-6 border-borderDefault border-t w-full grid gap-3 grid-cols-2">
              {gatewaysDetail.map((e, index) => (
                <button
                  type="button"
                  key={e.name}
                  className={ccn(
                    'p-4 rounded-2xl border flex flex-col justify-start',
                    gateway === e.name
                      ? 'border-brandDefault'
                      : 'border-borderDefault',
                    gatewaysDetail.length - 1 === index && 'col-span-2',
                  )}
                  onClick={() =>
                    formStore.setValue(formStore.names.gateway, e.name)
                  }
                >
                  <img
                    alt={e.displayName}
                    src={convertCfImageIdToUrl(e.logoCfImageId)}
                    className="mb-4 w-6 h-6"
                  />
                  <div>{e.displayName}</div>
                </button>
              ))}
            </div>
          )}
          <Ariakit.FormError
            className="text-signalDanger mb-4"
            name={formStore.names.gateway}
          />
          <Ariakit.FormSubmit
            render={
              <Button className="w-full mt-10 mb-4 h-11 py-3">
                Continue to Checkout
              </Button>
            }
          />
          {pending ? <LoadingSpinner /> : null}
          <div className="p-3 bg-surface0 flex rounded-xl items-center mb-4">
            <div className="h-[20px] w-[20px] mr-[10px] flex-center">
              <DocumentCloud />
            </div>
            <div className="text-xs text-textSecondary">
              By continuing to checkout, you agree to our terms of service and
              allow us to charge your payment method for this order.
            </div>
          </div>
          <div className="p-3 bg-surface0 flex rounded-xl items-center">
            <div className="h-[20px] w-[20px] mr-[10px] flex-center">
              <ShieldSearch />
            </div>
            <div className="text-xs text-textSecondary">
              Your data is secured by extended validation SSL certificates
              (256-bit encryption). This complies with the strongest payment
              security standard available today.
            </div>
          </div>
        </Ariakit.Form>
      </Modal>
    </>
  )
}
