import { onConnect, reatomAsync, withDataAtom } from '@reatom/framework'
import { z } from 'zod'
import { fetchRewards } from '../../api/index.js'
import { PriceSchema, parseResult } from '../../utils/index.js'

export enum RewardType {
  Balance = 'BALANCE',
  Product = 'PRODUCT',
}

export enum AchievementType {
  Spend = 'SPEND_AMOUNT',
  Order = 'ORDER_COUNT',
  Referral = 'REFER_FRIEND',
  Review = 'LEAVE_REVIEW',
}

const ProductVariantsSchema = z.object({
  id: z.number(),
  variantId: z.number(),
  productName: z.string(),
  variantName: z.string(),
  quantity: z.number(),
})

const BalanceRewardOptionsSchema = z.object({
  balance: PriceSchema,
})

const ProductRewardsOptionsSchema = z.object({
  productsWithVariants: z.array(ProductVariantsSchema),
})

const RewardRuleSchema = z.union([
  z.object({
    id: z.number(),
    rewardType: z.literal(RewardType.Balance),
    rewardOptions: BalanceRewardOptionsSchema,
    ruleType: z.literal(AchievementType.Spend),
    ruleOptions: z.object({
      forEach: z.number(),
    }),
  }),
  z.object({
    id: z.number(),
    rewardType: z.literal(RewardType.Balance),
    rewardOptions: BalanceRewardOptionsSchema,
    ruleType: z.literal(AchievementType.Order),
    ruleOptions: z.object({
      ordersCount: z.number(),
    }),
  }),
  z.object({
    id: z.number(),
    rewardType: z.literal(RewardType.Balance),
    rewardOptions: BalanceRewardOptionsSchema,
    ruleType: z.literal(AchievementType.Referral),
    ruleOptions: z.object({
      minReferrals: z.number(),
      minCompletedOrders: z.number(),
    }),
  }),
  z.object({
    id: z.number(),
    rewardType: z.literal(RewardType.Balance),
    rewardOptions: BalanceRewardOptionsSchema,
    ruleType: z.literal(AchievementType.Review),
    ruleOptions: z.object({
      minReviews: z.number(),
      minStars: z.number(),
    }),
  }),
  z.object({
    id: z.number(),
    rewardType: z.literal(RewardType.Product),
    rewardOptions: ProductRewardsOptionsSchema,
    ruleType: z.literal(AchievementType.Spend),
    ruleOptions: z.object({
      forEach: z.number(),
    }),
  }),
  z.object({
    id: z.number(),
    rewardType: z.literal(RewardType.Product),
    rewardOptions: ProductRewardsOptionsSchema,
    ruleType: z.literal(AchievementType.Order),
    ruleOptions: z.object({
      ordersCount: z.number(),
    }),
  }),
  z.object({
    id: z.number(),
    rewardType: z.literal(RewardType.Product),
    rewardOptions: ProductRewardsOptionsSchema,
    ruleType: z.literal(AchievementType.Referral),
    ruleOptions: z.object({
      minReferrals: z.number(),
      minCompletedOrders: z.number(),
    }),
  }),
  z.object({
    id: z.number(),
    rewardType: z.literal(RewardType.Product),
    rewardOptions: ProductRewardsOptionsSchema,
    ruleType: z.literal(AchievementType.Review),
    ruleOptions: z.object({
      minReviews: z.number(),
      minStars: z.number(),
    }),
  }),
])

const CustomerRewardSchema = z.object({
  id: z.number(),
  progress: z.number(),
  createdAt: z.string(),
  completedAt: z.string().optional(),
  rewardRule: RewardRuleSchema,
})

export type CustomerReward = z.infer<typeof CustomerRewardSchema>

const CustomerRewardsSchema = z.array(CustomerRewardSchema)
export const getRewards = reatomAsync(async () =>
  parseResult(await fetchRewards(), CustomerRewardsSchema),
).pipe(withDataAtom(null))

onConnect(getRewards.dataAtom, getRewards)
