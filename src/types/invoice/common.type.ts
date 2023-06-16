import { RevenueFormType } from '../common/orders.type'
import { CountryType } from '../sign/personalInfoTypes'

export type InvoicePayableStatusType =
  | 'Invoice created'
  | 'Invoice accepted'
  | 'Paid'
  | 'Overdue'
  | 'Canceled'

export type InvoiceReceivableStatusType =
  | 'In preparation'
  | 'Checking in progress'
  | 'Accepted by client'
  | 'Tax invoice issued'
  | 'Paid'
  | 'Overdue'
  | 'Overdue (Reminder sent)'
  | 'Canceled'

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
