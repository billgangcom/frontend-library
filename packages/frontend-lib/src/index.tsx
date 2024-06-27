import { atom, createCtx } from '@reatom/framework'
import { reatomContext } from '@reatom/npm-react'
import { useLayoutEffect } from 'react'
import { Toaster } from 'sonner'
import { ordersMethods } from './api/orders.js'
import App from './app/index.js'
import { ReCaptchaProvider } from './utils/recapcha.js'

export const ctx = createCtx()
export const shopDomenAtom = atom('')
export const shopIdAtom = atom('')
export type CustomerDashboardType = {
  shopDomen: string
  shopId: string
}

export const CustomerDashboard = ({
  shopDomen,
  shopId,
}: CustomerDashboardType) => {
  useLayoutEffect(() => {
    shopDomenAtom(ctx, shopDomen)
    shopIdAtom(ctx, shopId)
  }, [shopDomen, shopId])

  return (
    <reatomContext.Provider value={ctx}>
      <ReCaptchaProvider>
        <App />
        <Toaster richColors closeButton />
      </ReCaptchaProvider>
    </reatomContext.Provider>
  )
}

export const getOrdersMethods = ordersMethods
