import { useAtom } from '@reatom/npm-react'
import React from 'react'

import { type GatewayDetail, getGatewaysDetail } from '../../api/balance.js'
import { Star } from '../../assets/icons.js'
import { IconWrapper } from '../../common/icon-wrapper.js'
import { LoadingSpinner } from '../../common/loading-spinner.js'
import { NoItemsBlock } from '../../common/no-items-block.js'
import { PageTitle } from '../../common/page-title.js'
import { PaginationWithRange } from '../../common/pagination.js'
import {
  StatusIndicator,
  StatusVariant,
} from '../../common/status-indicator.js'
import {
  convertCfImageIdToUrl,
  extractDateAndTime,
  formatPrice,
} from '../../utils/index.js'
import {
  type OrderItem,
  OrderStatus,
  getOrders,
  pageNumberAtom,
} from './model.js'

const statusVariantMap: Record<OrderStatus, StatusVariant> = {
  [OrderStatus.New]: StatusVariant.Warning,
  [OrderStatus.Pending]: StatusVariant.Warning,
  [OrderStatus.Completed]: StatusVariant.Success,
  [OrderStatus.Cancelled]: StatusVariant.Error,
  [OrderStatus.Expired]: StatusVariant.Error,
  [OrderStatus.FullDeliveryFailure]: StatusVariant.Error,
  [OrderStatus.PartiallyDelivered]: StatusVariant.Warning,
  [OrderStatus.Refunded]: StatusVariant.Success,
  [OrderStatus.Failed]: StatusVariant.Error,
}

type ListItemType = {
  children: React.ReactNode
  className?: string
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
const getGetwayItem = (name: string, gatewaysDetail: GatewayDetail) => {
  const item = gatewaysDetail.find((e) => e.name === name)
  if (!item) {
    return null
  }
  return (
    <>
      <img
        alt={item.displayName}
        src={convertCfImageIdToUrl(item.logoCfImageId)}
        className="h-6 mr-1"
      />
      <div>{item.displayName}</div>
    </>
  )
}
const OrderRow: React.FC<{ item: OrderItem; gatewaysDetail: GatewayDetail }> =
  ({ item, gatewaysDetail }) => {
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
        <ListItem>{getGetwayItem(item.gatewayName, gatewaysDetail)}</ListItem>
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

export const Orders = () => {
  const [orders] = useAtom(getOrders.dataAtom)
  const [currentPage, setCurrentPage] = useAtom(pageNumberAtom)
  const [pending] = useAtom((ctx) => ctx.spy(getOrders.pendingAtom) > 0)
  const [gatewaysDetail] = useAtom(getGatewaysDetail.dataAtom)
  const isEmpty = !orders?.list?.length || !gatewaysDetail
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
              <OrderRow
                key={item.id}
                item={item}
                gatewaysDetail={gatewaysDetail}
              />
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
