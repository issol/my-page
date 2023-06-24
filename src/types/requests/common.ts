import { CountryType } from '../sign/personalInfoTypes'

export type RequestStatusType =
  | 'Request created'
  | 'In preparation'
  | 'Changed into quote'
  | 'Changed into order'
  | 'Canceled'

export type RequestItemFormType = {
  name: string
  source: string
  target: string
  category: string
  serviceType: string[]
  unit?: string
  quantity?: number
  desiredDueDate: {
    date: string
    timezone: CountryType
  }
}
