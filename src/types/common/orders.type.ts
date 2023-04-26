import { CountryType } from '../sign/personalInfoTypes'

export type OrderStatusType =
  | 'In preparation'
  | 'In progress'
  | 'Completed'
  | 'Invoiced'
  | 'Canceled'

export type OrderProjectInfoFormType = {
  status: OrderStatusType
  workName?: string
  projectName: string
  projectDescription?: string
  category?: string
  serviceType?: Array<string>
  expertise?: Array<string>
  revenueFrom: 'United States' | 'Korea' | 'Singapore' | 'Japan'
  orderDate: string
  projectDueDate: { date: string; timezone: CountryType }
  tax: number
}
