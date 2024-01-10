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
  requestStatusOfPro: string
  operatorId: string | null
  response: string | null
  messageToUser: string | null
  reason: string | null
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
  testPaperFormUrl: string
  responderUri: string
}

export type CertifiedRoleType = {
  id: number
  createdAt: string
  updatedAt: string
  userId: number
  userEmail: string
  userCompany: string
  firstName: string
  middleName?: string
  lastName: string
  jobType: string
  role: string
  source: string
  target: string
  deletedAt: string | null
}

export enum checkDuplicateResponseEnum {
  CAN_BE_CREATED = 1, // 시험 및 롤 요청 가능
  ALREADY_HAVE_A_ROLE = 30, // 이미 certified role 가지고 있음
  ROLE_REQUEST_DUPLICATED = 31, // TAD가 중복 언어+롤 role assign 요청함 (Pro가 수락/거절 선택 전)
  TEST_REQUEST_DUPLICATED = 32, // Pro가 중복 언어+롤 test apply 요청함
  NOT_RESPONDED_PRO = 33, // TAD가 중복 언어+롤 test assign 요청함 (Pro가 수락/거절 선택 전)
  REQUEST_ACCEPTED_PRO = 34, // Pro가 해당 언어+롤 테스트 진행중
  ALREADY_REQUESTED_ROLE = 35, // 이미 언어+롤 role assign 받은상태 에서 test apply 요청했을때
}
