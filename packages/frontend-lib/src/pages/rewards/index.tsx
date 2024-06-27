import { useAtom } from '@reatom/npm-react'
import { Bag, Confetti } from '../../assets/icons.js'
import { Button } from '../../common/button.js'
import { IconWrapper } from '../../common/icon-wrapper.js'
import { LoadingSpinner } from '../../common/loading-spinner.js'
import { NoItemsBlock } from '../../common/no-items-block.js'
import { PageTitle } from '../../common/page-title.js'

import { formatPrice } from '../../utils/index.js'
import {
  AchievementType,
  type CustomerReward,
  RewardType,
  getRewards,
} from './model.js'

export const Rewards = () => {
  const [rewards] = useAtom(getRewards.dataAtom)
  const [pending] = useAtom((ctx) => ctx.spy(getRewards.pendingAtom) > 0)
  const isEmpty = !rewards?.length
  const isLoadedAndFull = !pending && !isEmpty

  return (
    <>
      <PageTitle
        title="Rewards"
        description="To unlock an exclusive reward, complete everything on this checklist"
      />

      <div className="justify-between grid gap-4 grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
        {isLoadedAndFull &&
          rewards.map((item) => (
            <Achievement key={item.id} achievement={item} />
          ))}
      </div>
      {pending ? (
        <LoadingSpinner />
      ) : isEmpty ? (
        <NoItemsBlock
          title="Rewards are empty"
          description="Rewards will be collected here"
        />
      ) : null}
    </>
  )
}

const Achievement = ({ achievement }: { achievement: CustomerReward }) => {
  const [title, description] = formatAchievementTitleDescription(achievement)
  const [percentageProgress, progress, goal] =
    calculateProgressPercentageAndComplete(achievement)

  const isComplete = progress === goal
  return (
    <div className="flex flex-col border border-borderDefault rounded-2xl p-6 items-center">
      <CircularProgress percentage={percentageProgress} />
      <div
        className={`mt-3 rounded-xl px-2 py-1 items-start flex ${
          isComplete
            ? 'text-brandDefault bg-brandLight'
            : 'text-textSecondary bg-surface0'
        }`}
      >
        {isComplete ? (
          <div className="flex items-center">
            <Confetti /> <span className="ml-1">Completed!</span>
          </div>
        ) : (
          `Done: ${progress} / ${goal}`
        )}
      </div>

      <span className="items-center font-semibold flex mb-1 mt-4">
        <IconWrapper className="icon-wrapper w-6 h-6 rounded-lg" Icon={Bag} />
        <div className="ml-2 text-center">{title}</div>
      </span>
      <span className="bg-surface100 text-center mb-4 text-sm">
        {description}
      </span>
      <Button
        variant={isComplete ? 'primary' : 'secondary'}
        className="w-full mt-auto"
      >
        {isComplete ? 'Claim' : getButtonText(achievement)}
      </Button>
    </div>
  )
}

type CircularProgressProps = {
  percentage: number
  radius?: number
  strokeWidth?: number
}

const CircularProgress: React.FC<CircularProgressProps> = ({
  percentage,
  radius = 40,
  strokeWidth = 8,
}) => {
  const normalisedRadius = radius + strokeWidth / 2
  const diameter = normalisedRadius * 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (percentage / 100) * circumference

  return (
    <div
      style={{ width: diameter, height: diameter }}
      className="flex items-center justify-center overflow-hidden"
    >
      <svg aria-hidden="true" width={diameter} height={diameter}>
        <circle
          cx={normalisedRadius}
          cy={normalisedRadius}
          r={radius}
          fill="transparent"
          className="stroke-borderDefault"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={normalisedRadius}
          cy={normalisedRadius}
          r={radius}
          fill="transparent"
          strokeWidth={strokeWidth}
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={offset}
          className="stroke-brandDefault"
          transform={`rotate(-90 ${normalisedRadius} ${normalisedRadius})`}
        />
      </svg>
      <span className="absolute text-lg font-bold text-brandDefault">
        {percentage}%
      </span>
    </div>
  )
}

