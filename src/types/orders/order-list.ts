import { CurrencyType } from '../common/standard-price'
import { CountryType } from '../sign/personalInfoTypes'
import { ProjectTeamListType } from './order-detail'

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
  ordersWithoutJobs?: boolean
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
  items: {
    id: number
    contactPersonId: number
    itemName: string
    dueAt: string
    sourceLanguage: string
    targetLanguage: string
    priceId: number
    description: string
    totalPrice: string
  }[]
  // isItems: boolean
}

export type OrderStatusType =
  | 'In preparation'
  | 'In progress'
  | 'Completed'
  | 'Invoiced'
  | 'Canceled'
