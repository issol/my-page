import { RevenueFormType } from './../common/orders.type'
import { CurrencyType } from '@src/types/common/standard-price'
import { InvoiceReceivableStatusType } from './common.type'
import { CountryType } from '../sign/personalInfoTypes'
import { ClientType } from '../schema/company-info.schema'
import { StatusType } from '@src/apis/client.api'
import { AddressType } from '../schema/client-address.schema'
import { OrderStatusType } from '../orders/order-list'

export type InvoiceReceivableFilterType = {
  invoiceStatus?: string[]
  clientId?: string[]
  category?: string[]
  serviceType?: string[]
  revenueFrom?: string[]
  salesCategory?: string[]

  invoicedDateFrom?: string
  invoicedDateTo?: string
  payDueDateFrom?: string
  payDueDateTo?: string
  paidDateFrom?: string
  paidDateTo?: string
  salesCheckedDateFrom?: string
  salesCheckedDateTo?: string
  search?: string

  mine?: 0 | 1
  hidePaid?: 0 | 1

  skip: number
  take: number
}

export type InvoiceReceivableListType = {
  id: number
  corporationId: string
  createdAt: string
  adminCompanyName: string
  invoiceStatus: InvoiceReceivableStatusType
  authorId: number
  salesCategory: string | null
  description: string | null
  notes: string | null
  setReminder: boolean
  reminderSentAt: string | null
  invoicedAt: string | null
  payDueAt: string | null
  payDueTimezone: CountryType
  invoiceConfirmedAt: string | null
  invoiceConfirmTimezone: CountryType | null
  taxInvoiceDueAt: string | null
  taxInvoiceDueTimezone: CountryType | null
  taxInvoiceIssuedAt: string | null
  taxInvoiceIssuedDateTimezone: CountryType | null
  paidAt: string | null
  paidDateTimezone: CountryType | null
  salesCheckedAt: string | null
  salesCheckedDateTimezone: CountryType | null
  downloadedAt: string | null
  order: InvoiceReceivableOrderType
}

export type InvoiceReceivableOrderType = {
  id: number
  createdAt: string
  updatedAt: string | null
  corporationId: string
  adminCompanyName: string
  workName: string
  projectName: string
  projectDescription: string
  category: string
  serviceType: string[]
  expertise: string[]
  status: OrderStatusType
  operatorId: number
  supervisorId: number | null
  projectManagerId: number
  members: number[] | null
  revenueFrom: RevenueFormType
  addressType: AddressType
  version: number
  tax: number | null
  parentOrderId: number | null
  orderedAt: string | null
  orderTimezone: CountryType | null
  projectDueAt: string
  projectDueTimezone: CountryType
  downloadedAt: string | null
  deletedAt: string | null
  client: InvoiceReceivableClientType
}

export type InvoiceReceivableClientType = {
  clientId: number
  corporationId: string
  authorId: number
  adminCompanyName: string
  clientType: ClientType
  name: string
  email: string
  phone: string | null
  mobile: string | null
  fax: string | null
  websiteLink: string | null
  status: StatusType
  timezone: CountryType
  deletedAt: string | null
}
