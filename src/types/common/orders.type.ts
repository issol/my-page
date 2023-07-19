import { CountryType } from '../sign/personalInfoTypes'

export type OrderStatusType =
  | 'In preparation'
  | 'In progress'
  | 'Completed'
  | 'Invoiced'
  | 'Canceled'

export type RevenueFormType = 'United States' | 'Korea' | 'Singapore' | 'Japan'
export type OrderProjectInfoFormType = {
  // status: OrderStatusType
  status: number
  workName?: string
  projectName: string
  projectDescription?: string
  category?: string
  serviceType?: Array<string>
  expertise?: Array<string>
  revenueFrom: RevenueFormType
  orderedAt: string
  orderTimezone: CountryType
  projectDueAt: string
  projectDueTimezone: CountryType

  tax: number | null
  taxable: boolean
  showProjectDescription: boolean
}

export type CreateOrderInfoRes = {
  adminCompanyName: string
  workName: string
  projectName: string
  projectDescription: string | null
  category: string | null
  serviceType: string[]
  expertise: string[]
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
    phone: string
    code: string
    label: string
  }
  projectDueAt: string
  projectDueTimezone: {
    phone: string
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
