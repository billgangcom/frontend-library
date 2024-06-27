import { onConnect, reatomAsync, withDataAtom } from '@reatom/framework'
import { z } from 'zod'

import { fetchDashInfo } from '../../api/index.js'
import { parseResult } from '../../utils/index.js'

const DashSchema = z.object({
  email: z.string(),
})
export const getDashInfo = reatomAsync(async () =>
  parseResult(await fetchDashInfo(), DashSchema),
).pipe(withDataAtom(null))

onConnect(getDashInfo.dataAtom, getDashInfo)
