import { CountryType } from '../sign/personalInfoTypes'

export type AddJobInfoType = {
  jobName: string
  status: string
  contactPerson: string
  serviceType: string
  languagePair: string
  jobStartDate?: string
  jobStartDateTimezone?: CountryType
  jobDueDate: string
  jobDueDateTimezone: CountryType
  jobDescription?: string
  showPro?: boolean
}

export type AddJobInfoFormType = {
  jobName: string
  status: { label: string; value: string }
  contactPerson: { label: string; value: string }
  serviceType: { label: string; value: string }
  languagePair: { label: string; value: string }
  jobStartDate?: Date
  jobStartDateTimezone?: CountryType
  jobDueDate: Date
  jobDueDateTimezone: CountryType
  jobDescription?: string
  showPro: boolean
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
  message: {
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
