import { CurrencyType } from '../common/standard-price'

export type ClientProjectFilterType = {
  take: number
  skip: number
  search?: string
  projectType?: string[]
  category?: string[]
  serviceType?: string[]
  status?: string[]
  dueDate?: Date[]
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
  status: string
  orderDate: string
  projectDescription: string
  type: 'order' | 'quote'
}

export type ClientInvoiceFilterType = {
  take: number
  skip: number
  search?: string
  invoicedDate?: Date[]
  paymentDueDate?: Date[]
  hidePaidInvoices?: boolean
  status?: string[]
  sort?: string
}

export type ClientInvoiceListType = {
  id: number
  iId: string
  invoiceName: string
  amount: number
  invoicedDate: string
  paymentDueDate: string
  invoiceDescription: string
  status: string
  currency: CurrencyType
}
