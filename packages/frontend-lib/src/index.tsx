import { atom, createCtx } from '@reatom/framework'
import { reatomContext } from '@reatom/npm-react'
import { type ReactNode, useLayoutEffect } from 'react'
import { Toaster } from 'sonner'
import { getOrder, getOrderWithToken, postOrders } from './api/orders.js'
import App from './app/index.js'
import { ReCaptchaProvider } from './utils/recapcha.js'

export const ctx = createCtx()
export const shopDomenAtom = atom('')
export const shopIdAtom = atom('')

type CustomerDashboardType = {
  shopDomen: string
  shopId: string
  children: ReactNode
}

export const BillgangProvider = ({
  children,
  shopDomen,
  shopId,
}: CustomerDashboardType) => {
  useLayoutEffect(() => {
    shopDomenAtom(ctx, shopDomen)
    shopIdAtom(ctx, shopId)
  }, [shopDomen, shopId])

  return <reatomContext.Provider value={ctx}>{children}</reatomContext.Provider>
}

export const CustomerDashboard = () => {
  return (
    <ReCaptchaProvider>
      <App />
      <Toaster richColors closeButton />
    </ReCaptchaProvider>
  )
}

export { getOrder, getOrderWithToken, postOrders }
