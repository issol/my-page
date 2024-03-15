import { ProListType } from './list'

export type LinguistTeamListType = {
  id: number
  corporationId: string
  name: string
  sourceLanguage: string
  targetLanguage: string
  serviceTypeId: number
  clientId: number
  description?: string
  pros: Array<{
    userId: number
    firstName: string
    lastName: string
  }>
  isPrivate: boolean
}

export type LinguistTeamProListFilterType = {
  take: number
  skip: number
  status?: string[]
  clientId?: number[]
  role?: string[]
  jobType?: string[]
  search?: string
  sourceLanguage?: string[]
  targetLanguage?: string[]
  experience?: string[]
  sortId?: string
  sortDate?: string
}

export type LinguistTeamFormType = {
  isPrivate: '1' | '0'
  name: string
  clientId: number
  serviceTypeId: number
  sourceLanguage: string
  targetLanguage: string
  description?: string
  isPrioritized: '1' | '0'
  pros: Array<ProListType>
}

export type LinguistTeamDetailType = {
  name: string
  clientId: number
  serviceTypeId: number
  sourceLanguage: string
  targetLanguage: string
  description?: string
  isPrivate: boolean
  authorId: number, //백엔드에서 author를 기록하기 위해 사용하는 값
	lastUpdatedAuthorId: number, //백엔드에서 author를 기록하기 위해 사용하는 값
  id: number
  corporationId: string
  author: {
    userId: number
    firstName: string
    lastName: string
    middleName?: string
    email: string
  }
  updatedAt: string
  isPrioritized: boolean
  pros: Array<ProListType>
}
