import { CurrencyType } from '@src/types/common/standard-price'
import { InvoicePayableStatusType } from './common.type'
import { CountryType } from '../sign/personalInfoTypes'
import { LanguageAndItemType } from '../orders/order-detail'

export type InvoicePayableFilterType = {
  invoiceStatus?: string[]
  pro?: string[]
  invoicedDateFrom?: string
  invoicedDateTo?: string // 또는 invoiceDate : Date[]
  payDueDateFrom?: string
  payDueDateTo?: string // 또는 paymentDue : Date[]
  paidDateFrom?: string
  paidDateTo?: string // 또는 paymentDate : Date[]
  search?: string

  mine?: 0 | 1
  hidePaid?: 0 | 1

  skip: number
  take: number
}

export type InvoicePayableListType = {
  id: number
  adminCompanyName: string //추가
  corporationId: string
  invoiceStatus: InvoicePayableStatusType // 수정
  pro: { name: string; email: string }
  invoicedAt: string //수정
  payDueAt: string //수정
  payDueTimezone: CountryType | null //추가
  paidAt: string | null
  paidDateTimezone: CountryType | null //추가
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
