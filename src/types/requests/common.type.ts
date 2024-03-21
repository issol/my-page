import { CountryType } from '../sign/personalInfoTypes'

export type RequestFormType = {
  lspId: string
  contactPersonId: number
  userId?: number | null
  items: RequestItemFormType[]
  sampleFiles: Array<{
    fileName: string
    fileSize: number
  }>
  notes?: string
}

export type RequestFormPayloadType = {
  lspId: string
  contactPersonId: number
  userId?: number | null
  items: RequestItemFormPayloadType[]
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
  desiredDueDate: Date | null
  desiredDueTimezone: CountryType | null
}

export type RequestItemFormPayloadType = {
  name: string
  sourceLanguage: string
  targetLanguage: string[]
  category: string
  serviceType: string[]
  unit?: string
  quantity?: number | null
  desiredDueDate: string
  desiredDueTimezone: CountryType | null
  sortingOrder: number
}

export type RequestType = {
  lspId: string
  contactPersonId: number
  userId?: number | null
  items: RequestItemType[]
  sampleFiles: Array<{
    fileName: string
    fileSize: number
  }>
  notes?: string
}

export type RequestItemType = {
  name: string
  sourceLanguage: string
  targetLanguage: Array<{ value: string; label: string }> | null
  category: string
  serviceType: Array<{ value: string; label: string }> | null
  unit?: string
  quantity?: number | null
  desiredDueDate: Date | null
  desiredDueTimezone: CountryType | null
}
