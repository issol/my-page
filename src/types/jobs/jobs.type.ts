import { CurrentGuidelineType } from '@src/apis/client-guideline.api'
import { FileType } from '../common/file.type'
import { ItemDetailType } from '../common/item.type'
import { CurrencyType } from '../common/standard-price'
import { AssignProListType } from '../orders/job-detail'
import { OrderDetailType } from '../orders/order-detail'
import { ContactPersonType } from '../schema/client-contact-person.schema'
import { CountryType } from '../sign/personalInfoTypes'
import { JobStatusType, ProJobStatusType } from './common.type'

export type JobsListType = {
  id: number
  corporationId: string // O-000010-TRA-001
  status: JobStatusType

  name: string
  category: string // order의 category
  serviceType: string // job의 serviceType
  startedAt: string
  dueAt: string
  totalPrice: number
  currency: CurrencyType
  order: OrderDetailType
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
  requestedAt: string
}

export type JobInfoDetailType = {
  id: number
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
  files: Array<{
    name: string
    size: number
    file: string // s3 key
    type: 'SAMPLE' | 'SOURCE' | 'TARGET'
  }>
}

export type JobPricesDetailType = {
  id: number
  source: string
  target: string
  priceId: number | null
  totalPrice: number
  currency: CurrencyType
  priceName: string
  isUsedCAT: boolean
  datas: Array<{
    quantity: number
    priceUnitTitle: string
    priceUnitId: number
    unitPrice: number
    prices: number
    unit: string
  }>
}

export type CreateJobParamsType = {
  orderId: number
  itemId: number
  serviceType: string[]
}

export type ProJobListType = {
  id: number
  corporationId: string
  serviceType: string
  name: string
  dueAt: string
  status: ProJobStatusType
  currency: CurrencyType
  lightUpDot: boolean
  message: {
    unReadCount: number
    contents:
      | {
          id: number
          content: string
          createdAt: string
          firstName: string
          middleName: string | null
          lastName: string
          email: string
          role: string
        }[]
      | null
  }
}

export type JobsFileType = {
  name: string
  size: number
  file: string // s3 key
  type: 'SAMPLE' | 'SOURCE' | 'TARGET'
  createdAt?: string
  updatedAt?: string
}

export type ProJobDetailType = {
  id: number
  corporationId: string
  name: string
  status: ProJobStatusType

  order: {
    client: {
      clientId: number
      email: string
      fax: string | null
      mobile: string | null
      phone: string | null
      timezone: CountryType
      name: string
      taxable: boolean
      tax: number | null
    }
  }

  contactPerson: ContactPersonType | null
  category: string
  serviceType: string
  sourceLanguage: string
  targetLanguage: string
  requestedAt: string
  startedAt: string
  dueAt: string
  price: {
    data: ItemDetailType[]
    totalPrice: number
    isUsedCAT: boolean
  }
  guideLines: ProGuidelineType | null
  description: string
  files: Array<JobsFileType>

  deliveries: [
    {
      id: number
      deliveredDate: string
      files: JobsFileType[]
      note: string
    },
  ]
  feedbacks: [
    {
      id: number
      isChecked: boolean
      name: string
      email: string
      createdAt: string
      feedback: string
    },
  ]
}

export type ProGuidelineType = {
  id: number
  version?: number
  userId: number
  title: string
  writer: string
  email: string
  client: string
  category: string
  serviceType: string
  updatedAt: string
  content: any
  files: Array<FileType>
}
