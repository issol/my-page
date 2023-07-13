import { CountryType } from '../sign/personalInfoTypes'

export type RequestStatusType =
  | 'Request created'
  | 'In preparation'
  | 'Changed into quote'
  | 'Changed into order'
  | 'Canceled'

export type RequestFormType = {
  lspId: string
  contactPersonId: number
  items: RequestItemFormType[]
  sampleFiles: Array<{
    fileName: string
    fileSize: number
  }>
  notes?: string
}

export type RequestItemFormType = {
  name: string
  sourceLanguage: string
  targetLanguage: string
  category: string
  serviceType: string[]
  unit?: string
  quantity?: number | null
  desiredDueDate: string
  desiredDueTimezone: CountryType
}
