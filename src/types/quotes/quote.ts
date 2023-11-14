import { GridSortDirection } from '@mui/x-data-grid'

export type QuotesFilterType = {
  take?: number
  skip?: number
  search?: string
  quoteDate?: string[]
  quoteDeadline?: string[]
  quoteExpiryDate?: string[]
  hideCompletedQuotes?: 0 | 1
  seeMyQuotes?: 0 | 1
  status?: number[]
  client?: string[]
  clientId?: number[]
  category?: string[]
  serviceType?: string[]
  ordering?: GridSortDirection
  sort?: SortType
  estimatedDeliveryDate?: string[]
  projectDueDate?: string[]
  lsp?: string[]
}

export type SortType =
  | 'corporationId'
  | 'quoteRegisteredDate'
  | 'quoteDeadline'
  | 'expiryDate'

export type ReasonType = {
  from: 'client' | 'lsp'
  reason: string | string[]
  message: string
  type: string
}
