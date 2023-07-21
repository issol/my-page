import { ItemType } from '../common/item.type'
import { CurrencyType } from '../common/standard-price'
import { CountryType } from '../sign/personalInfoTypes'
import { ProjectTeamListType } from './order-detail'

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
  items?: Array<any>
  isEditable?: boolean
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

export type OrderStatusType =
  | 'New'
  | 'In preparation'
  | 'Internal review'
  | 'Order sent'
  | 'In progress'
  | 'Under revision'
  | 'Partially delivered'
  | 'Delivery completed'
  | 'Redelivery requested'
  | 'Delivery confirmed'
  | 'Invoiced'
  | 'Paid'
  | 'Canceled'
