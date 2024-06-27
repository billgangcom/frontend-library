import { PageSize } from '../api/index.js'
import { NextIcon, PreviousIcon } from '../assets/icons.js'
import { Button } from './button.js'

export type PaginationTemplateProps = {
  currentPage: number
  onPageChange: (page: number) => void
  siblingCount?: number
}

export type PaginationProps = PaginationTemplateProps & {
  totalPages: number
}

const range = (from: number, to: number) =>
  Array.from({ length: to - from + 1 }, (_, i) => from + i)

const paginationRange = (
  currentPage: number,
  totalPages: number,
  siblingCount: number,
) => {
  const totalPageNumbers = siblingCount * 2 + 3 + 2
  if (totalPages <= totalPageNumbers) return range(1, totalPages)

  const leftSiblingIndex = Math.max(currentPage - siblingCount, 1)
  const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages)
  const shouldShowLeftEllipsis = leftSiblingIndex > 2
  const shouldShowRightEllipsis = rightSiblingIndex < totalPages - 2

  if (!shouldShowLeftEllipsis && shouldShowRightEllipsis) {
    return [...range(1, 3 + 2 * siblingCount), 'right-ellipsis', totalPages]
  }

  if (shouldShowLeftEllipsis && !shouldShowRightEllipsis) {
    return [
      1,
      'left-ellipsis',
      ...range(totalPages - (3 + 2 * siblingCount) + 1, totalPages),
    ]
  }

  return [
    1,
    'left-ellipsis',
    ...range(leftSiblingIndex, rightSiblingIndex),
    'right-ellipsis',
    totalPages,
  ]
}

export const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  siblingCount = 1,
}: PaginationProps) => {
  const handleEllipsisClick = (isLeft: boolean) => {
    const offset = siblingCount * 2 + 1
    onPageChange(
      isLeft
        ? Math.max(currentPage - offset, 1)
        : Math.min(currentPage + offset, totalPages),
    )
  }

  const isFirstPage = currentPage === 1
  const isLastPage = currentPage === totalPages

  const renderButton = (page: number | string) => (
    <Button
      variant={
        typeof page === 'number' && page === currentPage
          ? 'primaryRounded'
          : 'secondary'
      }
      key={page}
      onClick={() =>
        typeof page === 'string'
          ? handleEllipsisClick(page === 'left-ellipsis')
          : onPageChange(page)
      }
      aria-current={
        typeof page === 'number' && page === currentPage ? 'page' : undefined
      }
      isSquare
    >
      {typeof page === 'string' ? '…' : page}
    </Button>
  )

  return (
    <div className="flex gap-2 flex-wrap">
      <Button
        variant="secondary"
        onClick={() => !isFirstPage && onPageChange(currentPage - 1)}
        disabled={isFirstPage}
        isSquare
      >
        <PreviousIcon />
      </Button>
      {paginationRange(currentPage, totalPages, siblingCount).map(renderButton)}
      <Button
        variant="secondary"
        onClick={() => !isLastPage && onPageChange(currentPage + 1)}
        disabled={isLastPage}
        isSquare
      >
        <NextIcon />
      </Button>
    </div>
  )
}

export const getPaginationText = (
  page: number,
  totalEntries: number,
  pageSize: number,
) => {
  const startEntry = (page - 1) * pageSize + 1
  const endEntry = Math.min(page * pageSize, totalEntries)
  return `Showing ${startEntry}-${endEntry} entries of ${totalEntries}`
}

export type PaginationWithRangeProps = PaginationTemplateProps & {
  className?: string
  totalCount: number
}

export const PaginationWithRange = ({
  className,
  totalCount,
  ...props
}: PaginationWithRangeProps) => {
  const totalPages = Math.ceil(totalCount / PageSize)
  if (totalPages < 2) return null

  return (
    <div
      className={`flex lg:h-[72px] justify-start align-middle items-start lg:justify-between p-4 lg:flex-row flex-col mt-auto ${className}`}
    >
      <div className="text-textSecondary flex-center mb-2">
        {getPaginationText(props.currentPage, totalCount, PageSize)}
      </div>
      <div className="flex-center">
        <Pagination {...{ ...props, totalPages }} />
      </div>
    </div>
  )
}
