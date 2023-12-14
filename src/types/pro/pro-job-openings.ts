import { CountryType } from '../sign/personalInfoTypes'

export type JobOpeningListType = {
  id: number
  jobType: string
  role: string
  sourceLanguage: string
  targetLanguage: string
  yearsOfExperience: string
  dueDate: Date
  dueDateTimezone: CountryType
}

export type JobOpeningListFilterType = {
  jobType?: string[]
  role?: string[]
  source?: string[]
  target?: string[]
  experience?: string[]
  dueDate?: { from?: string; to?: string }[]
  postedDate?: { from?: string; to?: string }[]

  skip: number
  take: number
}

export type JobOpeningDetailType = {
  id: number
  jobType: string
  role: string
  sourceLanguage: string
  targetLanguage: string
  yearsOfExperience: string
  dueDate: string
  vendorTimezone: CountryType
  postedTimezone: CountryType
  postedDate: string
  content: {
    blocks: Array<{
      key: string
      text: string
      type: string
      depth: number
      inlineStyleRanges: Array<{
        offset: number
        length: number
        style: string
      }>
      entityRanges: Array<any>
      data: any
    }>
    entityMap: any
  }
}
