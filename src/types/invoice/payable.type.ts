import { CurrencyType } from '@src/types/common/standard-price'
import { InvoicePayableStatusType } from './common.type'
import { CountryType } from '../sign/personalInfoTypes'

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
  payDueTimezone: CountryType //추가
  paidAt: string | null
  paidDateTimezone: CountryType | null //추가
  totalPrice: number
  currency: CurrencyType
}
