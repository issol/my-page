import { CurrentGuidelineType } from '@src/apis/client-guideline.api'
import { FileType } from '../common/file.type'
import { ItemDetailType } from '../common/item.type'
import { CurrencyType } from '../common/standard-price'
import { statusType } from '../common/status.type'
import { AssignProListType } from '../orders/job-detail'
import { OrderDetailType } from '../orders/order-detail'
import { ContactPersonType } from '../schema/client-contact-person.schema'
import { CountryType } from '../sign/personalInfoTypes'
import { ProJobStatusType } from './common.type'
import { PriceType } from '../common/orders-and-quotes.type'
// import { JobStatusType } from './common.type'

export type JobStatusType =
  | 60000
  | 60100
  | 60200
  | 60300
  | 60400
  | 60500
  | 60600
  | 60700
  | 60800
  | 60900
  | 601000
  | 601100

export type JobsListType = {
  id: number
  corporationId: string // O-000010-TRA-001
  status: JobStatusType
  name: string
  jobName?: string
  category: string // order의 category
  serviceType: string // job의 serviceType
  startedAt: string
  dueAt: string
  totalPrice: number
  currency: CurrencyType
  // order: OrderDetailType
  orderId: number
  client: {
    clientId: number
    email: string
    fax: string | null
    mobile: string | null
    phone: string | null
    timezone: CountryType
    name: string
  }
  contactPerson: ContactPersonType | null
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
  // id: number
  // version: number
  historyId: number
  requestor: string
  requestedAt: string
}

export type JobInfoDetailType = {
  id: number
  corporationId: string
  name: string
  status: Array<statusType>
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
  datas?: Array<{
    quantity: number
    priceUnitTitle: string
    priceUnitId: number
    unitPrice: number
    prices: number
    unit: string
  }>
  detail: ItemDetailType[]
  minimumPrice: number | null | undefined
  minimumPriceApplied: boolean
  initialPrice: PriceType | null | undefined
}

export type jobPriceHistoryType = JobPricesDetailType & {
  historyAt: string
  pro: {
    id: number
    firstName: string
    middleName: string
    lastName: string
  }
  sourceLanguage: string
  targetLanguage: string
}

export type CreateJobParamsType = {
  orderId: number
  itemId: number
  serviceType: string[]
  index?: number
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
  totalPrice: string
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
  id: number
  name: string
  size: number
  file: string // s3 key
  type: 'SAMPLE' | 'SOURCE' | 'TARGET'
  createdAt?: string
  updatedAt?: string
  savedAt?: string
  isDownloaded?: boolean
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

  // deliveries: [
  //   {
  //     id: number
  //     deliveredDate: string
  //     files: JobsFileType[]
  //     note: string
  //   },
  // ]
  // feedbacks: [
  //   {
  //     id: number
  //     isChecked: boolean
  //     name: string
  //     email: string
  //     createdAt: string
  //     feedback: string
  //   },
  // ]
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

export type ProJobDeliveryType = {
  id: number
  deliveredDate: string
  note: string
  isWithoutFile: boolean
  files: Array<JobsFileType>
}

export type ProJobFeedbackType = {
  id: number
  isChecked: boolean
  name: string
  email: string
  createdAt: string
  feedback: string
}
