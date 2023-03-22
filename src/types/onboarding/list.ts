import {
  CountryType,
  JobInfoType,
  PronounceType,
} from '../sign/personalInfoTypes'

export type OnboardingListType = Omit<
  OnboardingUserType,
  | 'legalNamePronunciation'
  | 'pronounce'
  | 'preferredName'
  | 'preferredNamePronunciation'
  | 'timezone'
  | 'mobile'
  | 'phone'
  | 'resume'
  | 'specialties'
  | 'notesFromPro'
  | 'contracts'
  | 'commentsOnPro'
>

export interface OnboardingJobInfoType extends JobInfoType {
  id: number
  testStatus: string
  jobId: string
  createdAt: string
  updatedAt: string
  selected: boolean
  // history: Array<TestHistoryType>
}

export type CommentsOnProType = {
  id: number
  userId: number
  firstName: string
  middleName: string | null
  lastName: string
  email: string
  createdAt: string
  updatedAt: string
  comment: string
}

export type TestHistoryType = {
  status: string
  date: string
  id: number
  reviewer: {
    firstName: string
    middleName?: string | null
    lastName: string
    email: string
  }
}

export type AssignReviewerType = {
  id: number
  reviewerId: number
  firstName: string
  middleName?: string | null
  lastName: string
  email: string
  status: string
  date: string
}

export type OnboardingUserType = {
  id: string
  userId: number
  email: string
  firstName: string
  middleName?: string
  lastName: string
  experience: string
  jobInfo: Array<OnboardingJobInfoType>
  isOnboarded: boolean
  notesFromUser?: string | null
  isActive: boolean
  legalNamePronunciation?: string | null
  pronounce?: PronounceType | null
  preferredName?: string | null
  preferredNamePronunciation?: string | null
  timezone: CountryType
  mobilePhone?: string | null
  telephone?: string | null
  resume?: Array<{
    id: number
    url: string
    fileName: string
    fileExtension: string
  }>
  contracts?: Array<{
    url: string
    fileName: string
    fileExtension: string
  }>
  specialties?: Array<string>
  commentsOnPro?: Array<CommentsOnProType>
}

export interface SelectedJobInfoType extends OnboardingJobInfoType {
  id: number
  selected: boolean
}

export interface AddRoleType {
  jobInfo: {
    jobType: string
    role: string
    source: string
    target: string
  }[]
}

export interface AddRolePayloadType {
  userId: number
  userCompany: string
  jobType: string
  role: string
  source: string
  target: string
}

export type FilterType = {
  jobType: { label: string; value: string }[]
  role: { label: string; value: string; jobType: string[] }[]
  source: { label: string; value: string }[]
  target: { label: string; value: string }[]
  experience: { label: string; value: string }[]
  testStatus: { label: string; value: string }[]
  search: string
}

export interface SelectType {
  label: string
  value: string
}

export interface RoleSelectType extends SelectType {
  jobType: string[]
}

export type OnboardingListCellType = {
  row: OnboardingListType
}

export type OnboardingFilterType = {
  take: number
  skip: number
  role?: string[]
  jobType?: string[]
  search?: string
  source?: string[]
  target?: string[]
  experience?: string[]
  testStatus?: string[]
  order?: string
}
