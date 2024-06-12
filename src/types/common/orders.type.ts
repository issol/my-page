import { CountryType } from '../sign/personalInfoTypes'
import { ItemType } from './item.type'
import { OrderLabel, OrderStatus } from '@src/types/common/status.type'

export type RevenueFormType = 'United States' | 'Korea' | 'Singapore' | 'Japan'

export type OrderProjectInfoFormType = {
  // status: OrderStatusType
  status: number
  workName?: string | null
  projectName: string
  projectDescription?: string
  category?: string
  serviceType?: Array<string>
  genre?: Array<string>
  revenueFrom: RevenueFormType | null
  orderedAt: Date
  orderTimezone: {
    id: number | undefined
    label: string
    code: string
    pinned: boolean
  }
  projectDueAt: Date
  projectDueTimezone: {
    id: number | undefined
    label: string
    code: string
    pinned: boolean
  }

  tax: number | null
  isTaxable: boolean
  showDescription: boolean
  subtotal: number | string

  items?: ItemType
}

export type CreateOrderInfoRes = {
  adminCompanyName: string
  workName: string
  projectName: string
  projectDescription: string | null
  category: string | null
  serviceType: string[]
  genre: string[]
  status: OrderStatus & OrderLabel
  constructorId: number
  supervisorId: number
  projectManagerId: number
  members: number[]
  revenueFrom: RevenueFormType
  addressType: 'billing' | 'shipping'
  tax: number
  orderedAt: string
  orderTimezone: {
    code: string
    label: string
  }
  projectDueAt: string
  projectDueTimezone: {
    code: string
    label: string
  }
  client: {
    clientId: number
  }
  contactPerson: {
    id: number
  }
  corporationId: string
  operatorId: null | number
  downloadedAt: null | string
  id: number
}
