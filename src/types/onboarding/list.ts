import { JobInfoType } from '../sign/personalInfoTypes'

export type OnboardingListType = {
  id: string
  userId: number
  email: string
  firstName: string
  middleName?: string | null
  lastName: string
  jobInfo: Array<JobInfoType>
  experience: string
  testStatus: string
  isOnboarded: boolean
}
