import { JobStatusType } from '../jobs/common.type'
import { CountryType } from '../sign/personalInfoTypes'

export type AddJobInfoType = {
  jobName: string
  status: string
  contactPerson: string
  serviceType: string
  languagePair: string
  startedAt?: string
  startTimezone?: CountryType
  dueAt: string
  dueTimezone: CountryType
  description?: string
  isShowDescription?: boolean
}

export type AddJobInfoFormType = {
  name: string
  status: { label: JobStatusType; value: JobStatusType }
  contactPerson: { label: string; value: string; userId: number }
  serviceType: { label: string; value: string }
  languagePair: { label: string; value: string; source: string; target: string }
  startedAt?: Date
  startTimezone?: CountryType
  dueAt: Date
  dueTimezone: CountryType
  description?: string
  isShowDescription: boolean
}

export type AssignProFilterType = {
  category: { label: string; value: string }[]
  client: { label: string; value: string }[]
  serviceType: { label: string; value: string }[]
  search: string
  source: { label: string; value: string }[]
  target: { label: string; value: string }[]
  areaOfExpertise: { label: string; value: string }[]
}

export type AssignProFilterPostType = {
  take: number
  skip: number
  category?: string[]
  client?: string[]
  serviceType?: string[]

  search?: string
  source?: string[]
  target?: string[]
  areaOfExpertise?: string[]
  sortId?: string
  sortDate?: string
  isOffBoard: boolean
}

export type AssignProListType = {
  id: string
  firstName: string
  middleName: string | null
  lastName: string
  email: string
  status: string
  responseRate: number | null
  assignmentStatus: string | null
  assignmentDate: string | null
  files?: Array<{
    name: string
    size: number
    file: string // s3 key
    type: 'SAMPLE' | 'SOURCE' | 'TARGET'
  }>
  message?: {
    id: number
    unReadCount: number
    contents:
      | {
          id: number
          content: string
          createdAt: string
          firstName: string
          middleName: string | null
          lastName: string
          email: string
          role: string
        }[]
      | null
  }
}

export type SaveJobInfoParamsType = {
  contactPersonId?: number
  description?: string | null
  startDate?: string | null
  startTimezone?: CountryType | null

  dueDate?: string
  dueTimezone?: CountryType
  status?: JobStatusType
  sourceLanguage?: string | null
  targetLanguage?: string | null
  name?: string
  isShowDescription?: boolean
}
