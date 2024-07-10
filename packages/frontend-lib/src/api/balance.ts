import { onConnect, reatomAsync, withDataAtom } from '@reatom/framework'
import { z } from 'zod'
import {
  fetchBalance,
  fetchBalanceSettings,
  fetchGatewaysDetail,
} from './index.js'

import { parseResult } from '../utils/index.js'
export enum PaymentMethod {
  BankCard = 'BANK_CARD',
  BankTransfer = 'BANK_TRANSFER',
  PayPal = 'PAYPAL',
  CashApp = 'CASHAPP',
  Crypto = 'CRYPTO',
  AppleGooglePay = 'APPLE_AND_GOOGLE_PAY',
  Custom = 'CUSTOM',
}

export const GatewayDetailSchema = z.array(
  z.object({
    name: z.string(),
    displayName: z.string(),
    logoCfImageId: z.string(),
    poweredByImageCfImageId: z.string().optional(),
    paymentMethods: z.array(z.nativeEnum(PaymentMethod)),
  }),
)
export type GatewayDetail = z.infer<typeof GatewayDetailSchema>

export const getGatewaysDetail = reatomAsync(async (_, gateways) =>
  parseResult(await fetchGatewaysDetail(gateways), GatewayDetailSchema),
).pipe(withDataAtom(null))

const BaseTopUpSettingsSchema = z.object({
  gateways: z.array(z.string()),
  currency: z.string(),
})

const TopUpBonusEnabledSchema = z.object({
  topUpBonusEnabled: z.literal(true),
  minimumTopUpForBonus: z.number(),
  bonusPercent: z.number().int(),
})

const TopUpBonusDisabledSchema = z.object({
  topUpBonusEnabled: z.literal(false),
  minimumTopUpForBonus: z.number().optional(),
  bonusPercent: z.number().int().optional(),
})

const CashbackEnabledSchema = z.object({
  cashbackEnabled: z.literal(true),
  cashbackPercent: z.number().int(),
})

const CashbackDisabledSchema = z.object({
  cashbackEnabled: z.literal(false),
  cashbackPercent: z.number().int().optional(),
})

const TopUpSettingsSchema = BaseTopUpSettingsSchema.and(
  TopUpBonusEnabledSchema.or(TopUpBonusDisabledSchema).and(
    CashbackEnabledSchema.or(CashbackDisabledSchema),
  ),
)

const BalanceTopUpSettingsDisabledSchema = z.object({
  isEnabled: z.literal(false),
})
const BalanceTopUpSettingsEnabledSchema = z.object({
  isEnabled: z.literal(true),
  topUpSettings: TopUpSettingsSchema,
})
const BalanceTopUpSettingsSchema = BalanceTopUpSettingsEnabledSchema.or(
  BalanceTopUpSettingsDisabledSchema,
)
export type BalanceTopUpSettings = z.infer<typeof BalanceTopUpSettingsSchema>

export const getBalanceSettings = reatomAsync(async (ctx) => {
  const res = parseResult(
    await fetchBalanceSettings(),
    BalanceTopUpSettingsSchema,
  )
  if (res.isEnabled) {
    const gateways = res?.topUpSettings?.gateways
    gateways && getGatewaysDetail(ctx, gateways)
  }

  return res
}).pipe(withDataAtom(null))

onConnect(getBalanceSettings.dataAtom, getBalanceSettings)

const BalanceScheme = z.object({
  currency: z.string(),
  manualBalance: z.number(),
  realBalance: z.number(),
})

export const getBalance = reatomAsync(async () => {
  const result = parseResult(await fetchBalance(), BalanceScheme)
  return {
    amount: result.realBalance + result.manualBalance,
    currency: result.currency,
  }
}).pipe(withDataAtom(null))
onConnect(getBalance.dataAtom, getBalance)
