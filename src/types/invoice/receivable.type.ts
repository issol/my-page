import { OrderStatusType, RevenueFormType } from './../common/orders.type'
import { CurrencyType } from '@src/types/common/standard-price'
import { InvoiceReceivableStatusType } from './common.type'
import { CountryType } from '../sign/personalInfoTypes'

import { StatusType } from '@src/apis/client.api'
import { AddressType, ClientAddressType } from '../schema/client-address.schema'

import {
  ClientType,
  DeliveryFileType,
  LanguageAndItemType,
  LanguagePairTypeInItem,
  ProjectTeamListType,
} from '../orders/order-detail'
import { ContactPersonType } from '../schema/client-contact-person.schema'
import { ItemResType } from '../common/orders-and-quotes.type'
import { Cancel } from 'axios'
import { CancelReasonType } from '../requests/detail.type'
import { ReasonType } from '../quotes/quote'

export type InvoiceReceivableFilterType = {
  invoiceStatus?: number[]
  clientId?: number[]
  lsp?: string[]
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

  mine?: '0' | '1'
  hidePaid?: '0' | '1'

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
  currency: CurrencyType
  totalPrice: number
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
  updatedAt: string
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
  showDescription: boolean
  salesCategory: string
  description: string
  notes: string
  setReminder: boolean
  reminderSentAt: string | null
  invoicedAt: string
  invoicedTimezone: CountryType
  payDueAt: string
  payDueTimezone: CountryType
  invoiceConfirmedAt: string | null //TODO:추후 삭제 필요
  invoiceConfirmTimezone: CountryType | null //TODO:추후 삭제 필요
  managerConfirmedAt: string | null //** invoiceConfirmedAt을 대체하는 값으로, manager가 confirm했을 때 이 값이 업데이트 됨
  clientConfirmedAt: string | null //** invoiceConfirmedAt을 대체하는 값으로, client가 confirm했을 때 이 값이 업데이트 됨
  clientConfirmTimezone?: CountryType | null //** invoiceConfirmTimezone을 대체하는 값으로, client가 confirm했을 때 이 값이 업데이트 됨
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

  taxInvoiceFiles: DeliveryFileType[]

  reason: ReasonType
  orderCorporationId: string
  // linkedOrder: {
  //   id: number
  //   corporationId: string
  // }
  subtotal: number | string
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
  managerConfirmedAt: string | null
  clientConfirmedAt: string | null
  clientConfirmTimezone?: CountryType | null
  isRestorable: boolean
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
  supervisorId?: number | null
  projectManagerId?: number
  downloadedAt?: string
  members?: number[] | null
  contactPersonId?: number
  orderId?: number
  invoiceStatus?: number
  invoicedAt?: string
  invoicedTimezone?: CountryType
  payDueAt?: string
  description?: string
  payDueTimezone?: CountryType
  invoiceConfirmedAt?: string | null
  invoiceConfirmTimezone?: CountryType
  taxInvoiceDueAt?: string | null
  taxInvoiceDueTimezone?: CountryType
  invoiceDescription?: string
  notes?: string
  taxInvoiceIssuedAt?: string
  taxInvoiceIssuedDateTimezone?: CountryType
  paidAt?: string | null
  paidDateTimezone?: CountryType
  salesCheckedAt?: string
  salesCheckedDateTimezone?: CountryType
  setReminder?: '1' | '0'
  salesCategory?: string
  showDescription?: '1' | '0'
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

export type MarkDayInfo = {
  paidAt: string
  paidDateTimezone: CountryType
}
