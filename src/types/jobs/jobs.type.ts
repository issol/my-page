import { CurrencyType } from '../common/standard-price'
import { JobStatusType } from './common.type'

export type JobsListType = {
  id: number
  corporationId: string // O-000010-TRA-001
  status: JobStatusType
  client: {
    name: string
    email: string
  }
  jobName: string
  category: string // order의 category
  serviceType: string // job의 serviceType
  startedAt: string
  dueAt: string
  totalPrice: number
  currency: CurrencyType
}

export type JobsTrackerListType = {
  id: number
  client: { name: string; email: string }
  name: string //work name
  category: string
  serviceType: string[]
  currency: CurrencyType
  totalPrice: number //해당 Currency를 기준으로 환율 계산 Order date 날짜의 환율을 기준으로 함
}

export type JobsTrackerDetailType = {
  id: number
  isDelivered: boolean
  name: string //job name
  itemDueDate: string
  contactPerson: { id: number; name: string }
  jobDueDate: string
  assignedPro: {
    id: number
    name: string
    jobTitle: string
    email: string
    isOnboarded: boolean
    isActive: boolean
  } | null
  serviceType: string
  source: string
  target: string
}

export type JobHistoryType = {
  id: number
  version: number
  requestor: string
  createdAt: string
}

export type JobInfoDetailType = {
  id: number
  jobName: string
  status: JobStatusType
  contactPerson: string
  serviceType: string
  sourceLanguage: string
  targetLanguage: string
  startedAt: string
  dueAt: string
  description: string
  isShowDescription: boolean
  files: Array<{
    name: string
    size: number
    file: string // s3 key
    type: 'SAMPLE' | 'SOURCE' | 'TARGET'
  }>
}

export type JobPricesDetailType = {
  id: number
  sourceLanguage: string
  targetLanguage: string
  priceId: number
  totalPrice: number
  currency: CurrencyType
  priceName: string
  data: Array<{
    quantity: number
    priceUnitTitle: string
    priceUnitId: number
    unitPrice: number
    prices: number
  }>
}
