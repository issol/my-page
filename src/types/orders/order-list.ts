import { CurrencyType } from '../common/standard-price'
import { CountryType } from '../sign/personalInfoTypes'

export type OrderListFilterType = {
  take: number
  skip: number
  search?: string
  ordering?: 'desc' | 'asc'
  sort?: 'corporationId' | 'projectDueDate' | 'orderDate' | 'totalPrice'
  status?: string[]
  client?: string[]
  category?: string[]
  serviceType?: string[]
  orderDateFrom?: string
  orderDateTo?: string
  projectDueDateFrom?: string
  projectDueDateTo?: string
  revenueFrom?: string[]
  mine?: string
  hideCompleted?: string
}

export type OrderListType = {
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
}

export type OrderStatusType =
  | 'In preparation'
  | 'In progress'
  | 'Completed'
  | 'Invoiced'
  | 'Canceled'
