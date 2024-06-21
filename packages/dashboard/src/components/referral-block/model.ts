import { onConnect, reatomAsync, withDataAtom } from '@reatom/framework'
import { z } from 'zod'

import { fetchReferral, signupReferral } from '../../api/index.js'
import { getHome } from '../../pages/home/model.js'
import { parseResult } from '../../utils/index.js'

const ReferralSchema = z.object({
  data: z.object({
    isAvailable: z.boolean(),
    isActivated: z.boolean(),
    earnPercent: z.number().optional(),
    info: z
      .object({
        referralCode: z.string(),
        totalReferrals: z.number(),
        totalRevenueUsd: z.number(),
      })
      .optional(),
  }),
})
export type ReferralType = z.infer<typeof ReferralSchema>

export const getReferral = reatomAsync(async () =>
  parseResult(await fetchReferral(), ReferralSchema),
).pipe(withDataAtom(null))
export const postReferral = reatomAsync(async (ctx, body) => {
  await signupReferral(body)
  await getHome(ctx)
}).pipe(withDataAtom(null))

onConnect(getReferral.dataAtom, getReferral)
