import { GridSortDirection } from '@mui/x-data-grid'
import { ItemType } from '../common/item.type'

import { CountryType } from '../sign/personalInfoTypes'
import { Currency } from '@src/types/common/currency.type'
import { OrderLabel, OrderStatus } from '@src/types/common/status.type'

export type OrderListFilterType = {
  take?: number
  skip?: number
  search?: string
  ordering?: GridSortDirection
  sort?: 'corporationId' | 'projectDueDate' | 'orderDate' | 'totalPrice'
  status?: number[]
  client?: string[]
  category?: string[]
  serviceType?: string[]
  orderDateFrom?: string
  orderDateTo?: string
  projectDueDateFrom?: string
  projectDueDateTo?: string
  revenueFrom?: string[]
  mine?: '0' | '1'
  hideCompleted?: '0' | '1'
  ordersWithoutJobs?: number
  lsp?: string[]
}

export type InvoiceOrderListFilterType = {
  take?: number
  skip?: number
  search?: string
  status?: number[]
  client?: number
  revenueFrom?: string
  currency?: Currency
  mine?: '0' | '1'
}

export type OrderListType = {
  id: number
  corporationId: string
  status: OrderStatus & OrderLabel
  client: {
    name: string
    email: string
    clientId: number
  }
  lsp?: {
    name: string
    email: string
  }
  projectName: string
  category: string
  serviceType: string[]
  orderedAt: string
  projectDueAt: string
  orderTimezone: CountryType
  revenueFrom: string
  projectDueTimezone: CountryType
  currency: Currency
  totalPrice: number
  items?: Array<any>
  isEditable?: boolean
  subtotal: number
}

export type OrderListForJobType = {
  id: number
  corporationId: string
  status: OrderStatus & OrderLabel
  client: {
    name: string
    email: string
  }
  projectName: string
  category: string
  serviceType: string[]
  orderedAt: string
  projectDueAt: string
  orderTimezone: CountryType
  projectDueTimezone: CountryType
  currency: Currency
  totalPrice: number
  isTeamMember: boolean
  isItems: boolean
  items: ItemType[]
}
