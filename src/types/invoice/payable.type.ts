import { CountryType } from '../sign/personalInfoTypes'
import { Currency } from '@src/types/common/currency.type'
import { InvoicePayableStatus } from '@src/types/common/status.type'

export type InvoicePayableFilterType = {
  invoiceStatus?: number[]
  proId?: number[]
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
  invoiceStatus: InvoicePayableStatus
  pro?: { name: string; email: string }
  invoicedAt: string
  payDueAt?: string
  payDueTimezone?: CountryType | null
  paidAt: string | null
  paidDateTimezone: CountryType | null
  totalPrice: number
  currency: Currency
  statusUpdatedAt: string
}

export type PayableFormType = {
  taxInfo?: string
  taxRate?: string | null
  invoiceStatus?: InvoicePayableStatus
  payDueAt?: string
  payDueTimezone?: CountryType
  paidAt?: string | null
  paidDateTimezone?: CountryType | null
  description?: string
  subtotal?: number
  totalPrice?: number
  tax?: string | null
  invoiceConfirmedAt?: string
  invoiceConfirmTimezone?: CountryType
}

export type InvoicePayableDetailType = {
  id: number
  corporationId: string
  invoicedAt: string
  invoicedTimezone: CountryType
  invoiceStatus: InvoicePayableStatus

  pro?: {
    id: number
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
  taxRate: string
  payDueAt?: string
  payDueTimezone?: CountryType
  paidAt: string | null
  paidDateTimezone: CountryType | null
  description: string
  currency: Currency
  subtotal: number
  totalPrice: number
  tax: string | null
  invoiceConfirmedAt: string | null
  invoiceConfirmTimezone?: CountryType
  jobs: {
    count: number
    totalCount: number
    data: Array<InvoicePayableJobType>
  }
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
  invoiceStatus: InvoicePayableStatus
  invoiceConfirmedAt: string | null
  invoiceConfirmTimezone?: CountryType
  pro?: { name: string; email: string; id: number }
  taxInfo: string
  taxRate: string
  payDueAt?: string
  payDueTimezone?: CountryType
  paidAt: string | null
  paidDateTimezone: CountryType | null
  description: string
  currency: Currency
  subtotal: number
  totalPrice: number
  tax: string

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
  tax: string | null
  taxRate: string
  totalPrice: number
  currency: Currency
}
