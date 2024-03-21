import { CurrentTestType } from '../certification-test/detail'
import { AppliedRolesStatus } from '@src/types/common/status.type'

export type ProAppliedRolesStatusHistoryType = {
  id: number
  status: AppliedRolesStatus
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
  status: AppliedRolesStatus

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
