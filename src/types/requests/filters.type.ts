import { GridSortDirection } from '@mui/x-data-grid'

export type RequestFilterType = {
  status?: string[]
  lsp?: string[]
  client?: string[] //TODO: 홒 공유하기. string일지 number일지 문의
  category?: string[]
  serviceType?: string[]
  requestDateFrom?: string
  requestDateTo?: string
  desiredDueDateFrom?: string
  desiredDueDateTo?: string
  search?: string
  mine?: 0 | 1
  hideCompleted?: 0 | 1
  take: number
  skip: number
  ordering?: GridSortDirection
  sort?: SortType
}

export type SortType = 'corporationId' | 'requestDate' | 'desiredDueDate'
