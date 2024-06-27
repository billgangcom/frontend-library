type StepItemProps = {
  caption: string
  description: string
  index: number
  bar?: boolean
}

const StepItem: React.FC<StepItemProps> = ({
  caption,
  description,
  index,
  bar = true,
}) => (
  <div className="flex text-sm text-textSecondary">
    <div className="mb-1 mr-2 flex flex-col items-center">
      <div className="flex-center mb-1 h-6 w-6 rounded-full bg-borderDefault font-bold">
        {index}
      </div>
      {bar && <div className="h-[38px] w-1 rounded-2xl bg-borderDefault" />}
    </div>
    <div>
      <div className="mb-1 font-bold uppercase">{caption}</div>
      <div>{description}</div>
    </div>
  </div>
)

type ReferralStep = {
  caption: string
  description: string
}

const referralSteps: ReferralStep[] = [
  {
    caption: 'Share link',
    description: 'Send the link to your friends in all convenient ways',
  },
  {
    caption: 'Purchase',
    description: 'They buy a product from our store',
  },
  {
    caption: 'Percentages',
    description: 'You get rewards',
  },
]

const ReferralList: React.FC = () => (
  <div>
    {referralSteps.map(({ caption, description }, i, a) => (
      <StepItem
        caption={caption}
        description={description}
        index={i + 1}
        key={caption}
        bar={i + 1 !== a.length}
      />
    ))}
  </div>
)

export default ReferralList
