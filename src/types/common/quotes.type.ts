import { CountryType } from '../sign/personalInfoTypes'

export type QuoteStatusType =
  | 'New'
  | 'In preparation'
  | 'Review before submission'
  | 'Pending'
  | 'Expired'
  | 'Rejected'
  | 'Accepted'
  | 'Changed into order'
  | 'Canceled'

export type QuotesProjectInfoFormType = {
  status: QuoteStatusType
  workName?: string
  projectName: string
  projectDescription?: string
  category: string
  serviceType: Array<string>
  expertise?: Array<string>
  quoteDate: string
  projectDueDate: { date: string; timezone: CountryType }
  quoteDeadline: { date: string; timezone: CountryType }
  quoteExpiryDate: { date: string; timezone: CountryType }
  estimatedDeliveryDate: { date: string; timezone: CountryType }
}

export type QuotesListType = {
  id: string
  corporationId: string
  status: QuoteStatusType
  projectName: string
  client: {
    name: string
    email: string
  }
  contactPerson: {
    firstName: string
    middleName: string | null
    lastName: string
    email: string
  }
  category: string
  serviceType: Array<string>
  quoteDate: string
  quoteDeadline: string
  quoteExpiry: string
  totalPrice: number
}

export type ProjectInfoType = {
  id: number
  corporationId: string
  quoteDate: string
  status: QuoteStatusType
  workName: string
  category: string
  serviceType: string[]
  expertise: string[]
  projectName: string
  projectDescription: string
  projectDueAt: string
  projectDueTimezone: CountryType
  quoteDeadline: string
  quoteDeadlineTimezone: CountryType
  quoteExpiryDate: string
  quoteExpiryDateTimezone: CountryType
  estimatedDeliveryDate: string
  estimatedDeliveryDateTimezone: CountryType
  tax: number
}
