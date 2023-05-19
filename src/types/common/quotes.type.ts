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
