import { FileType } from '../common/file.type'
import { ItemDetailType } from '../common/item.type'

import { ContactPersonType } from '../schema/client-contact-person.schema'
import { CountryType } from '../sign/personalInfoTypes'

import { PriceType } from '../common/orders-and-quotes.type'
import { JobStatus } from '@src/types/common/status.type'
import { Currency } from '@src/types/common/currency.type'
export type JobStatusType =
  | 60000 // In preparation
  | 60100 //Requested
  | 60110 //Assigned
  | 60200 // In progress
  | 60250 // Redelivery requested
  | 60300 // Overdue
  | 60400 // Partially delivered
  | 60500 // Delivered
  | 60600 // Approved
  | 60700 // Invoiced
  | 60800 // Paid
  | 60900 // Without invoice
  | 601000 // Canceled
  | 601100 // Payment cancled

export type JobsListType = {
  id: number
  corporationId: string // O-000010-TRA-001
  status: JobStatus
  name: string
  jobName?: string
  category: string // order의 category
  serviceType: string // job의 serviceType
  startedAt: string
  dueAt: string
  totalPrice: number
  currency: Currency
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
  currency: Currency
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
  requestNumber: number
  historyId: number
  requestor: string
  requestedAt: string
}

export type JobPricesDetailType = {
  id: number
  source: string
  target: string
  sourceLanguage?: string
  targetLanguage?: string
  priceId: number | null
  totalPrice: number
  currency: Currency
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
  languagePair: {
    priceFactor: string
  }
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

export type CreateWithJobTemplateParamsType = {
  orderId: number
  itemId: number
  serviceType: string[]
  index?: number
}

export type autoCreateJobParamsType = {
  orderId: number
  itemId: number
  serviceType: string[]
  index?: number
}

export type ProJobListType = {
  id: number
  jobId: number
  jobRequestId?: number
  corporationId: string
  serviceType: string
  name: string
  dueAt: string
  status: JobStatus
  currency: Currency
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
  finalProDeliveredAt: string
  autoNextJob?: boolean // 트리거가 존재하는지 유무
  isPreviousAndNextJob?: boolean // 다음 아이템이 존재하는지 여부
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
  status: JobStatus
  jobRequestId: number

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
    corporationId: string
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
  isShowDescription: boolean
  finalProDeliveredAt: string
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

export type JobRequestsProType = {
  userId: number
  firstName: string
  middleName?: string
  lastName: string
  email: string
  assignmentStatus:
    | 70000
    | 70100
    | 70200
    | 70300
    | 70400
    | 70500
    | 70600
    | 70450
    | 70150
  isOnboarded: boolean
  isActive: boolean
  assignmentStatusUpdatedAt: string
  responseLight: 70000 | 70100 | 70200 | 70300 | 70400 | 70500 | 70600
  ongoingJobCount: number
  ongoingJobList: string[]
  order: number
  jobRequestId: number
}

export type JobRequestFormType = {
  type: 'relayRequest' | 'bulkAutoAssign' | 'bulkManualAssign'
  round: number
  interval?: number
  jobId: number
  pros: Array<{
    userId: number
    order: number
  }>
}

export type JobBulkRequestFormType = {
  jobId: number
  proIds: number[]
  requestType: 'relayRequest' | 'bulkAutoAssign' | 'bulkManualAssign'
  remindTime?: number
  requestIntervalSec?: number
}

export type JobAddProsFormType = {
  jobId: number
  round: number
  pros: Array<{
    userId: number
    order: number
  }>
}

export type JobAssignProRequestsType = {
  type: 'relayRequest' | 'bulkAutoAssign' | 'bulkManualAssign'
  round: number
  requestCompleted: boolean
  pros: Array<JobRequestsProType>
  interval: number
}

export type JobPrevNextItem = {
  pro: {
    userId: number
    firstName: string
    middleName: string
    lastName: string
    email: string
    isActive: boolean
    isOnboarded: boolean
  }
  serviceType: string
  dueAt: Date
  dueTimezone: CountryType
}
