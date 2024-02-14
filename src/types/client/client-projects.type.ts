import { CurrencyType } from '../common/standard-price'
import { InvoiceReceivableStatusCodeLabelMixType, InvoiceReceivableStatusType } from '../invoice/common.type'
import { InvoiceReceivableOrderType } from '../invoice/receivable.type'
import { CountryType } from '../sign/personalInfoTypes'

export type ClientProjectFilterType = {
  take: number
  skip: number
  search?: string
  projectType?: string[]
  category?: string[]
  serviceType?: string[]
  status?: string[]
  dueDateFrom?: Date | null
  dueDateTo?: Date | null
  sort?: string
  hideCompletedProject?: boolean
}

export type ClientProjectListType = {
  id: number
  corporationId: string
  workName: string
  projectName: string
  category: string
  serviceType: Array<string>
  dueDate: string
  status: number
  orderDate: string
  updatedAt: string
  projectDescription: string
  type: 'order' | 'quote'
}

export type ClientInvoiceFilterType = {
  take: number
  skip: number
  search?: string
  invoicedDateTo: Date | null
  invoicedDateFrom: Date | null

  paymentDueDateFrom?: Date | null
  paymentDueDateTo?: Date | null
  hidePaidInvoices?: boolean
  status?: number[]
  sort?: string
}

export type ClientInvoiceListType = {
  id: number
  corporationId: string
  invoiceName: string
  totalPrice: number
  invoicedAt: string
  payDueAt: string
  payDueTimezone: CountryType
  description: string
  invoiceStatus: InvoiceReceivableStatusCodeLabelMixType
  currency?: CurrencyType
  updatedAt: string
  orders: InvoiceReceivableOrderType[]
  projectName: string
}
