import { CurrencyType } from '../common/standard-price'
import { AssignProListType } from '../orders/job-detail'
import { CountryType } from '../sign/personalInfoTypes'
import { JobStatusType } from './common.type'

export type JobsListType = {
  id: number
  corporationId: string // O-000010-TRA-001
  status: JobStatusType
  client: {
    name: string
    email: string
  }
  projectName: string
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
  jobInfo: JobInfoDetailType
  prices: JobPricesDetailType
  assignPro: { data: Array<AssignProListType>; totalCount: number }
}

export type JobInfoDetailType = {
  id: number
  corporationId: string
  jobName: string
  status: JobStatusType
  contactPerson: string
  serviceType: string
  sourceLanguage: string
  targetLanguage: string
  startedAt: string
  dueAt: string
  startTimezone: CountryType
  dueTimezone: CountryType
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
  priceId: number | null
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
