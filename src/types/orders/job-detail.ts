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
