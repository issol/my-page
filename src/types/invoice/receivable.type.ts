import { RevenueFormType } from './../common/orders.type'
import { CurrencyType } from '@src/types/common/standard-price'
import { InvoiceReceivableStatusType } from './common.type'
import { CountryType } from '../sign/personalInfoTypes'

import { StatusType } from '@src/apis/client.api'
import { AddressType, ClientAddressType } from '../schema/client-address.schema'
import { OrderStatusType } from '../orders/order-list'
import {
  ClientType,
  LanguageAndItemType,
  LanguagePairTypeInItem,
  ProjectTeamListType,
} from '../orders/order-detail'
import { ContactPersonType } from '../schema/client-contact-person.schema'
import { ItemResType } from '../common/orders-and-quotes.type'

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
  clientType: 'Company' | 'Mr.' | 'Ms.'
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

export type InvoiceReceivableDetailType = {
  id: number
  corporationId: string
  createdAt: string
  updatedAt: string
  deletedAt: string | null
  adminCompanyName: string
  invoiceStatus: InvoiceReceivableStatusType
  authorId: number

  salesCategory: string
  description: string
  notes: string
  setReminder: boolean
  reminderSentAt: string | null
  invoicedAt: string
  payDueAt: string
  payDueTimezone: CountryType
  invoiceConfirmedAt: string | null
  invoiceConfirmTimezone: CountryType | null
  taxInvoiceDueAt: string | null
  taxInvoiceDueTimezone: CountryType | null
  paidAt: string | null
  paidDateTimezone: CountryType | null

  salesCheckedDateTimezone: CountryType | null
  taxInvoiceIssuedAt: string | null
  taxInvoiceIssuedDateTimezone: CountryType | null
  salesCheckedAt: string | null
  downloadedAt: string | null
  workName: string
  projectName: string
  category: string
  serviceType: string[]
  expertise: string[]
  revenueFrom: RevenueFormType
  isTaxable: boolean
  orderId: number
  tax: number
  taxInvoiceIssued: boolean
  orderCorporationId: string
}

export type InvoiceHistoryType = {
  projectInfo: InvoiceReceivableDetailType
  client: ClientType
  members: ProjectTeamListType[]
  items: LanguageAndItemType
}

export type InvoiceVersionHistoryType = {
  id: number
  version: number
  email: string
  downloadedAt: string
} & InvoiceHistoryType

export type InvoiceVersionHistoryResType = {
  id: number
  version: number
  email: string
  downloadedAt: string
} & {
  invoiceInfo: InvoiceReceivableDetailType
  client: ClientType
  projectTeam: {
    members: ProjectTeamListType[]
  }
  items: {
    id: number
    languagePairs: Array<LanguagePairTypeInItem>
    items: ItemResType[]
  }
}

export type InvoiceReceivablePatchParamsType = {
  supervisorId?: number
  projectManagerId?: number
  downloadedAt?: string
  members?: number[]
  contactPersonId?: number
  orderId?: number
  invoiceStatus?: string
  invoicedAt?: string
  payDueAt?: string
  description?: string
  payDueTimezone?: CountryType
  invoiceConfirmedAt?: string
  invoiceConfirmTimezone?: CountryType
  taxInvoiceDueAt?: string
  taxInvoiceDueTimezone?: CountryType
  invoiceDescription?: string
  notes?: string
  taxInvoiceIssuedAt?: string
  taxInvoiceIssuedDateTimezone?: CountryType
  paidAt?: string
  paidDateTimezone?: CountryType
  salesCheckedAt?: string
  salesCheckedDateTimezone?: CountryType
  setReminder?: boolean
  taxInvoiceIssued?: boolean
  salesCategory?: string
}

export type InvoiceDownloadData = {
  invoiceId: number
  adminCompanyName: string
  companyAddress: string
  corporationId: string
  orderCorporationId: string
  invoicedAt: string
  paymentDueAt: { date: string; timezone: CountryType }
  pm: {
    email: string
    firstName: string
    middleName: string | null
    lastName: string
  }
  companyName: string
  projectName: string
  client: ClientType
  contactPerson: ContactPersonType | null
  clientAddress: ClientAddressType[]
  langItem: LanguageAndItemType
  subtotal: string
  total: string
  taxPercent: number
  tax: string | null
}

export type CreateInvoiceReceivableRes = {
  data: {
    id: number
    corporationId: string
    createdAt: string
    updatedAt: string
    deletedAt: string | null
    adminCompanyName: string
    invoiceStatus: number
    authorId: number
    lastUpdatedAuthorId: number | null
    salesCategory: string | null
    description: string
    notes: string | null
    setReminder: boolean
    reminderSentAt: string | null
    invoicedAt: string
    payDueAt: string
    payDueTimezone: CountryType
    invoiceConfirmedAt: string
    invoiceConfirmTimezone: CountryType
    taxInvoiceDueAt: string
    taxInvoiceDueTimezone: CountryType
    paidAt: string | null
    salesCheckedAt: string | null
    downloadedAt: string | null
    order: {
      id: number
    }
  }
}
