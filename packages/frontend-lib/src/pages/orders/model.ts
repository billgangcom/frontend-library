import { atom, onConnect, reatomAsync, withDataAtom } from '@reatom/framework'
import { z } from 'zod'

import { fetchOrders } from '../../api/index.js'
import { PriceSchema, parseResult } from '../../utils/index.js'

export const pageNumberAtom = atom(1)

export enum OrderStatus {
  New = 'NEW',
  Pending = 'PENDING',
  Completed = 'COMPLETED',
  Cancelled = 'CANCELLED',
  Expired = 'EXPIRED',
  FullDeliveryFailure = 'FULL_DELIVERY_FAILURE',
  PartiallyDelivered = 'PARTIALLY_DELIVERED',
  Refunded = 'REFUNDED',
  Failed = 'FAILED',
}

const OrderItemSchema = z.object({
  id: z.string(),
  status: z.nativeEnum(OrderStatus),
  price: PriceSchema,
  gatewayName: z.string(),
  time: z.string(),
  review: z
    .object({
      rating: z.number(),
    })
    .optional(),
})

export type OrderItem = z.infer<typeof OrderItemSchema>

const ResultScheme = z.object({
  list: z.array(OrderItemSchema),
  totalCount: z.number(),
})

export const getOrders = reatomAsync(async (ctx) =>
  parseResult(
    await fetchOrders({ PageNumber: ctx.get(pageNumberAtom) }),
    ResultScheme,
  ),
).pipe(withDataAtom(null))

pageNumberAtom.onChange((ctx) => {
  getOrders(ctx)
})

onConnect(getOrders.dataAtom, getOrders)
