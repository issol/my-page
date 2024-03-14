import { CountryType } from '../sign/personalInfoTypes'
import { ItemType } from './item.type'

export type OrderStatusType =
  | 10000
  | 'New'
  | 10100
  | 'In preparation'
  | 10200
  | 'Internal review'
  | 10300
  | 'Order sent'
  | 10400
  | 'In progress'
  | 10500
  | 'Under revision'
  | 10600
  | 'Partially delivered'
  | 10700
  | 'Delivery completed'
  | 10800
  | 'Redelivery requested'
  | 10900
  | 'Delivery confirmed'
  | 101000
  | 'Invoiced'
  | 101100
  | 'Paid'
  | 101200
  | 'Canceled'
  | 10950
  | 'Without invoice'

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
  orderTimezone: CountryType
  projectDueAt: Date
  projectDueTimezone: CountryType

  tax: number | null
  isTaxable: boolean
  showDescription: boolean
  subtotal: number | string

  items?: ItemType
}

export type QuotesProjectInfoType = {
  status: OrderStatusType
  workName?: string
  projectName: string
  projectDescription?: string
  category: string
  serviceType: Array<string>
  genre?: Array<string>
  quoteDate: { date: string; timezone: CountryType }
  projectDueDate: { date: string; timezone: CountryType }
  quoteDeadline: { date: string; timezone: CountryType }
  quoteExpiryDate: { date: string; timezone: CountryType }
  estimatedDeliveryDate: { date: string; timezone: CountryType }
  showDescription: boolean
  tax: number | null
  taxable: boolean
}

export type CreateOrderInfoRes = {
  adminCompanyName: string
  workName: string
  projectName: string
  projectDescription: string | null
  category: string | null
  serviceType: string[]
  genre: string[]
  status: OrderStatusType
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
