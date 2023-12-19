import { OrderStatusType } from '@src/types/common/orders.type'
import { RoleType, UserType } from '@src/context/types'
import { QuoteStatusType } from '@src/types/common/quotes.type'
import { InvoiceReceivableStatusType } from '@src/types/invoice/common.type'
import { JobItemType, JobType } from '@src/types/common/item.type'
import { Dispatch } from 'react'
import { getExpectedIncome } from '@src/apis/dashboard/lpm'

export type ViewMode = 'company' | 'personal'

export type CSVDataType = Array<Object>

export interface CSVDataRecordProps {
  dataRecord: CSVDataType
  setDataRecord: Dispatch<CSVDataType>
}

export interface ViewModeQuery {
  userId: number | null
  view: ViewMode
}

export interface DashboardQuery extends Partial<ViewModeQuery> {
  from: string // 시작 날짜
  to: string // 종료날짜
}

export type RequestType = 'new' | 'recruiting'

export type ViewType =
  | 'created'
  | 'invoiced'
  | 'canceled'
  | 'ongoing'
  | 'applied'
  | 'passed'
  | 'failed'
  | 'approved'

export type OrderType = 'asc' | 'desc'

export interface SortOptions {
  sort: string
  ordering: OrderType
}

export interface DashboardPaginationQuery
  extends Partial<ViewModeQuery>,
    Partial<SortOptions> {
  take: number
  skip: number
}

export interface RequestQuery
  extends DashboardPaginationQuery,
    Partial<ViewModeQuery> {
  path: string
}

export interface DashboardMemberQuery
  extends Pick<DashboardPaginationQuery, 'take' | 'skip'> {
  search: string
}

export interface DashboardOngoingCountQuery extends DashboardQuery {
  countType: 'job' | 'order' | 'application'
}
export type ReportItem = {
  requests: number
  quotes: number
  orders: number
  receivables: number
  payables: number
  canceled: number
  invoiceReceivables?: number
  invoicePayables?: number
}

export type RequestItem = {
  id: number
  corporationId: string
  client: number
  companyName: string
  category: string
  serviceType: string
  itemCount: number
  desiredDueDate: string
  desiredDueTimezone: {
    code: string
    label: string
    phone: string
  }
}

export type RecruitingRequest = {
  id: 33
  jobType: string
  role: string
  sourceLanguage: string
  targetLanguage: string
  openings: number
  dueAt: string
  dueTimezone: string
  deadlineWarning: boolean
}

export type OrderItem = {
  id: number
  projectName: string
  category: string
  serviceType: Array<string>
  status: OrderStatusType
  client: {
    id: number
    name: string
    email: string
  }
}

export type JobItem = {
  id: number
  jobName: string
  jobType: string

  status: OrderStatusType
  pro: Partial<MemberItem>
}

export type ApplicationItem = {
  role?: string
  sourceLanguage: string
  targetLanguage: string
} & JobItem

export type Currency =
  | 'convertedToJPY'
  | 'convertedToKRW'
  | 'convertedToSGD'
  | 'convertedToUSD'
  | 'onlyJPY'
  | 'onlyKRW'
  | 'onlySGD'
  | 'onlyUSD'
  | 'incomeUSD'
  | 'incomeJPY'
  | 'incomeKRW'
  | 'incomeSGD'
  | 'JPY'
  | 'KRW'
  | 'SGD'
  | 'USD'

export type APIType = 'u' | 'cert'

export type TotalItem = {
  name: string
  count: number
  sum: number
  ratio: number
}

export type JobTypeAndRole = {
  numbering?: number
  jobType: string
  role: string
  count: number
  ratio: number
  sortingOrder: number
}

export interface RatioQuery extends DashboardQuery, Partial<ViewModeQuery> {
  filter?: string
  title: string
  type: string
  path?: string
  currency: Currency
  apiType?: APIType
}

export interface RatioItem {
  count: number
  name?: string
  ratio: number
  sortingOrder: number
  sum: number
  apiType?: APIType
}

export interface PairRatioItem extends RatioItem {
  sourceLanguage: string
  targetLanguage: string
}

export interface CategoryRatioItem extends RatioItem {
  category: string
}

export interface ServiceRatioItem extends RatioItem {
  serviceType: string
}

export interface ExpertiseRatioItem extends RatioItem {
  expertise: string
}
export interface RatioResponse<T> {
  totalCount: number
  totalPrice: number
  currency: Currency
  report: Array<T>
}

export type MemberItem = {
  userId: number
  permissionGroups: Array<string>
  companyId: string
  firstName: string
  middleName: string | null
  lastName: string
  email: string
  jobTitle: string
  type: UserType
  department: string | null
  createdAt: string | Date
  updatedAt: string | Date
  deletedAt: string | Date
}

export type UpcomingItem = {
  id: number
  corporationId: string
  name: string | null
  dueAt: string
  dueTimezone: string | null
  deadlineWarning: boolean
}

export interface CountQuery
  extends DashboardQuery,
    Omit<DashboardPaginationQuery, 'type'>,
    Partial<ViewModeQuery> {
  type: ViewType
  countType: 'job' | 'order' | 'application'
  sort: string
  ordering: OrderType
}

export type LongStandingReceivableItem = {
  id: number
  corporationId: string
  status: InvoiceReceivableStatusType
  projectName: string
  category: string
  serviceType: string
  totalPrice: number
  currency: Currency
  client: {
    id: number
    name: string
    email: string
  }
}

export type LongStandingPayablesItem = {
  id: number
  corporationId: string
  currency: Currency
  totalPrice: number
  invoicedAt: string
  invoicedTimezone: {
    code: string
    label: string
    phone: string
  }
  payDueAt: string
  payDueTimezone: {
    code: string
    label: string
    phone: string
  }
  statusUpdatedAt: string
  pro: {
    userId: number
    email: string
    firstName: string
    middleName: string
    lastName: 'Last'
  }
  status: InvoiceReceivableStatusType
}

export type LongStandingDataType = 'receivable' | 'payable'
export interface LongStandingQuery extends DashboardPaginationQuery {
  dataType: LongStandingDataType
}

export type ExpectedIncomeSort = 'requestDate' | 'dueDate'
export interface ExpectedIncomeQuery {
  month: number
  sort: ExpectedIncomeSort
}

export type ExpectedIncome = {
  month: string
  incomeKRW: number
  incomeUSD: number
  incomeJPY: number
  incomeSGD: number
  acceptedCount: number
  rejectedCount: number
}

export interface TotalAmountQuery {
  year: number
  month: number
  amountType: 'invoiced' | 'payment'
}

export type TotalAmountItem = {
  totalAmountKRW: number
  totalAmountUSD: number
  totalAmountJPY: number
  totalAmountSGD: number
}

export type InvoiceOverviewItem = {
  month: string
  invoiceKRW: number
  invoiceUSD: number
  invoiceJPY: number
  invoiceSGD: number
}

export type Office = 'Korea' | 'US' | 'Singapore' | 'Japan'
export type PaymentType = {
  userType: 'client' | 'pro'
  office?: Office
}
