import { RevenueFormType } from '../common/orders.type'
import { CountryType } from '../sign/personalInfoTypes'

export type InvoicePayableStatusType =
  | 'Invoice created'
  | 'Invoice accepted'
  | 'Paid'
  | 'Overdue'
  | 'Canceled'

export type InvoiceReceivableStatusType =
  | 'New'
  | 'In preparation'
  | 'Checking in progress'
  | 'Accepted by client'
  | 'Tax invoice issued'
  | 'Paid'
  | 'Overdue'
  | 'Overdue (Reminder sent)'
  | 'Canceled'
  | 'Under revision'
  | 'Under review'
  | 'Revised'
  | 'Invoice confirmed'

export type InvoiceProjectInfoFormType = {
  status: InvoiceReceivableStatusType
  workName?: string
  projectName: string
  invoiceDescription?: string
  category?: string
  serviceType?: Array<string>
  expertise?: Array<string>
  revenueFrom: RevenueFormType
  invoiceDate: string
  paymentDueDate: { date: string; timezone: CountryType }
  invoiceConfirmDate?: { date: string; timezone: CountryType }
  taxInvoiceDueDate?: { date: string; timezone: CountryType }
  paymentDate?: { date: string; timezone: CountryType }
  taxInvoiceIssuanceDate?: { date: string; timezone: CountryType }
  salesRecognitionDate?: { date: string; timezone: CountryType }
  salesCategory?: string
  taxInvoiceIssued: boolean
  sendReminder: boolean
  tax: number | null
  isTaxable: boolean
  notes?: string
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
  status?: string[]
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
