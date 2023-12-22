import { CountryType } from '../sign/personalInfoTypes'

export enum applyResponseEnum {
  ALREADY_APPLIED = 10,
  ALREADY_HAVE_A_ROLE = 11,
  TESTING_IN_PROGRESS = 12,
  TEST_COUNT_EXCEEDED = 13,
  TEST_EXISTS = 20, // role-and-test api 호출
  UNABLE_PROCEED_TEST = 21,
  TEST_NOT_EXIST = 22, // 시험이 존재하지 않기 때문에 온보딩 리스트에 신청 가능합니다
}

export type JobOpeningListType = {
  id: number
  jobType: string
  role: string
  sourceLanguage: string
  targetLanguage: string
  yearsOfExperience: string
  dueDate: Date
  dueDateTimezone: CountryType
  corporationId: string
}

export type JobOpeningListFilterType = {
  jobType?: string[]
  role?: string[]
  source?: string[]
  target?: string[]
  yearsOfExperience?: string[]
  dueDate?: { from?: string; to?: string }[]
  postedDate?: { from?: string; to?: string }[]
  company: string

  skip: number
  take: number
}

export type JobOpeningDetailType = {
  id: number
  corporationId: string
  jobType: string
  role: string
  sourceLanguage: string
  targetLanguage: string
  yearsOfExperience: string
  dueDate: string
  dueDateTimezone: CountryType
  createdTimezone: CountryType
  createdAt: string
  content: {
    blocks: Array<{
      key: string
      text: string
      type: string
      depth: number
      inlineStyleRanges: Array<{
        offset: number
        length: number
        style: string
      }>
      entityRanges: Array<any>
      data: any
    }>
    entityMap: any
  }
}
