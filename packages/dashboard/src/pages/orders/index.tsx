import { useAtom } from '@reatom/npm-react'
import React from 'react'
import { IconWrapper } from '../../common/icon-wrapper.js'
import { LoadingSpinner } from '../../common/loading-spinner.js'
import { NoItemsBlock } from '../../common/no-items-block.js'
import { PageTitle } from '../../common/page-title.js'
import { PaginationWithRange } from '../../common/pagination.js'
import {
  StatusIndicator,
  type StatusVariant,
} from '../../common/status-indicator.js'

import { getOrders, pageNumberAtom } from './model.js'

import { Star } from '../../assets/icons.js'
import {
  type Price,
  extractDateAndTime,
  formatPrice,
} from '../../utils/index.js'

const statusVariantMap: Record<OrderStatus, StatusVariant> = {
  NEW: 'warning',
  PENDING: 'warning',
  COMPLETED: 'success',
  CANCELLED: 'error',
  EXPIRED: 'error',
  FULL_DELIVERY_FAILURE: 'error',
  PARTIALLY_DELIVERED: 'warning',
  REFUNDED: 'success',
  FAILED: 'error',
}

type ListItemType = {
  children: React.ReactNode
  className?: string
}

type OrderStatus =
  | 'NEW'
  | 'PENDING'
  | 'COMPLETED'
  | 'CANCELLED'
  | 'EXPIRED'
  | 'FULL_DELIVERY_FAILURE'
  | 'PARTIALLY_DELIVERED'
  | 'REFUNDED'
  | 'FAILED'

type OrderItem = {
  id: string
  status: OrderStatus
  price: Price
  gatewayName: string
  time: string
  review?: {
    rating: number
  }
}

const ListItem: React.FC<ListItemType> = ({ children, className = '' }) => (
  <div
    className={`truncate border-b border-borderDefault p-4 pr-6 justify-start flex items-center ${className}`}
  >
    {children}
  </div>
)

const ListTitle: React.FC<ListItemType> = ({ children }) => (
  <ListItem className="text-sm text-textSecondary uppercase">
    {children}
  </ListItem>
)

const OrderRow: React.FC<{ item: OrderItem }> = ({ item }) => {
  const [date, time] = extractDateAndTime(item.time)
  return (
    <React.Fragment key={item.id}>
      <ListItem>{item.id}</ListItem>
      <ListItem>
        <StatusIndicator
          status={item.status}
          variant={statusVariantMap[item.status]}
        />
      </ListItem>
      <ListItem>{formatPrice(item.price)}</ListItem>
      <ListItem>{item.gatewayName}</ListItem>
      <ListItem>
        <div>
          <div>{date}</div>
          <div className="text-xs text-textSecondary">{time}</div>
        </div>
      </ListItem>
      <ListItem>
        {item.review ? (
          <div className="flex-center">
            <IconWrapper Icon={Star} color="brandDefault" />
            <div className="ml-1">{item.review.rating}</div>
          </div>
        ) : (
          'None'
        )}
      </ListItem>
    </React.Fragment>
  )
}

export const Orders: React.FC = () => {
  const [orders] = useAtom(getOrders.dataAtom)
  const [currentPage, setCurrentPage] = useAtom(pageNumberAtom)
  const [pending] = useAtom((ctx) => ctx.spy(getOrders.pendingAtom) > 0)

  const isEmpty = !orders?.list?.length
  const isLoadedAndFull = !pending && !isEmpty

  return (
    <>
      <PageTitle title="Orders" />

      <div className="border border-borderDefault rounded-2xl flex justify-between flex-col flex-1">
        <div className="overflow-x-auto grid grid-cols-[minmax(120px,auto)_repeat(5,minmax(min-content,auto))]">
          <ListTitle>Invoice ID</ListTitle>
          <ListTitle>Status</ListTitle>
          <ListTitle>Value</ListTitle>
          <ListTitle>Payment</ListTitle>
          <ListTitle>Date</ListTitle>
          <ListTitle>Review</ListTitle>
          {isLoadedAndFull &&
            orders.list.map((item: OrderItem) => (
              <OrderRow key={item.id} item={item} />
            ))}
        </div>
        {isLoadedAndFull && (
          <PaginationWithRange
            currentPage={currentPage}
            totalCount={orders.totalCount}
            onPageChange={setCurrentPage}
          />
        )}
        {pending ? (
          <LoadingSpinner />
        ) : isEmpty ? (
          <NoItemsBlock
            title="Orders are empty"
            description="Order history will be collected here"
          />
        ) : null}
      </div>
    </>
  )
}
