import type React from 'react'
type CardProps = {
  email: string
  balance: string
}

const Card: React.FC<CardProps> = ({ email, balance }) => (
  <div className="mb-4 hidden xl:flex w-full flex-col items-center rounded-2xl bg-surface0 py-4">
    <div className="mb-1 font-bold">{email}</div>
    <div className="rounded-xl bg-brandLight px-2 py-1 text-sm text-brandDefault">
      Balance: {balance}
    </div>
  </div>
)
export default Card
