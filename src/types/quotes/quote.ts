import { GridSortDirection } from '@mui/x-data-grid'

export type QuotesFilterType = {
  take?: number
  skip?: number
  search?: string
  quoteDate?: Date[]
  quoteDeadline?: Date[]
  quoteExpiryDate?: Date[]
  hideCompletedQuotes?: 0 | 1
  seeMyQuotes?: 0 | 1
  status?: number[]
  client?: string[]
  clientId?: number[]
  category?: string[]
  serviceType?: string[]
  ordering?: GridSortDirection
  sort?: SortType
  estimatedDeliveryDate?: Date[]
  projectDueDate?: Date[]
  lsp?: string[]
}

export type SortType =
  | 'corporationId'
  | 'quoteRegisteredDate'
  | 'quoteDeadline'
  | 'expiryDate'

export type ReasonType = {
  from: 'client' | 'lsp'
  reason: string
  message: string
  type: string
}
