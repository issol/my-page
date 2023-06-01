import { CurrencyType } from '@src/types/common/standard-price'
import { InvoicePayableStatusType } from './common.type'

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

  mine?: boolean
  hidePaid?: boolean

  skip: number
  take: number
}

export type InvoicePayableListType = {
  id: number
  corporationId: string
  status: InvoicePayableStatusType
  pro: { name: string; email: string }
  invoiceDate: string
  paymentDue: string
  paymentDate: string
  totalPrice: number
  currency: CurrencyType
}
