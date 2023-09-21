import { CurrencyType } from '../common/standard-price'
import { statusType } from '../common/status.type'
import { AssignProListType } from '../orders/job-detail'
import { OrderDetailType } from '../orders/order-detail'
import { ContactPersonType } from '../schema/client-contact-person.schema'
import { CountryType } from '../sign/personalInfoTypes'
// import { JobStatusType } from './common.type'

// export type JobStatusType =
//   | 60000
//   | "In preparation"
//   | 60100
//   | "Requested"
//   | 60200
//   | "Request accepted"
//   | 60300
//   | "Request rejected"
//   | 60400
//   | "Canceled"
//   | 60500
//   | "Assigned"
//   | 60700
//   | "In progress"
//   | 60800
//   | "Partially delivered"
//   | 60900
//   | "Delivered"
//   | 601000
//   | "Overdue"
//   | 601100
//   | "Approved"
//   | 601200
//   | "Invoiced"
//   | 601300
//   | "Without invoice"
//   | 601400
//   | "Paid"

export type JobsListType = {
  id: number
  corporationId: string // O-000010-TRA-001
  status: Array<statusType>
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
  id: number
  version: number
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
  index?: number
}
