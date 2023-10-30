import { ItemType } from '../common/item.type'
import { OrderStatusType } from '../common/orders.type'
import { CurrencyType } from '../common/standard-price'
import { CountryType } from '../sign/personalInfoTypes'

export type OrderListFilterType = {
  take?: number
  skip?: number
  search?: string
  ordering?: 'desc' | 'asc'
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
  mine?: '0' | '1'
}

export type OrderListType = {
  id: number
  corporationId: string
  status: OrderStatusType
  client: {
    name: string
    email: string
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
  currency: CurrencyType
  totalPrice: number
  items?: Array<any>
  isEditable?: boolean
  subtotal: number
}

export type OrderListForJobType = {
  id: number
  corporationId: string
  status: OrderStatusType
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
  currency: CurrencyType
  totalPrice: number
  isTeamMember: boolean
  isItems: boolean
  items: ItemType[]
}
