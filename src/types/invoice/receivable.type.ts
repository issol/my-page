import { RevenueFormType } from './../common/orders.type'

import { CountryType } from '../sign/personalInfoTypes'

import { StatusType } from '@src/apis/client.api'
import { AddressType, ClientAddressType } from '../schema/client-address.schema'

import {
  ClientType,
  DeliveryFileType,
  LanguagePairTypeInItem,
  ProjectTeamListType,
} from '../orders/order-detail'
import { ContactPersonType } from '../schema/client-contact-person.schema'
import { ItemResType } from '../common/orders-and-quotes.type'
import { ReasonType } from '../quotes/quote'
import { ItemType } from '../common/item.type'
import {
  InvoiceReceivableStatus,
  OrderLabel,
  OrderStatus,
} from '@src/types/common/status.type'
import { Currency } from '@src/types/common/currency.type'

export type InvoiceLanguageItemType = {
  invoiceId: number
  orders: Array<{
    id: number
    orderId: number
    projectName: string
    corporationId: string
    items: Array<ItemType>
    languagePairs: Array<LanguagePairTypeInItem>
    subtotal: number
  }>
}

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
  client: {
    clientId: number
    email: string
    name: string
  }
  createdAt: string
  adminCompanyName: string
  invoiceStatus: InvoiceReceivableStatus
  authorId: number
  salesCategory: string | null
  currency: Currency
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
  orders: InvoiceReceivableOrderType[]
  updatedAt: string
  projectName: string
  revenueFrom: RevenueFormType
  isTaxable: boolean
  tax: string | null
  projectManager: {
    userId: number
    email: string
    firstName: string
    middleName: string | null
    lastName: string
  }
  contactPerson: {
    userId: number
    email: string
    firstName: string
    middleName: string | null
    lastName: string
  } | null
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
  genre: string[]
  status: OrderStatus & OrderLabel
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
  totalPrice: number
  subtotal: string
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
  invoiceStatus: InvoiceReceivableStatus
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
  genre: string[]
  revenueFrom: RevenueFormType
  isTaxable: boolean
  orderId: number
  tax: null | string
  taxInvoiceIssued: boolean
  currency: Currency
  taxInvoiceFiles: DeliveryFileType[]

  reason: ReasonType
  orderCorporationId: string

  linkedOrders: {
    id: number
    corporationId: string
  }[]
  subtotal: number | string
}

export type InvoiceHistoryType = {
  projectInfo: InvoiceReceivableDetailType
  clientInfo: ClientType
  members: ProjectTeamListType[]
  items: InvoiceLanguageItemType
}

export type InvoiceVersionHistoryType = {
  id: number
  version: number
  email: string
  downloadedAt: string
  managerConfirmedAt: string | null
  managerConfirmTimezone?: CountryType | null
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
  clientId?: number | null
  contactPersonId?: number | null
  orderId?: number[]
  projectName?: string
  revenueFrom?: RevenueFormType
  tax?: string | null
  isTaxable?: '1' | '0'
  addressType?: AddressType
  invoiceStatus?: number
  invoicedAt?: string
  invoicedTimezone?: CountryType | null
  payDueAt?: string
  description?: string
  payDueTimezone?: CountryType | null
  invoiceConfirmedAt?: string | null
  invoiceConfirmTimezone?: CountryType | null
  clientConfirmedAt?: string | null
  clientConfirmTimezone?: CountryType | null
  taxInvoiceDueAt?: string | null
  taxInvoiceDueTimezone?: CountryType | null
  invoiceDescription?: string
  notes?: string
  taxInvoiceIssuedAt?: string
  taxInvoiceIssuedDateTimezone?: CountryType | null
  paidAt?: string | null
  paidDateTimezone?: CountryType | null
  salesCheckedAt?: string
  salesCheckedDateTimezone?: CountryType | null
  setReminder?: '1' | '0'
  salesCategory?: string
  showDescription?: '1' | '0'
  taxInvoiceIssued?: '1' | '0'
}

export type InvoiceDownloadData = {
  invoiceId: number
  adminCompanyName: string
  companyAddress: string
  corporationId: string
  orderCorporationId: string[]
  invoicedAt: string
  currency: Currency
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
  // langItem: LanguageAndItemType | null
  langItem: ItemType[]
  subtotal: string
  total: string
  taxPercent: number
  tax: string | null
  orders: Array<{
    id: number
    orderId: number
    projectName: string
    corporationId: string
    items: Array<ItemType>
    languagePairs: Array<LanguagePairTypeInItem>
    subtotal: number
  }>
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
