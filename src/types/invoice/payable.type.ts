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
  status?: InvoicePayableStatusType
  taxInfo: string
  tax: number | null //tax rate
  paymentDueAt?: {
    date: string
    timezone: CountryType
  }
  paymentDate?: {
    date: string
    timezone: CountryType
  }
  invoiceDescription?: string | null
}

export type InvoicePayableDownloadData = {
  invoiceId: number
  adminCompanyName: string
  companyAddress: string
  corporationId: string
  invoicedAt: string
  paymentDueAt: { date: string; timezone: CountryType }
  pro: {
    email: string
    firstName: string
    middleName: string | null
    lastName: string
    address: string
    mobile: string
  }
  companyName: string
  jobName: string
  langItem: LanguageAndItemType
  subtotal: string
  total: string
  taxPercent: number
  tax: string | null
}
