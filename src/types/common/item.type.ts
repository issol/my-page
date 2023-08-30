import { JobStatusType } from '../jobs/common.type'
import { JobPricesDetailType } from '../jobs/jobs.type'
import { ContactPersonType } from '../schema/client-contact-person.schema'
import { CountryType } from '../sign/personalInfoTypes'
import { PriceType, PriceUnitType } from './orders-and-quotes.type'
import { CurrencyType } from './standard-price'
import { MemSourceType, MemoQType } from './tm-analysis.type'

export type ItemType = Omit<
  PostItemType,
  'analysis' | 'showItemDescription'
> & {
  analysis?: Array<AnalysisFileType>
  showItemDescription?: boolean
} & {
  contactPerson?: ContactPersonType | null
}

export type AnalysisFileType = {
  id: number
  name: string
  size: number
  data: MemoQType | MemSourceType | null
}
export type PostItemType = {
  id?: number
  name: string
  dueAt?: string
  contactPersonId?: number
  source: string
  target: string
  priceId: number | null
  detail?: Array<ItemDetailType>
  description?: string | null
  showItemDescription?: '1' | '0'
  analysis?: number[] //file id를 보내기
  totalPrice: number
  quotePrice?: PriceType
}

export type ItemDetailType = {
  priceUnitId: number
  priceUnit?: string | null
  quantity: number
  unitPrice: number
  prices: number | string
  unit: string
  currency: CurrencyType
  priceFactor?: string | null
  quotePriceUnit?: PriceUnitType
}

export type JobItemType = {
  id: number
  itemName: string
  sourceLanguage: string
  targetLanguage: string
  contactPersonId: number
  jobs: Array<JobType>
}

export type JobType = {
  id: number
  order: { id: number }
  corporationId: string
  name: string
  status: JobStatusType
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
}
