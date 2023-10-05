import { CurrencyType } from '../common/standard-price'
import { CountryType } from '../sign/personalInfoTypes'
import { InvoiceProStatusType } from './common.type'

export type InvoiceProFilterType = {
  invoiceStatus?: number[]

  invoicedDateFrom?: string
  invoicedDateTo?: string

  paidDateFrom?: string
  paidDateTo?: string
  search?: string

  hidePaid?: '0' | '1'

  skip: number
  take: number
}

export type InvoiceProListType = {
  id: number
  adminCompanyName: string
  corporationId: string
  invoiceStatus: InvoiceProStatusType

  invoicedAt: string

  paidAt: string | null
  paidDateTimezone: CountryType | null
  totalPrice: number
  currency: CurrencyType
  statusUpdatedAt: string
}

export type InvoiceProDetailType = {
  id: number
  corporationId: string
  invoicedAt: string
  invoicedAtTimezone: CountryType
  invoiceStatus: InvoiceProStatusType

  taxInfo: string
  taxRate: number

  paidAt: string | null
  paidDateTimezone: CountryType | null
  description: string
  currency: CurrencyType
  subtotal: number
  totalPrice: number
  tax: number | null
  invoiceConfirmedAt: string | null
}
