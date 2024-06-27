import { onConnect, reatomAsync, withDataAtom } from '@reatom/framework'
import { z } from 'zod'

import { fetchHome } from '../../api/index.js'
import { PriceSchema, parseResult } from '../../utils/index.js'

const ImageSchema = z.object({
  id: z.number(),
  cfId: z.string(),
})

const ProductSchema = z.object({
  name: z.string(),
  image: ImageSchema,
  amountSpentUsd: z.number().optional(),
  purchasedTimes: z.number().int(),
})

const HomeSchema = z.object({
  totalSpent: z.number(),
  totalPurchases: z.number().int(),
  averageReview: z.number(),
  visits: z.number().int(),
  createdAt: z.string().datetime(),
  ratingPlacement: z.number().int(),
  balance: PriceSchema.optional(),
  spendMoreUsdForNextPlace: z.number(),
  topSpenderProduct: ProductSchema.optional(),
  favoriteProduct: ProductSchema.optional(),
})

export type HomeType = z.infer<typeof HomeSchema>

export const getHome = reatomAsync(async () =>
  parseResult(await fetchHome(), HomeSchema),
).pipe(withDataAtom(null))

onConnect(getHome.dataAtom, getHome)