const formatAchievementReward = (achievement: CustomerReward): string => {
  switch (achievement.rewardRule.rewardType) {
    case RewardType.Balance:
      return `${formatPrice(
        achievement.rewardRule.rewardOptions.balance,
      )} on the balance`
    case RewardType.Product:
      return `products: ${achievement.rewardRule.rewardOptions.productsWithVariants
        .map(
          (product) =>
            `${product.quantity} ${product.productName} (${product.variantName})`,
        )
        .join()}`
  }
}
const getButtonText = (achievement: CustomerReward): string => {
  switch (achievement.rewardRule.rewardType) {
    case RewardType.Balance:
      return formatPrice(achievement.rewardRule.rewardOptions.balance)
    case RewardType.Product:
      return `${achievement.rewardRule.rewardOptions.productsWithVariants
        .map(
          (product) =>
            `${product.quantity} ${product.productName} (${product.variantName})`,
        )
        .join()}`
  }
}
const formatAchievementDescription = (achievement: CustomerReward): string => {
  switch (achievement.rewardRule.ruleType) {
    case AchievementType.Spend:
      return `Spend $${
        achievement.rewardRule.ruleOptions.forEach
      } in total purchases at our store to receive a reward of ${formatAchievementReward(
        achievement,
      )}. You've spent $${achievement.progress} so far.`

    case AchievementType.Order:
      return `Place ${
        achievement.rewardRule.ruleOptions.ordersCount
      } orders to receive a reward of ${formatAchievementReward(
        achievement,
      )}. You've made ${achievement.progress} orders so far.`

    case AchievementType.Referral:
      return `On your referral link should sign up ${
        achievement.rewardRule.ruleOptions.minReferrals
      } people and make at least ${
        achievement.rewardRule.ruleOptions.minCompletedOrders
      } purchase to receive a reward of ${formatAchievementReward(
        achievement,
      )}. You've referred ${achievement.progress} friends so far.`

    case AchievementType.Review:
      return `Leave ${
        achievement.rewardRule.ruleOptions.minReviews
      } reviews with a minimum rating of ${
        achievement.rewardRule.ruleOptions.minStars
      } to receive a reward of ${formatAchievementReward(
        achievement,
      )}. You've left ${achievement.progress} reviews so far.`
  }
}

const formatAchievementTitle = (achievement: CustomerReward): string => {
  switch (achievement.rewardRule.ruleType) {
    case AchievementType.Spend:
      return `Spend $${achievement.rewardRule.ruleOptions.forEach} at our store`

    case AchievementType.Order:
      return `Make ${achievement.rewardRule.ruleOptions.ordersCount} orders`

    case AchievementType.Referral:
      return `Refer ${achievement.rewardRule.ruleOptions.minReferrals} friends to our store`

    case AchievementType.Review:
      return `Leave ${achievement.rewardRule.ruleOptions.minReviews} reviews with a minimum rating of ${achievement.rewardRule.ruleOptions.minStars}`
  }
}

const formatAchievementTitleDescription = (
  achievement: CustomerReward,
): [string, string] => {
  return [
    formatAchievementTitle(achievement),
    formatAchievementDescription(achievement),
  ]
}

const calculateProgressPercentageAndComplete = (
  achievement: CustomerReward,
): [number, number, number] => {
  let goal: number
  switch (achievement.rewardRule.ruleType) {
    case AchievementType.Spend:
      goal = achievement.rewardRule.ruleOptions.forEach
      break
    case AchievementType.Order:
      goal = achievement.rewardRule.ruleOptions.ordersCount
      break
    case AchievementType.Referral:
      goal = achievement.rewardRule.ruleOptions.minReferrals
      break
    case AchievementType.Review:
      goal = achievement.rewardRule.ruleOptions.minReviews
      break
  }
  const percentage =
    Math.round(((achievement.progress / goal) * 100 + Number.EPSILON) * 100) /
    100
  return [percentage, achievement.progress, goal]
}

type AchievementProps = {
  achievement: CustomerReward
}
