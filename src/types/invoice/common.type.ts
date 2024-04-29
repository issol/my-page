import { ItemType } from '../common/item.type'
import { RevenueFormType } from '../common/orders.type'
import { ClientType, LanguagePairTypeInItem } from '../orders/order-detail'

import { CountryType } from '../sign/personalInfoTypes'
import { InvoiceReceivableStatus } from '@src/types/common/status.type'

export type InvoiceProjectInfoFormType = {
  status?: InvoiceReceivableStatus
  showDescription: boolean
  workName?: string
  projectName: string
  invoiceDescription?: string
  category?: string
  serviceType?: Array<string>
  genre?: Array<string>
  revenueFrom: RevenueFormType
  invoiceDate: Date
  invoiceDateTimezone: { id: number | undefined, label: string; code: string, pinned: boolean }
  paymentDueDate: { date: string; timezone: { id: number | undefined, label: string; code: string, pinned: boolean } }
  invoiceConfirmDate?: { date: string | null; timezone: { id: number | undefined, label: string; code: string, pinned: boolean } | null }
  taxInvoiceDueDate?: { date: string | null; timezone: { id: number | undefined, label: string; code: string, pinned: boolean } | null }
  paymentDate?: { date: string | null; timezone: { id: number | undefined, label: string; code: string, pinned: boolean } | null }
  taxInvoiceIssuanceDate?: { date: string | null; timezone: { id: number | undefined, label: string; code: string, pinned: boolean } }
  salesRecognitionDate?: { date: string | null; timezone: { id: number | undefined, label: string; code: string, pinned: boolean } }
  salesCategory?: string
  taxInvoiceIssued: boolean
  setReminder: boolean
  tax: string | null
  isTaxable: boolean
  notes?: string
  subtotal: string | number
}

export type ProInvoiceListType = {
  id: number
  corporationId: string
  createdAt: string

  status: InvoiceReceivableStatus

  invoicedAt: string | null
  payDueAt: string | null
  payDueTimezone: CountryType
  paidAt: string | null
  paidDateTimezone: CountryType | null
}

export type ProInvoiceListFilterType = {
  status?: number[]
  invoicedDateFrom?: string
  invoicedDateTo?: string
  payDueDateFrom?: string
  payDueDateTo?: string
  paidDateFrom?: string
  paidDateTo?: string

  mine?: 0 | 1
  hidePaid?: 0 | 1

  skip: number
  take: number
}

export type InvoiceMultipleOrderType = {
  clientInfo: ClientType
  revenueFrom: RevenueFormType
  orders: Array<{
    id: number
    projectName: string
    corporationId: string
    items: Array<ItemType>
    languagePairs: Array<LanguagePairTypeInItem>
    subtotal: number
  }>
}
