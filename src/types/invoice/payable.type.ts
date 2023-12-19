import { CurrencyType } from '@src/types/common/standard-price'
import { InvoicePayableStatusType, InvoiceProStatusType } from './common.type'
import { CountryType } from '../sign/personalInfoTypes'
import { LanguageAndItemType } from '../orders/order-detail'

export type InvoicePayableFilterType = {
  invoiceStatus?: number[]
  pro?: number[]
  invoicedDateFrom?: string
  invoicedDateTo?: string
  payDueDateFrom?: string
  payDueDateTo?: string
  paidDateFrom?: string
  paidDateTo?: string
  search?: string

  mine?: '0' | '1'
  hidePaid?: '0' | '1'

  skip: number
  take: number
}

export type InvoicePayableListType = {
  id: number
  adminCompanyName: string
  corporationId: string
  invoiceStatus: InvoicePayableStatusType | InvoiceProStatusType
  pro?: { name: string; email: string }
  invoicedAt: string
  payDueAt?: string
  payDueTimezone?: CountryType | null
  paidAt: string | null
  paidDateTimezone: CountryType | null
  totalPrice: number
  currency: CurrencyType
  statusUpdatedAt: string
}

export type PayableFormType = {
  taxInfo?: string
  taxRate?: number
  invoiceStatus?: InvoicePayableStatusType | InvoiceProStatusType
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
  invoicedTimezone: CountryType
  invoiceStatus: InvoicePayableStatusType | InvoiceProStatusType

  pro?: {
    name: string
    email: string
    address?: {
      baseAddress?: string | null //street1
      detailAddress?: string | null //street2
      city?: string | null
      state?: string | null
      country?: string | null
      zipCode?: string | null
    }
    mobile?: string | null
    timezone?: CountryType
  }
  taxInfo: string
  taxRate: number
  payDueAt?: string
  payDueTimezone?: CountryType
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
  isRemove: boolean
  sourceLanguage: string
  targetLanguage: string
  prices: {
    name: string
    unitPrice: number
    quantity: number
    prices: string
    unit: string
  }[]
}

export type PayableHistoryType = {
  id: number
  version: number
  account: string
  corporationId: string
  invoicedAt: string
  invoicedTimezone: CountryType
  invoiceStatus: InvoicePayableStatusType | InvoiceProStatusType
  invoiceConfirmedAt: string | null
  pro?: { name: string; email: string }
  taxInfo: string
  taxRate: number
  payDueAt?: string
  payDueTimezone?: CountryType
  paidAt: string | null
  paidDateTimezone: CountryType | null
  description: string
  currency: CurrencyType
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
  payDueAt?: string
  payDueTimezone?: CountryType
  paidAt: string | null
  paidDateTimezone: CountryType | null
  pro?: {
    name: string
    email: string
    address?: {
      baseAddress?: string | null //street1
      detailAddress?: string | null //street2
      city?: string | null
      state?: string | null
      country?: string | null
      zipCode?: string | null
    }
    mobile?: string | null
    timezone?: CountryType
  }
  jobList: InvoicePayableJobType[]
  subtotal: number
  tax: number | null
  taxRate: number
  totalPrice: number
  currency: CurrencyType
}
