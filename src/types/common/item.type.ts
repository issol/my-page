import { JobPricesDetailType } from '../jobs/jobs.type'
import { ContactPersonType } from '../schema/client-contact-person.schema'
import { CountryType } from '../sign/personalInfoTypes'
import { PriceType, PriceUnitType } from './orders-and-quotes.type'

import { MemoQType, MemSourceType } from './tm-analysis.type'
import { JobStatus } from '@src/types/common/status.type'
import { Currency } from '@src/types/common/currency.type'

export type ItemType = Omit<
  PostItemType,
  'analysis' | 'showItemDescription'
> & {
  analysis?: Array<AnalysisFileType>
  showItemDescription?: boolean
} & {
  contactPerson?: ContactPersonType | null
  initialPrice?: PriceType | null
  minimumPrice: number | null
  minimumPriceApplied: boolean
  priceFactor: number
  orderId?: number
  idx?: number
  indexing?: number
  currency: Currency | null
}

export type AnalysisFileType = {
  id: number
  name: string
  size: number
  data: MemoQType | MemSourceType | null
}
export type PostItemType = {
  id?: number
  itemName: string | null
  dueAt?: string | null
  contactPersonId?: number
  source?: string
  target?: string
  // TODO: 추후 source, target을 걷어내야 함
  sourceLanguage?: string
  targetLanguage?: string
  priceId: number | null
  detail?: Array<ItemDetailType>
  description?: string | null
  showItemDescription?: '1' | '0'
  analysis?: number[] //file id를 보내기
  totalPrice: number
  sortingOrder?: number
}

export type ItemDetailType = {
  id?: number
  priceUnitId: number
  priceUnit?: string | null
  quantity: number | null
  unitPrice: number | null
  prices: number | string
  unit: string
  currency: Currency | null
  priceFactor?: string | null
  initialPriceUnit?: PriceUnitType
  title?: string
  weighting?: string | number | undefined
}

export type JobItemType = {
  id: number
  itemName: string
  sourceLanguage: string
  targetLanguage: string
  contactPersonId: number
  sortingOrder: number
  jobs: Array<JobType>
}

export type JobType = {
  id: number
  order: { id: number }
  authorId: number
  corporationId: string
  templateId: number | null
  name: string
  status: JobStatus
  contactPersonId: number
  serviceType: string
  sourceLanguage: string
  targetLanguage: string
  startedAt: string
  dueAt: string
  startTimezone: CountryType
  dueTimezone: CountryType
  description: string
  isShowDescription: boolean
  totalPrice: number
  clientId: number
  contactPerson: {
    userId: number
    firstName: string
    middleName: string | null
    lastName: string
    email: string
  } | null
  assignedPro?: {
    id: number
    email: string
    firstName: string
    middleName: string | null
    lastName: string
    isActive: boolean
    isOnboarded: boolean
  }
  prices?: JobPricesDetailType
  feedback?: string

  files?: Array<{
    name: string
    size: number
    file: string // s3 key
    type: 'SAMPLE' | 'SOURCE' | 'TARGET'
  }>
  pro: {
    id: number
    firstName: string
    middleName: string
    lastName: string
  } | null
  historyAt: string | null // job assign이 된 날짜, 보여줄때는 로그인한 사용자의 타임존으로 보여준다.
  currency?: 'KRW' | 'JPY' | 'USD' | 'SGD'

  // trigger 정보 추가
  autoNextJob: boolean
  nextJobId: number | null
  statusCodeForAutoNextJob: number | null
  autoSharingFile: boolean
  sortingOrder: number
  isJobRequestPresent: boolean
  redeliveryHistory?: {
    jobId: number
    deleteReason: string[]
    message: string
    id: number
  }
}
