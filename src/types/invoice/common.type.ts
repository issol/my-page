import { ItemType } from '../common/item.type'
import { RevenueFormType } from '../common/orders.type'
import { ClientType, LanguagePairTypeInItem } from '../orders/order-detail'

import { CountryType } from '../sign/personalInfoTypes'

export type InvoiceProStatusType =
  | 'Invoiced'
  | 'Under revision'
  | 'Revised'
  | 'Paid'

export type InvoicePayableStatusType =
  | 'Invoice created'
  | 'Invoice accepted'
  | 'Paid'
  | 'Overdue'
  | 'Canceled'

export type InvoiceReceivableStatusType =
  | 30000 //New
  | 30100 //In preparation
  | 30200 //Internal review
  | 30300 //Invoice sent
  | 30400 //Client review
  | 30500 //Under revision
  | 30600 //Revised
  | 30700 // Invoice confirmed
  | 30800 //Tax invoice issued
  | 30900 //Paid
  | 301000 //Overdue
  | 301100 //Overdue (Reminder sent)
  | 301200 //Canceled

export type InvoiceProjectInfoFormType = {
  status?: InvoiceReceivableStatusType
  showDescription: boolean
  workName?: string
  projectName: string
  invoiceDescription?: string
  category?: string
  serviceType?: Array<string>
  expertise?: Array<string>
  revenueFrom: RevenueFormType
  invoiceDate: string
  invoiceDateTimezone: CountryType
  paymentDueDate: { date: string; timezone: CountryType }
  invoiceConfirmDate?: { date: string | null; timezone: CountryType }
  taxInvoiceDueDate?: { date: string | null; timezone: CountryType }
  paymentDate?: { date: string | null; timezone: CountryType }
  taxInvoiceIssuanceDate?: { date: string; timezone: CountryType }
  salesRecognitionDate?: { date: string; timezone: CountryType }
  salesCategory?: string
  taxInvoiceIssued: boolean
  sendReminder: boolean
  tax: number | null
  isTaxable: boolean
  notes?: string
  subtotal: string | number
}

export type ProInvoiceListType = {
  id: number
  corporationId: string
  createdAt: string

  status: InvoiceReceivableStatusType

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
  clientInfo: Omit<ClientType, 'contactPerson'>
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
