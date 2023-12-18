import { CurrentTestType } from '../certification-test/detail'

export type ProAppliedRolesStatusHistoryType = {
  id: number
  status: ProAppliedRolesStatusType
  updatedAt: string
}

export type ProAppliedRolesFilterType = {
  isActive: '0' | '1'
  skip: number
  take: number
}

export type ProAppliedRolesType = {
  id: number
  jobType: string
  role: string

  sourceLanguage: string
  targetLanguage: string
  basicTest: {
    score: number | null
    isPassed: boolean | null
    isExist: boolean
    isSkipped: boolean
    testPaperFormUrl: string
    testStartedAt: string | null
  }
  skillTest: {
    score: number | null
    isPassed: boolean
    isExist: boolean
    testPaperFormUrl: string
    testStartedAt: string | null
  }
  status: ProAppliedRolesStatusType

  reason: {
    type: 'Paused' | 'Rejected'
    from: string
    message: string
    reason: string
    retestDate: string
  } | null

  testGuideline: CurrentTestType
  statusHistory: Array<ProAppliedRolesStatusHistoryType>
}

export type ProAppliedRolesStatusType =
  | 'Awaiting approval'
  | 'Test assigned'
  | 'Role assigned'
  | 'Rejected by TAD'
  | 'Test declined'
  | 'Role declined'
  | 'Basic test Ready'
  | 'Skill test Ready'
  | 'Paused'
  | 'Basic in progress'
  | 'Basic submitted'
  | 'Basic failed'
  | 'Basic passed'
  | 'Skill in progress'
  | 'Skill submitted'
  | 'Skill failed'
  | 'Contract required'
  | 'Certified'
  | 'Test in preparation'
