import { FileType } from '../common/file.type'
import { ItemDetailType } from '../common/item.type'

import { CountryType } from '../sign/personalInfoTypes'
import { Currency } from '@src/types/common/currency.type'

export enum ProListForJobBySortEnum {
  LEGAL_NAME = 'LegalName',
  STATUS = 'status',
  AVG_RESPONSE = 'AvgResponse',
  ONGOING_JOBS = 'ongoingJobs',
}

export type AddJobInfoType = {
  jobName: string
  status: number
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
  // status: { label: JobStatusType; value: JobStatusType }
  status: number
  contactPerson: { label: string; value: string; userId: number }
  serviceType: string
  // languagePair: { source: string; target: string }
  source: string | null
  target: string | null
  startedAt?: Date
  startTimezone?: {
    id: number | undefined
    label: string
    code: string
    pinned: boolean
  }
  dueAt: Date
  dueTimezone: {
    id: number | undefined
    label: string
    code: string
    pinned: boolean
  }
  description?: string
  isShowDescription: boolean
}

export type AssignProFilterType = {
  category: { label: string; value: string }[]
  client: { label: string; value: number }[]
  serviceType: { label: string; value: string }[]
  search: string
  source: { label: string; value: string }[]
  target: { label: string; value: string }[]
  genre: { label: string; value: string }[]
}

export type AssignProFilterPostType = {
  take: number
  skip: number
  category?: string[]
  client?: number[]
  serviceType?: string[]

  search?: string
  source?: string[]
  target?: string[]
  genre?: string[]
  sortId?: string
  sortDate?: string
  isOffBoard: '0' | '1'
  sort?: ProListForJobBySortEnum
  ordering?: 'DESC' | 'ASC'
}

export type AssignProListType = {
  userId: number
  firstName: string
  middleName: string | null
  lastName: string
  email: string
  isOnboarded: boolean
  isActive: boolean
  status: string
  responseRate: number | null
  assignmentStatus: 70000 | 70100 | 70200 | 70300 | 70400 | 70500 | 70600 | null
  assignmentDate: string | null
  responseLight: 70000 | 70100 | 70200 | 70300 | 70400 | 70500 | 70600 // statusCode
  ongoingJobCount: number
  avgResponseTime: number // 분단위 표시
  ongoingJobList: string[]
}

export type SaveJobInfoParamsType = {
  contactPersonId: number
  description?: string | null
  startDate?: string | null
  startTimezone?: CountryType | null

  dueDate?: string
  dueTimezone?: CountryType
  status?: number
  sourceLanguage?: string | null
  targetLanguage?: string | null
  name?: string
  isShowDescription?: string
}

export type SaveJobPricesParamsType = {
  jobId: number
  priceId: number
  totalPrice: number
  currency: Currency | null
  detail: ItemDetailType[]
}

export type JobRequestReviewListType = {
  id: number
  jobId: number
  corporationId: string
  createdAt: string
  requestorInfo: {
    name: string
  }
  index: number
  assigneeId: number
  isCompleted: boolean
  dueDate: string
  dueDateTimezone: CountryType
  runtime: string
  wordCount: string
  files: FileType[]
  noteToAssignee: string
  reviewedNote: string
}

export type JobRequestReviewFormType = {
  assignee: number
  desiredDueAt: Date
  desiredDueTimezone: CountryType
  runtime: string
  wordCount: string
  note: string
}

export type JobRequestReviewParamsType = {
  jobId: number
  assigneeId: number
  dueDate: Date
  dueDateTimezone: CountryType
  runtime: string
  wordCount: string
  noteToAssignee: string
  files: Array<{
    name: string
    path: string
    extension: string
    size: number
    type: 'SAMPLE' | 'SOURCE' | 'TARGET' | 'REVIEWED'
    jobFileId?: number
  }>
}
