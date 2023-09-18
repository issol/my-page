import { GridSortDirection } from '@mui/x-data-grid'

export type RequestFilterType = {
  status?: number[]
  lsp?: string[]
  client?: number[]
  category?: string[]
  serviceType?: string[]
  requestDateFrom?: string
  requestDateTo?: string
  desiredDueDateFrom?: string
  desiredDueDateTo?: string
  search?: string
  mine?: '0' | '1'
  hideCompleted?: '0' | '1'
  take: number
  skip: number
  ordering?: GridSortDirection
  sort?: SortType
}

export type SortType = 'corporationId' | 'requestDate' | 'desiredDueDate'
