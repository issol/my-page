import { CurrencyType } from '@src/types/common/standard-price'
import { InvoicePayableStatusType } from './common.type'
import { CountryType } from '../sign/personalInfoTypes'
import { LanguageAndItemType } from '../orders/order-detail'

export type InvoicePayableFilterType = {
  invoiceStatus?: string[]
  pro?: number[]
  invoicedDateFrom?: string
  invoicedDateTo?: string
  payDueDateFrom?: string
  payDueDateTo?: string
  paidDateFrom?: string
  paidDateTo?: string
  search?: string

  mine?: 0 | 1
  hidePaid?: 0 | 1

  skip: number
  take: number
}

export type InvoicePayableListType = {
  id: number
  adminCompanyName: string
  corporationId: string
  invoiceStatus: InvoicePayableStatusType
  pro: { name: string; email: string }
  invoicedAt: string
  payDueAt: string
  payDueTimezone: CountryType | null
  paidAt: string | null
  paidDateTimezone: CountryType | null
  totalPrice: number
  currency: CurrencyType
  statusUpdatedAt: string
}

export type PayableFormType = {
  taxInfo?: string
  taxRate?: number
  invoiceStatus?: InvoicePayableStatusType
  payDueAt?: string
  payDueTimezone?: CountryType
  paidAt?: string | null
  paidDateTimezone?: CountryType | null
  description?: string
  subtotal?: number
  totalPrice?: number
  tax?: number | null
  invoiceConfirmedAt?: string
  invoiceConfirmTimezone?: CountryType
}

export type InvoicePayableDetailType = {
  id: number
  corporationId: string
  invoicedAt: string
  invoicedAtTimezone: CountryType
  invoiceStatus: InvoicePayableStatusType
  pro: { name: string; email: string }
  taxInfo: string
  taxRate: number
  payDueAt: string
  payDueTimezone: CountryType
  paidAt: string | null
  paidDateTimezone: CountryType | null
  description: string
  currency: CurrencyType
  subtotal: number
  totalPrice: number
  tax: number | null
  invoiceConfirmedAt: string | null
}

export type InvoicePayableJobType = {
  id: number
  corporationId: string
  serviceType: string
  name: string
  totalPrice: number
  contactPerson: string
  deletedAt: string | null //TODO: 키값 변경 가능성 있음
  priceUnits: {
    title: string
    unitPrice: number
    quantity: number
    prices: number
  }[]
}

export type PayableHistoryType = {
  version: number
  account: string
  id: number
  corporationId: string
  invoicedAt: string
  invoiceStatus: InvoicePayableStatusType
  pro: { name: string; email: string }
  taxInfo: string
  taxRate: number
  payDueAt: string
  payDueTimezone: CountryType
  paidAt: string | null
  paidDateTimezone: CountryType | null
  description: string
  currency: string
  subtotal: number
  totalPrice: number
  tax: number

  jobs: {
    count: number
    totalCount: number
    data: Array<InvoicePayableJobType>
  }
}

export type InvoicePayableDownloadData = {
  invoiceId: number
  adminCompanyName: string
  companyAddress: string
  corporationId: string
  invoicedAt: string
  payDueAt: string
  payDueTimezone: CountryType
  paidAt: string | null
  paidDateTimezone: CountryType | null
  pro: {
    email: string
    name: string
    // address: string
    // mobile: string
  }
  companyName: string
  jobName: string
  langItem: LanguageAndItemType
  subtotal: string
  total: string
  taxPercent: number
  tax: string | null
}
