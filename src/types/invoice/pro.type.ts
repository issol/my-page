import { CountryType } from '../sign/personalInfoTypes'
import { InvoicePayableStatus } from '@src/types/common/status.type'
import { Currency } from '@src/types/common/currency.type'

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
  invoiceStatus: InvoicePayableStatus

  invoicedAt: string

  paidAt: string | null
  paidDateTimezone: CountryType | null
  totalPrice: number
  currency: Currency
  statusUpdatedAt: string
}

export type InvoiceProDetailType = {
  id: number
  corporationId: string
  invoicedAt: string
  invoicedAtTimezone: CountryType
  invoiceStatus: InvoicePayableStatus

  taxInfo: string
  taxRate: number

  paidAt: string | null
  paidDateTimezone: CountryType | null
  description: string
  currency: InvoicePayableStatus
  subtotal: number
  totalPrice: number
  tax: number | null
  invoiceConfirmedAt: string | null
}
