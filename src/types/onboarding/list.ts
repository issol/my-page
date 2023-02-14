import {
  CountryType,
  JobInfoType,
  PronounceType,
} from '../sign/personalInfoTypes'

// export type OnboardingListType = {
//   id: string
//   userId: number
//   email: string
//   firstName: string
//   middleName?: string | null
//   lastName: string
//   jobInfo: Array<JobInfoType>
//   experience: string
//   testStatus: string
//   isOnboarded: boolean
// }

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
>

export interface OnboardingJobInfoType extends JobInfoType {
  id: number
  status: string
  history: Array<TestHistoryType>
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
  middleName: string | null
  lastName: string
  experience: string
  jobInfo: Array<OnboardingJobInfoType>
  isOnboarded: boolean
  notesFromPro?: string | null
  isActive: boolean
  legalNamePronunciation?: string | null
  pronounce?: PronounceType | null
  preferredName?: string | null
  preferredNamePronunciation?: string | null
  timezone: CountryType
  mobile?: string | null
  phone?: string | null
  resume?: Array<string>
  contracts?: Array<string>
  specialties?: Array<string>
  commentsOnPro?: Array<CommentsOnProType>
}

export interface SelectedJobInfoType extends OnboardingJobInfoType {
  id: number
  selected: boolean
}

export type AddRoleType = {
  jobInfo: {
    jobType: string
    role: string
    source: string
    target: string
  }[]
}