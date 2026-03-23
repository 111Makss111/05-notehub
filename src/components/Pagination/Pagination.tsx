import { type ComponentType } from 'react'
import ReactPaginateModule from 'react-paginate'
import css from './Pagination.module.css'

interface PaginationProps {
  pageCount: number
  currentPage: number
  onPageChange: (page: number) => void
}

interface SelectedItem {
  selected: number
}

interface ReactPaginateProps {
  breakLabel?: string
  nextLabel?: string
  previousLabel?: string
  pageRangeDisplayed?: number
  marginPagesDisplayed?: number
  pageCount: number
  forcePage?: number
  onPageChange: (item: SelectedItem) => void
  containerClassName?: string
  pageClassName?: string
  pageLinkClassName?: string
  previousClassName?: string
  previousLinkClassName?: string
  nextClassName?: string
  nextLinkClassName?: string
  breakClassName?: string
  breakLinkClassName?: string
  activeClassName?: string
  disabledClassName?: string
}

const ReactPaginate =
  typeof ReactPaginateModule === 'function'
    ? (ReactPaginateModule as ComponentType<ReactPaginateProps>)
    : (
        ReactPaginateModule as unknown as {
          default: ComponentType<ReactPaginateProps>
        }
      ).default

export default function Pagination({
  pageCount,
  currentPage,
  onPageChange,
}: PaginationProps) {
  return (
    <ReactPaginate
      breakLabel="..."
      nextLabel="→"
      previousLabel="←"
      pageRangeDisplayed={3}
      marginPagesDisplayed={1}
      pageCount={pageCount}
      forcePage={currentPage - 1}
      onPageChange={({ selected }: SelectedItem) => onPageChange(selected + 1)}
      containerClassName={css.pagination}
      pageClassName={css.pageItem}
      pageLinkClassName={css.pageLink}
      previousClassName={css.pageItem}
      previousLinkClassName={css.pageLink}
      nextClassName={css.pageItem}
      nextLinkClassName={css.pageLink}
      breakClassName={css.pageItem}
      breakLinkClassName={css.pageLink}
      activeClassName={css.active}
      disabledClassName={css.disabled}
    />
  )
}
