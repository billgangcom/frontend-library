import { atom, onConnect, reatomAsync, withDataAtom } from '@reatom/framework'
import { z } from 'zod'

import { fetchTransactions, postBalanceTopUp } from '../../api/index.js'

import { getDashInfo } from '../../components/sidebar/model.js'
import { PriceSchema, parseResult } from '../../utils/index.js'
export const pageNumberAtom = atom(1)
export enum TransactionStatus {
  Added = 'ADDED',
  Removed = 'REMOVED',
}
const TransactionScheme = z.object({
  id: z.string().uuid(),
  price: PriceSchema,
  createdAt: z.string().datetime(),
  description: z.string(),
  status: z.nativeEnum(TransactionStatus),
})

const ResultScheme = z.object({
  list: z.array(TransactionScheme),
  totalCount: z.number(),
})

export type Transaction = z.infer<typeof TransactionScheme>

export const getTransactions = reatomAsync(async (ctx) =>
  parseResult(
    await fetchTransactions({ PageNumber: ctx.get(pageNumberAtom) }),
    ResultScheme,
  ),
).pipe(withDataAtom(null))

pageNumberAtom.onChange((ctx) => {
  getTransactions(ctx)
})

onConnect(getTransactions.dataAtom, getTransactions)

const RequestTopUpBalanceSchema = z.object({
  data: z.object({
    chargeId: z.string(),
  }),
})

export const requestTopUpBalance = reatomAsync(
  async (ctx, { price, gateway }) =>
    parseResult(
      await postBalanceTopUp({
        customerEmail: ctx.get(getDashInfo.dataAtom)?.email ?? '',
        price,
        gateway,
      }),
      RequestTopUpBalanceSchema,
    ),
).pipe(withDataAtom(null))
