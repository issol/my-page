import { OnboardingUserType } from './list'

export interface OnboardingProDetailsType extends OnboardingUserType {
  corporationId: string
  createdAt: string
  updatedAt: string
  deletedAt?: string | null
  fromSNS: boolean | null
  havePreferredName: boolean
  company: string
}

export type AppliedRoleType = {
  id: number
  createdAt: string
  updatedAt: string
  userId: number
  userCompany: string
  jobType: string
  role: string
  source?: string
  target?: string
  testStatus: string
  requestStatus: string
  operatorId: string | null
  response: string | null
  test: Array<TestType>
}

export type TestType = {
  testId: number
  applicantId: number
  reviewerId: number | null
  testType: string
  testResponseUrl: string | null
  score: number | null
  isPassed: boolean
  reviewerComment: string | null
  submittedAt: string
  createdAt: string
  updatedAt: string
  deletedAt: string
  jobType: string
  role: string
  sourceLanguage: string
  status: string
  targetLanguage: string
  userCompany: string
  testPaper: TestPaperType | null
}

export type TestPaperType = {
  testPaperId: number
  testType: string
  sourceLanguage: string
  targetLanguage: string
  jobType: string
  role: string
  testPaperFormId: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}
